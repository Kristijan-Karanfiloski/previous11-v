import moment from 'moment';

import {
  BasicPlayerStatsNew,
  BenchmarkData,
  Drills,
  GameAny,
  GameType,
  IntensityZones,
  Player,
  Substitutions
} from '../../types';
import { Tag } from '../../types/config';
import {
  defaultCategoryPicker,
  getDefaultTrainingCategoryOption,
  manualCategory
} from '../components/EventModals/helpers';
import {
  EventDetailsType,
  REPEAT_EVENT_OPTION
} from '../components/EventModals/types';
import { IconTypes } from '../components/icon/icons';
import { IBestMatch } from '../converters/club';
import { OnlineTag } from '../redux/slices/onlineTagsSlice';

import { EVENT_SUBSESSIONS, utils } from './mixins';
moment.suppressDeprecationWarnings = true;

export function formatDateTime(
  dateObjOrStr: any,
  formatStr = 'YYYY/MM/DD'
): string | number {
  if (dateObjOrStr && dateObjOrStr.toDate) {
    dateObjOrStr = dateObjOrStr.toDate();
  }
  if (formatStr === 'timestamp') {
    return moment(dateObjOrStr).toDate().getTime();
  }
  return moment(dateObjOrStr).format(formatStr);
}

// get current week start and end date in format YYYY/MM/DD
export function getCurrentWeekRange() {
  const start = moment().startOf('week').subtract(1, 'day');
  const end = moment().endOf('week').add(1, 'day');

  return {
    start: start.format('YYYY/MM/DD'),
    end: end.format('YYYY/MM/DD')
  };
}

// check if date is in current week
export function isDateInCurrentWeek(date: string) {
  const { start, end } = getCurrentWeekRange();

  return moment(date).isBetween(start, end);
}

export const categorizeTrainingEvents = (
  events: (
    | GameAny
    | {
        id: string;
        date: string;
        type: 'training' | 'match';
        startTime: string;
      }
  )[]
): Record<
  string,
  {
    id: string;
    pastMatch: number;
    nextMatch: number;
    indicator: number;
    date: string | number;
  }
> => {
  const trainingDates: Record<string, any> = {};

  const sortedEvents = [...events]
    .slice()
    .sort((a, b) =>
      moment(`${a.date} ${a.startTime}`, 'YYYY/MM/DD HH:mm').isAfter(
        moment(`${b.date} ${b.startTime}`, 'YYYY/MM/DD HH:mm')
      )
        ? 1
        : -1
    );

  sortedEvents.forEach((event, i) => {
    const isMatch = event.type === 'match';
    const isFinal =
      'status' in event ? event.status && event.status.isFinal : false;

    if (!isMatch) {
      const { indicator, pastMatch, nextMatch } = getTrainingIndicator(
        sortedEvents as GameAny[],
        event.date,
        i
      );

      trainingDates[event.id] = {
        id: event.id,
        pastMatch,
        nextMatch,
        indicator: indicator === null ? 'no_category' : indicator,
        date: formatDateTime(event.date),
        isFinal: !!isFinal
      };
    }
  });

  return trainingDates;
};

export const getTrainingIndicator = (
  sortedEvents: GameAny[],
  date: any,
  index: number
) => {
  const { pastMatch, nextMatch } = findClosestMatchBinary(
    sortedEvents,
    formatDateTime(date) as string,
    index
  );

  // Use absolute values once and store them to avoid repetitive calls
  const absPastMatch = Math.abs(pastMatch);
  const absNextMatch = Math.abs(nextMatch);

  let indicator: number | null =
    absPastMatch <= absNextMatch ? pastMatch : nextMatch;

  if (absPastMatch === 3 && absNextMatch === 4) {
    indicator = -4;
  } else if (absPastMatch === 3 && absNextMatch === 3) {
    indicator = -3;
  }

  if (indicator > 3 || indicator < -8 || indicator === Infinity) {
    indicator = null;
  }

  return { indicator, pastMatch, nextMatch };
};

const findSameFinishedTrainings = (
  trainingDates: Record<string, any>,
  indicator: number
): string[] => {
  const keys = Object.keys(trainingDates);
  return keys.filter((key) => {
    const event = trainingDates[key];
    return (
      isFinite(indicator) && event.indicator === indicator && event.isFinal
    );
  });
};

const INTENSITY_ZONES = ['veryHigh', 'high', 'moderate', 'explosive', 'low'];

export const calculateBenchmarkForEvent = (
  event: GameAny | GameAny[],
  allGames: GameAny[]
): {
  indicator: number;
  intensityZones: IntensityZones;
  actions: IntensityZones;
  players: Record<
    string,
    {
      intensity: number;
      intensityZones: IntensityZones;
      loadPerMin: number;
    }
  >;
  loadPerMin: number;
  intensity: number;
  id?: string;
}[] => {
  const categorizedTrainings = categorizeTrainingEvents(allGames);
  // check if event is single event or array of events
  const events = Array.isArray(event) ? event : [event];
  const benchmarks = [];
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const isManualCategory = event.benchmark?.manualIndicator;

    const sameTrainings: string[] = isManualCategory
      ? allGames
        .filter(
          ({ type, benchmark }) =>
            type === GameType.Training &&
              event.benchmark?.indicator === benchmark?.indicator
        )
        .map(({ id }) => id)
      : findSameFinishedTrainings(
        categorizedTrainings,
        categorizedTrainings[event.id]?.indicator
      );

    const eventPlayers = [
      ...(event.preparation?.playersInPitch || []),
      ...(event.preparation?.playersOnBench || [])
    ];

    const { intensity, intensityZones, players, loadPerMin, actions } =
      calculateTrainingsAverage(sameTrainings, allGames);

    // delete players if eventPlayers doesn't include them
    const playerIds = Object.keys(players);
    playerIds.forEach((id) => {
      if (!eventPlayers.includes(id)) {
        delete players[id];
      }
    });

    const indicator = event.benchmark?.indicator || null;

    const benchmark: any = {
      indicator: isManualCategory
        ? indicator
        : categorizedTrainings[event.id]?.indicator,
      intensityZones,
      actions,
      players,
      intensity,
      loadPerMin,
      id: event.id
    };

    if (isManualCategory) {
      benchmark.manualIndicator = true;
    }

    benchmarks.push(benchmark);
  }

  return benchmarks as any;
};

const calculateTrainingsAverage = (
  finishedSameTrainings: string[],
  allGames: GameAny[]
): {
  intensityZones: IntensityZones;
  actions: IntensityZones;
  players: Record<
    string,
    {
      intensity: number;
      intensityZones: IntensityZones;
      loadPerMin: number;
    }
  >;
  intensity: number;
  loadPerMin: number;
} => {
  let totalAvgIntensity = 0;
  let totalSameFinishedTrainings = 0;
  let totalLoadPerMin = 0;
  const avgPlayers: Record<
    string,
    {
      intensity: number;
      intensityZones: IntensityZones;
      count?: number;
      loadPerMin: number;
      actions: IntensityZones;
    }
  > = {};
  const intensityZones: IntensityZones = {
    explosive: 0,
    high: 0,
    low: 0,
    veryHigh: 0,
    moderate: 0
  };

  const actions: IntensityZones = {
    explosive: 0,
    high: 0,
    low: 0,
    veryHigh: 0,
    moderate: 0
  };
  for (let i = 0; i < finishedSameTrainings.length; i++) {
    const evtId = finishedSameTrainings[i];
    const evt = allGames.find((game) => game.id === evtId);
    if (!evt || !evt.report) continue;
    const reportData = evt.report?.stats;

    if (
      reportData &&
      reportData.team &&
      reportData.team.fullSession?.playerLoad
    ) {
      totalAvgIntensity += reportData.team.fullSession.playerLoad.total;
      totalLoadPerMin += reportData.team.fullSession.playerLoad.pMinute;
      totalSameFinishedTrainings += 1;
      for (let i = 0; i < INTENSITY_ZONES.length; i++) {
        const zone = INTENSITY_ZONES[i] as keyof IntensityZones;
        intensityZones[zone] +=
          reportData.team.fullSession?.intensityZones[zone] /
          finishedSameTrainings.length;
        actions[zone] +=
          reportData.team.fullSession?.actions[zone] /
          finishedSameTrainings.length;
      }
      // Calculate average player data
      if (reportData.players) {
        for (const id of Object.keys(reportData.players)) {
          const player: BasicPlayerStatsNew = reportData.players[id];
          const playerTotalLoad = player.fullSession?.playerLoad?.total || 0;
          const playerLoadPerMin = player.fullSession?.playerLoad?.pMinute || 0;

          if (playerTotalLoad < 10) continue;

          if (avgPlayers[id]) {
            avgPlayers[id].intensity += playerTotalLoad;
            avgPlayers[id].loadPerMin += playerLoadPerMin;
            avgPlayers[id].count = (avgPlayers[id].count || 0) + 1;

            for (let i = 0; i < INTENSITY_ZONES.length; i++) {
              const zone = INTENSITY_ZONES[i] as keyof IntensityZones;
              avgPlayers[id].intensityZones[zone] +=
                player.fullSession?.intensityZones[zone];
              avgPlayers[id].actions[zone] += player.fullSession?.actions[zone];
            }
          } else {
            avgPlayers[id] = {
              intensity: playerTotalLoad,
              intensityZones: {
                ...(player.fullSession?.intensityZones || intensityZones)
              },
              actions: {
                ...(player.fullSession?.actions || actions)
              },
              loadPerMin: playerLoadPerMin,
              count: 1
            };
          }
        }
      }
      // End of average player data
    }
  }

  // Iterate over avgPlayers and calculate averages
  for (const id of Object.keys(avgPlayers)) {
    avgPlayers[id].intensity =
      avgPlayers[id].intensity / (avgPlayers[id].count || 1);

    avgPlayers[id].loadPerMin =
      avgPlayers[id].loadPerMin / (avgPlayers[id].count || 1);

    for (let i = 0; i < INTENSITY_ZONES.length; i++) {
      const zone = INTENSITY_ZONES[i] as keyof IntensityZones;
      avgPlayers[id].intensityZones[zone] =
        avgPlayers[id].intensityZones[zone] / (avgPlayers[id].count || 1);
      avgPlayers[id].actions[zone] =
        avgPlayers[id].actions[zone] / (avgPlayers[id].count || 1);
    }

    delete avgPlayers[id].count;
  }

  return {
    intensityZones,
    actions,
    players: avgPlayers,
    intensity: totalAvgIntensity / totalSameFinishedTrainings || 0,
    loadPerMin: totalLoadPerMin / totalSameFinishedTrainings || 0
  };
};

export const recalculateBenchmark = (event: GameAny, allEvents: GameAny[]) => {
  const allGames = allEvents.slice(); // .filter((evt) => evt.id !== event.id);
  // const categorizedTrainings = categorizeTrainingEvents(allGames);
  const similarEvents = allEvents
    .filter(
      ({ type, benchmark, status, report }) =>
        type === GameType.Training &&
        event.benchmark?.indicator === benchmark?.indicator &&
        status?.isFinal &&
        !!report
    )
    .map(({ id }) => id);
  const similarUnfinishedEvents = allEvents
    .filter(({ type, benchmark, status, report, date }) => {
      const isAfter = moment(date, 'YYYY/MM/DD').isSameOrAfter(
        moment(event.date, 'YYYY/MM/DD')
      );
      const isNoCategory = event.benchmark?.indicator === 'no_category';
      return (
        type === GameType.Training &&
        event.benchmark?.indicator === benchmark?.indicator &&
        !status?.isFinal &&
        !report &&
        isAfter &&
        !isNoCategory
      );
    })
    .map(({ id }) => id);

  const benchmarkData = calculateTrainingsAverage(similarEvents, allGames);
  const eventsToUpdate = similarUnfinishedEvents
    .map((evtId) => {
      const evt = allGames.find((game) => game.id === evtId);
      if (!evt) return null;

      return {
        ...evt,
        benchmark: {
          ...evt.benchmark,
          intensity: benchmarkData.intensity,
          intensityZones: benchmarkData.intensityZones,
          players: benchmarkData.players,
          loadPerMin: benchmarkData.loadPerMin
        }
      };
    })
    .filter(Boolean) as GameAny[];

  return eventsToUpdate;
};

const findClosestMatchBinary = (
  events: GameAny[],
  date: string,
  positionIndex: number
): { pastMatch: number; nextMatch: number } => {
  const startDateCompare = new Date(date).setHours(0, 0, 0, 0);
  let pastMatch = Infinity;
  let nextMatch = Infinity;

  for (let i = positionIndex - 1; i >= 0; i--) {
    const event = events[i];

    if (event.type === GameType.Match) {
      pastMatch = getMatchDiff(event, startDateCompare);
      break;
    }
  }

  for (let i = positionIndex + 1; i < events.length; i++) {
    const event = events[i];

    if (event.type === GameType.Match) {
      nextMatch = -getMatchDiff(event, startDateCompare);
      break;
    }
  }

  return {
    pastMatch: formatMatchDiff(pastMatch),
    nextMatch: formatMatchDiff(nextMatch)
  };
};

const getMatchDiff = (event: GameAny, startDateCompare: number): number => {
  const startDateEvt = new Date(event.date).setHours(0, 0, 0, 0);

  return Math.abs(
    new Date(startDateEvt).getTime() - new Date(startDateCompare).getTime()
  );
};

const formatMatchDiff = (matchDiff: number): number => {
  return matchDiff && isFinite(matchDiff)
    ? Math.round(matchDiff / (1000 * 60 * 60 * 24))
    : matchDiff;
};

// return object of team and players with their best intensity
export const calculateBestMatch = (
  events: GameAny[],
  bestMatch: IBestMatch = {
    team: {
      id: '',
      intensity: 0,
      loadPerMin: 0
    },
    players: {}
  }
) => {
  const bestMatchCopy = {
    ...bestMatch
  };
  if (!bestMatchCopy.team) {
    bestMatchCopy.team = {
      id: '',
      intensity: 0,
      loadPerMin: 0
    };
  }
  const matches = events.filter(
    (evt) => evt.type === GameType.Match && evt.status?.isFinal && evt.report
  );
  for (let i = 0; i < matches.length; i++) {
    const event = matches[i];
    const teamLoad =
      event.report?.stats.team.fullSession?.playerLoad?.total || 0;
    const teamLoadPerMin =
      event.report?.stats.team.fullSession?.playerLoad?.pMinute || 0;
    // compare team best match
    if (+teamLoad > +bestMatchCopy?.team?.intensity) {
      // Add new game ID and intensity
      bestMatchCopy.team = {
        id: event.id,
        intensity: teamLoad,
        loadPerMin: teamLoadPerMin
      };
    }
    // compare player best match
    if (event.report?.stats.players) {
      const playerIds = Object.keys(event.report.stats.players);
      for (let i = 0; i < playerIds.length; i++) {
        const id: string = playerIds[i];
        const player: BasicPlayerStatsNew = event.report.stats.players[id];
        const playerTotalLoad = player.fullSession?.playerLoad?.total || 0;
        const playerLoadPerMin = player.fullSession?.playerLoad?.pMinute || 0;

        if (!bestMatchCopy.players) {
          bestMatchCopy.players = {};
        }
        if (
          !bestMatchCopy?.players[id]?.intensity ||
          playerTotalLoad > (bestMatchCopy?.players[id]?.intensity || 0)
        ) {
          // Add new game ID and intensity
          bestMatchCopy.players[id] = {
            id: event.id,
            intensity: playerTotalLoad,
            loadPerMin: playerLoadPerMin
          };
        }
      }
    }
  }

  console.log('bestMatchCopy', bestMatchCopy);
  return bestMatchCopy;
};

export const preparationGetActivePlayers = (event: GameAny | undefined) => {
  if (!event || !event.preparation) return 0;

  return (event.preparation?.playersInPitch || []).length;
};

/**
 * GET TODAY UPCOMING EVENT
 */
export const getTodayUpcomingEvent = (games: GameAny[]): GameAny | null => {
  const currentTime = new Date().getTime();

  const isTodayEvent = (date: string) =>
    moment(moment().format('YYYY/MM/DD')).isSame(moment(date), 'day');

  const isAfterCurrentTime = (
    UTCdate: string | undefined,
    date: string,
    startTime: string
  ) => {
    const { date: LocalDate } = utils.checkAndFormatUtcDate(
      UTCdate,
      date,
      startTime
    );
    return new Date(LocalDate).getTime() > currentTime;
  };

  const upcomingNotFinishedEvents = games.filter(
    ({ date, startTime, status, UTCdate }) =>
      isTodayEvent(date) &&
      isAfterCurrentTime(UTCdate, date, startTime) &&
      !status?.isFinal
  );

  return upcomingNotFinishedEvents.length > 0
    ? upcomingNotFinishedEvents[0]
    : null;
};

/**
 * Check if email is valid
 */
export const validateEmail = (email: string) => {
  /* eslint-disable no-useless-escape */
  const re =
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  return re.test(email);
};

// check if password is valid
export const validatePassword = (password: string) => {
  // regex for password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])?[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;
  return passwordRegex.test(password);
};

export const getPlayersMacIds = (
  playerIds: string[],
  players: Player[],
  tags: Record<string, string>
) => {
  const playersMacIds = playerIds.map((pl) => {
    const player = players.find((p) => p.id === pl);
    if (!player || !player?.tag) return null;
    const macId =
      Object.entries(tags).find(([, value]) => value === player.tag)?.[0] ||
      null;
    return { macId, id: player.tag, name: player.name };
  });

  const playersObj = {} as any;

  playersMacIds.forEach((player) => {
    if (player && player.macId) {
      playersObj[player.macId] = { id: player.id, name: player.name };
    }
  });

  return playersObj;
};

export const getTagsFromMacIds = (
  macIds: string[],
  tags: Record<string, string>
) => {
  const playersMacIds = macIds
    .map((macId) => {
      const tagId =
        Object.entries(tags).find(([id]) => id === macId)?.[1] || null;

      return { [macId]: tagId };
    })
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  return playersMacIds;
};

export const replaceMacIds = (data: string, tags: Tag, players: Player[]) => {
  const macIdToPlayerId: any = {};
  Object.keys(tags || {}).forEach((macId) => {
    const tagId = tags[macId];
    const playerId =
      players.find((player: any) => player.tag === tagId) || null;
    if (playerId) {
      macIdToPlayerId[macId] = playerId.id;
    }
  });

  const regex = /[0-9A-Fa-f]{2}(:[0-9A-Fa-f]{2}){3}/g;
  const replacedText = data.replace(regex, (match) =>
    match in macIdToPlayerId ? macIdToPlayerId[match] : match
  );
  return JSON.parse(replacedText);
};

const getSubstituteTime = (
  drills: Record<string, Drills>,
  drillName: string | null,
  timer: number,
  drillStartTime: number
) => {
  if (!drills) {
    return drillStartTime === 0 ? timer * 1000 : timer * 1000 - drillStartTime;
  }

  let time = timer * 1000 - drillStartTime;
  const firstHalfDuration = drills[EVENT_SUBSESSIONS.firstHalf]?.duration || 0;
  const secondHalfDuration =
    drills[EVENT_SUBSESSIONS.secondHalf]?.duration || 0;

  if (drillName === EVENT_SUBSESSIONS.secondHalf) {
    time += firstHalfDuration;
  }

  if (drillName === EVENT_SUBSESSIONS.overtime) {
    time += firstHalfDuration + secondHalfDuration;
  }

  return time;
};

const getSubstituteTimeHockey = (
  drills: Record<string, Drills>,
  drillName: string | null,
  timer: number,
  drillStartTime: number
) => {
  if (!drills) {
    return drillStartTime === 0 ? timer * 1000 : timer * 1000 - drillStartTime;
  }

  let time = timer * 1000 - drillStartTime;

  const firstPeriodDuration =
    drills[EVENT_SUBSESSIONS.firstPeriod]?.duration || 0;
  const secondPeriodDuration =
    drills[EVENT_SUBSESSIONS.secondPeriod]?.duration || 0;
  const thirdPeriodDuration =
    drills[EVENT_SUBSESSIONS.thirdPeriod]?.duration || 0;

  if (drillName === EVENT_SUBSESSIONS.secondPeriod) {
    time += firstPeriodDuration;
  }

  if (drillName === EVENT_SUBSESSIONS.thirdPeriod) {
    time += firstPeriodDuration + secondPeriodDuration;
  }

  if (drillName === EVENT_SUBSESSIONS.overtime) {
    time += firstPeriodDuration + secondPeriodDuration + thirdPeriodDuration;
  }

  return time;
};

export const updateSubstitutions = (
  event: GameAny,
  timer: number,
  players: { playerId: string; status: boolean }[],
  isHockey: boolean
) => {
  if (!event?.status?.startTimestamp) {
    return undefined;
  }
  const substitutions: Record<string, Substitutions[]> = {
    ...(event.preparation?.substitutions || {})
  };

  const drills = Object.keys(event.report?.stats?.team?.drills || {});

  const drillName = drills[drills.length - 1] || null;

  const drillStartTime = drillName
    ? event.report?.stats?.team?.drills[drillName]?.startTimestamp || 0
    : 0;

  const getSubstituteTimeFunction = isHockey
    ? getSubstituteTimeHockey
    : getSubstituteTime;

  const time = getSubstituteTimeFunction(
    event.report?.stats?.team?.drills || {},
    drillName,
    timer,
    drillStartTime
  );

  const drillStatus = drillName
    ? drillName.includes('_')
      ? drillName.split('_')[1]
      : drillName
    : null;

  players.forEach(({ playerId, status }) => {
    const sub: Substitutions = {
      subbed: status ? 'in' : 'out',
      time,
      drillName: drillStatus
    };
    substitutions[playerId] = [...(substitutions[playerId] ?? []), sub];
  });

  return substitutions;
};

export const getPlayerAndTagOnlineStatus = (
  tags: Record<string, string>,
  onlineTags: OnlineTag[],
  playerTag: string,
  isReady: boolean
) => {
  if (!isReady) {
    return {
      connectionText: 'Disconnected',
      connectionIcon: 'icon_disconnected' as IconTypes,
      batteryPercentage: undefined,
      batteryIcon: 'battery_empty' as IconTypes
    };
  }
  const playerMacValues = Object.entries(tags).find(
    ([_, tagNumber]) => tagNumber === playerTag
  );

  const playerMacId = playerMacValues ? playerMacValues[0] : '';
  const playerOnlineTag = onlineTags?.find(({ id }) => id === playerMacId);
  const connectionText = playerOnlineTag ? 'Connected' : 'Disconnected';
  const connectionIcon: IconTypes = playerOnlineTag
    ? 'icon_connected'
    : 'icon_disconnected';

  const batteryPercentage = playerOnlineTag
    ? playerOnlineTag.battery_percent.toString()
    : '';

  const batteryIcon: IconTypes =
    parseInt(batteryPercentage) > 30
      ? 'battery_full'
      : parseInt(batteryPercentage) > 0
        ? 'battery_warning'
        : 'battery_empty';

  return {
    connectionText,
    connectionIcon,
    batteryPercentage,
    batteryIcon
  };
};

export const sortStringsInAscendingOrder = (arr: string[]) => {
  return [...arr].sort((a, b) => {
    const tagA = a && !!parseInt(a) ? parseInt(a) : 0;
    const tagB = b && !!parseInt(b) ? parseInt(b) : 0;

    if (!tagA || !tagB) {
      return tagB - tagA;
    }
    return tagA - tagB;
  });
};

export const sortPlayersByConnectionAndTagNumber = (
  players: Player[]
  // tags: Record<string, string>,
  // onlineTags: OnlineTag[]
) => {
  return [...players].sort((a, b) => {
    const tagA = a.tag && !!parseInt(a.tag) ? parseInt(a.tag) : 0;
    const tagB = b.tag && !!parseInt(b.tag) ? parseInt(b.tag) : 0;

    if (!tagA || !tagB) {
      return tagB - tagA;
    }
    return tagA - tagB;
  });
  // .sort((a, b) => {
  //   const playerAMacValues = Object.entries(tags).find(
  //     ([_, tagNumber]) => tagNumber === a.tag
  //   );
  //   const playerAMacId = playerAMacValues ? playerAMacValues[0] : '';
  //   const playerBMacValues = Object.entries(tags).find(
  //     ([_, tagNumber]) => tagNumber === b.tag
  //   );
  //   const playerBMacId = playerBMacValues ? playerBMacValues[0] : '';

  //   const isAConnected = onlineTags?.find(({ id }) => id === playerAMacId)
  //     ? 1
  //     : 0;
  //   const isBConnected = onlineTags?.find(({ id }) => id === playerBMacId)
  //     ? 1
  //     : 0;

  //   return isBConnected - isAConnected;
  // });
};

export const getNumberOfOnlineTags = (
  players: Player[],
  tags: Record<string, string> = {},
  onlineTags: OnlineTag[]
) => {
  const playersConnected = players.filter((player) => {
    const playerMacValues = Object.entries(tags).find(
      ([_, tagNumber]) => tagNumber === player.tag
    );
    const playerMacId = playerMacValues ? playerMacValues[0] : '';
    const isConnected = onlineTags?.find(({ id }) => id === playerMacId);

    return isConnected;
  });

  return playersConnected.length;
};

export const waitFor = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const filterGamesByDateAndStatus = (
  games: GameAny[],
  startDate: any,
  endDate: any,
  daysAgoStart = 0,
  daysAgoEnd = 0
) => {
  const start = moment(startDate, 'YYYY/MM/DD').subtract(daysAgoStart, 'days');
  const end = moment(endDate, 'YYYY/MM/DD').subtract(daysAgoEnd, 'days');

  return games.filter((game) => {
    const gameDate = moment(game.date);
    return (
      gameDate.isBetween(start, end, null, '[]') &&
      game.status &&
      game.status.isFinal
    );
  });
};

const getRepetitionDays = (repeat: string) => {
  switch (repeat) {
    case REPEAT_EVENT_OPTION.day:
      return 1;
    case REPEAT_EVENT_OPTION.week:
      return 7;
    case REPEAT_EVENT_OPTION.two_week:
      return 14;
    case REPEAT_EVENT_OPTION.month:
      return 30;
  }
};

export const getNewEventData = (
  eventDetails: EventDetailsType,
  allGames: GameAny[],
  allPlayers: Player[],
  selectedPlayers: {
    [key: string]: boolean;
  }
) => {
  const { type, date, time, location, opponent, category, repeat, repeatDate } =
    eventDetails;

  const isMatch = type === GameType.Match;

  const defaultCategory = defaultCategoryPicker(
    getDefaultTrainingCategoryOption(allGames, eventDetails)
  );

  const newEventData: Partial<GameAny> = {
    type: isMatch ? GameType.Match : GameType.Training,
    date: formatDateTime(date),
    UTCdate: utils.localeToUTC(date, time),
    startTime: formatDateTime(time, 'HH:mm').toString(),
    endTime: formatDateTime(
      moment(time).add(120, 'minutes').toDate(),
      'HH:mm'
    ).toString(),
    location: isMatch ? location : 'Home',
    preparation: {
      playersInPitch: allPlayers
        .filter(({ id }) => Object.keys(selectedPlayers).includes(id))
        .map(({ id }) => id),

      playersOnBench: allPlayers
        .filter(({ id }) => !Object.keys(selectedPlayers).includes(id))
        .map(({ id }) => id)
    },
    versus: isMatch ? opponent : null
  };

  if (!isMatch && repeat !== 'Never') {
    newEventData.recurringEventId = Date.now();
  }

  if (!isMatch && defaultCategory !== category) {
    newEventData.benchmark = {
      manualIndicator: true,
      indicator: manualCategory(category)
    } as BenchmarkData;
  }

  if (repeat !== 'Never') {
    const endOfSeasonDate = moment(repeatDate);
    const dates: string[] = [];
    const { date: formatedDate, dateFormat } = utils.checkAndFormatUtcDate(
      newEventData.UTCdate,
      newEventData.date,
      newEventData.startTime || '00:00'
    );
    let date = formatedDate;
    let isDateBeforeSeasonEnd = moment(date, dateFormat).isSameOrBefore(
      endOfSeasonDate
    );

    const repetitionDays = getRepetitionDays(eventDetails.repeat);

    while (isDateBeforeSeasonEnd) {
      dates.push(date);

      date = moment(dates[dates.length - 1], 'YYYY/MM/DD HH:mm')
        .add(
          repetitionDays === 30 ? 1 : repetitionDays,
          repetitionDays === 30 ? 'months' : 'd'
        )
        .format('YYYY/MM/DD HH:mm');

      isDateBeforeSeasonEnd = moment(
        dates[dates.length - 1],
        'YYYY/MM/DD HH:mm'
      )
        .add(
          repetitionDays === 30 ? 1 : repetitionDays,
          repetitionDays === 30 ? 'months' : 'd'
        )
        .isSameOrBefore(endOfSeasonDate);
    }

    const eventsPromiseArr = dates
      .filter((date) => {
        const gamesOnSelectedDate = allGames.filter((game) => {
          return game.date === formatDateTime(date);
        });

        if (gamesOnSelectedDate.length > 1) return false;

        if (gamesOnSelectedDate.length === 1) {
          const startTimeOnExistingEvent = moment(
            gamesOnSelectedDate[0].date,
            'YYYY/MM/DD HH:mm'
          ).format('HH:mm');
          if (
            moment(newEventData.date, 'YYYY/MM/DD HH:mm').format('HH:mm') ===
            startTimeOnExistingEvent
          ) {
            return false;
          }
        }

        return true;
      })
      .map((date) => ({ ...newEventData, date, UTCdate: date }));
    return eventsPromiseArr;
  }

  return newEventData;
};
