import moment, { Moment } from 'moment';

import {
  BasicPlayerStatsNew,
  BasicStatsNew,
  GameAny,
  GameType,
  StatsDataNew,
  StatsNew,
  StatsWrapperNew
} from '../../types';
import { PlayerLoadData } from '../navigation/AcuteChronic';
import { PlayerStats } from '../player-app/playerAppTypes';
import { selectActiveClub } from '../redux/slices/clubsSlice';
import {
  selectGameById,
  selectGamesWithinDateRangePlayerApp
} from '../redux/slices/gamesSlice';
import store from '../redux/store';

import { EVENT_SUBSESSIONS } from './mixins';

const ZONES_MOCK = {
  explosive: 0,
  high: 0,
  low: 0,
  veryHigh: 0,
  moderate: 0
};

const emptyNewTeamStats: StatsWrapperNew = {
  intensityZones: ZONES_MOCK,
  liveIntensity: {
    color: '#CAD6D8',
    liveIntensity: 0
  },
  playerLoad: {
    load: 0,
    total: 0,
    series: [],
    pMinute: 0
  },
  actions: ZONES_MOCK
};

const emptyNewPlayerStats: StatsNew = {
  movements: {
    explosive: [],
    veryHigh: []
  },
  intensityZones: ZONES_MOCK,
  playerLoad: {
    load: 0,
    total: 0,
    series: [],
    pMinute: 0
  },
  liveIntensity: {
    color: '#CAD6D8',
    liveIntensity: 0
  },
  actions: ZONES_MOCK
};

const emptyBenchmarkStat = {
  intensityZones: ZONES_MOCK,
  intensity: 0,
  loadPerMin: 0
};

// const emptyBestMatchStats: BestMatchStats = {
//   team: {
//     id: '',
//     intensity: 0,
//     fullSession: {
//       stats: emptyNewTeamStats
//     }
//   },
//   players: {}
// };

const getPlayerNewStats = (
  activeSubSession: string,
  basicStats: StatsDataNew | undefined,
  playerId: string
) => {
  if (activeSubSession === EVENT_SUBSESSIONS.fullSession) {
    if (basicStats?.players && basicStats.players[playerId]) {
      return { ...basicStats.players[playerId].fullSession };
    } else {
      return emptyNewPlayerStats;
    }
  } else {
    if (
      basicStats?.players &&
      basicStats.players[playerId] &&
      basicStats.players[playerId].drills &&
      basicStats.players[playerId].drills[
        activeSubSession as keyof BasicPlayerStatsNew
      ]
    ) {
      return {
        ...basicStats.players[playerId].drills[
          activeSubSession as keyof BasicPlayerStatsNew
        ]
      };
    } else {
      return emptyNewPlayerStats;
    }
  }
};

const getTeamNewStats = (
  activeSubSession: string,
  basicStats: StatsDataNew | undefined
) => {
  if (activeSubSession === EVENT_SUBSESSIONS.fullSession) {
    if (basicStats?.team && basicStats.team.fullSession) {
      return { ...basicStats.team.fullSession };
    } else {
      return emptyNewTeamStats;
    }
  } else {
    if (
      basicStats?.team &&
      basicStats.team.drills &&
      basicStats.team.drills[activeSubSession as keyof BasicStatsNew]
    ) {
      return {
        ...basicStats.team.drills[activeSubSession as keyof BasicStatsNew]
      };
    } else {
      return emptyNewTeamStats;
    }
  }
};

export const adpNewStats = (
  basicStats: StatsDataNew | undefined,
  playerId: string | null = null,
  activeSubSession: string = EVENT_SUBSESSIONS.fullSession
): StatsNew | StatsWrapperNew => {
  if (!basicStats) {
    return playerId ? emptyNewPlayerStats : emptyNewTeamStats;
  }

  let stats: any;
  if (playerId) {
    stats = getPlayerNewStats(activeSubSession, basicStats, playerId);
  } else {
    stats = getTeamNewStats(activeSubSession, basicStats);
  }
  return stats;
};

/**
 * Get best match stats for team or player
 * @param stats
 * @param playerId
 */
export const getBestMatch = (
  // bestMatch?: BestMatchStats | null | undefined,
  playerId?: string | null
): StatsNew => {
  const state = store.getState();
  const { bestMatch } = selectActiveClub(state);

  if (!bestMatch) {
    return playerId ? emptyNewPlayerStats : emptyNewTeamStats;
  }

  const evtId =
    playerId && bestMatch.players
      ? bestMatch.players[playerId]?.id
      : bestMatch.team?.id;
  if (!evtId) {
    return playerId ? emptyNewPlayerStats : emptyNewTeamStats;
  }

  const game = selectGameById(state, evtId);
  if (!game) {
    return playerId ? emptyNewPlayerStats : emptyNewTeamStats;
  }

  if (playerId) {
    return (
      game.report?.stats?.players[playerId]?.fullSession || emptyNewPlayerStats
    );
  }

  return game.report?.stats?.team?.fullSession || emptyNewTeamStats;
};

const getBenchmark = (event: GameAny, playerId?: string | null) => {
  if (!event.benchmark) {
    return emptyBenchmarkStat;
  }

  if (playerId) {
    return event.benchmark.players[playerId] || emptyBenchmarkStat;
  }

  return {
    intensity: event.benchmark.intensity,
    intensityZones: event.benchmark.intensityZones,
    loadPerMin: event.benchmark.loadPerMin
  };
};

export const deriveNewStats = ({
  currentPlayerId = null,
  isMatch,
  event,
  explicitBestMatch = false,
  dontCompare = true,
  activeSubSession = EVENT_SUBSESSIONS.fullSession
}: {
  currentPlayerId?: string | null;
  isMatch: boolean;
  event: GameAny;
  explicitBestMatch?: boolean;
  dontCompare?: boolean;
  activeSubSession?: string;
}) => {
  if (!event) {
    return {
      percentageFactor: 0,
      teamLoad: 0,
      percentageLoad: 0,
      comparisonLoad: 0,
      bestIntensityZones: ZONES_MOCK,
      explosiveZones: [],
      veryHighZones: [],
      intensityZones: ZONES_MOCK,
      areaDataIntensity: [],
      explosivePercentage: 0,
      veryHighPercentage: 0,
      liveIntensityColor: '#FFF'
    };
  }

  const reportStatsNew = adpNewStats(
    event?.report?.stats,
    currentPlayerId,
    activeSubSession
  ) as StatsNew;

  const bestMatch = getBestMatch(currentPlayerId);
  const loadPerMinute = reportStatsNew.playerLoad.pMinute;
  const intensityZones = reportStatsNew.intensityZones;
  let comparisonLoad = bestMatch.playerLoad.total || 0;
  let comparisonLoadPerMin = bestMatch.playerLoad.pMinute || 0;
  let teamLoad = reportStatsNew.playerLoad.total;
  let bestIntensityZones = bestMatch.intensityZones || ZONES_MOCK;

  const explosiveZones = currentPlayerId
    ? reportStatsNew?.movements?.explosive || []
    : [];
  const veryHighZones = currentPlayerId
    ? reportStatsNew.movements
      ? reportStatsNew.movements.veryHigh || []
      : []
    : [];

  if (currentPlayerId && reportStatsNew) {
    teamLoad = reportStatsNew.playerLoad.total;
  }
  if (!isMatch && !explicitBestMatch) {
    const benchmark = getBenchmark(event, currentPlayerId);
    comparisonLoad = benchmark.intensity;
    comparisonLoadPerMin = benchmark.loadPerMin;
    bestIntensityZones = benchmark.intensityZones;
  }
  const percentageFactor =
    !isNaN(comparisonLoad) && comparisonLoad > 1 ? 100 : 1;

  const percenrageFactorLoadPerMin =
    !isNaN(comparisonLoadPerMin) && comparisonLoadPerMin > 1 ? 100 : 1;
  const areaDataIntensity = (bestMatch.playerLoad.series || []).map(
    (it) => it.value
  );

  const percentageExplosiveFactor =
    !isNaN(bestIntensityZones.explosive) && bestIntensityZones.explosive > 0
      ? 100
      : 1;

  const explosivePercentage = Math.round(
    dontCompare
      ? intensityZones.explosive || 0
      : ((intensityZones.explosive || 0) /
          (bestIntensityZones.explosive || 1)) *
          percentageExplosiveFactor
  );

  const percentageHighFactor =
    !isNaN(bestIntensityZones.veryHigh) && bestIntensityZones.veryHigh > 0
      ? 100
      : 1;

  const veryHighPercentage = Math.round(
    dontCompare
      ? intensityZones.veryHigh
      : (intensityZones.veryHigh / (bestIntensityZones.veryHigh || 1)) *
          percentageHighFactor
  );

  const percentageLoad =
    dontCompare || comparisonLoad < 1
      ? teamLoad
      : (Math.round(teamLoad) / (Math.round(comparisonLoad) || 1)) *
        percentageFactor;

  const percentageLoadPerMin =
    dontCompare || comparisonLoadPerMin < 1
      ? loadPerMinute
      : (loadPerMinute / (comparisonLoadPerMin || 1)) *
        percenrageFactorLoadPerMin;

  const activitySeries = currentPlayerId
    ? event?.report?.stats?.players[currentPlayerId]?.fullSession?.playerLoad
      ?.series || []
    : event?.report?.stats?.team?.fullSession?.playerLoad?.series || [];

  const drills = event?.report?.stats?.team?.drills;

  const timeOnIce = reportStatsNew?.timeOnIce || null;

  const timeOnIceBestLoad = bestMatch?.timeOnIce || null;

  const actions = reportStatsNew.actions || {
    explosive: 0,
    high: 0,
    veryHigh: 0,
    low: 0,
    moderate: 0
  };

  const benchmarkActions = bestMatch.actions || {
    explosive: 0,
    high: 0,
    veryHigh: 0,
    low: 0,
    moderate: 0
  };

  return {
    percentageFactor,
    teamLoad: Math.round(teamLoad),
    percentageLoad: Math.round(percentageLoad),
    comparisonLoad: Math.round(comparisonLoad),

    bestIntensityZones,
    explosiveZones,
    veryHighZones,
    intensityZones,
    areaDataIntensity,
    explosivePercentage,
    veryHighPercentage,
    liveIntensityColor: reportStatsNew.liveIntensity.color,
    activitySeries,
    drills,
    timeOnIce,
    timeOnIceBestLoad,
    loadPerMinute,
    comparisonLoadPerMin,
    percentageLoadPerMin: Math.round(percentageLoadPerMin),
    actions,
    benchmarkActions
  };
};

export const derivePlayerStats = (
  event: GameAny,
  playerId: string,
  games: GameAny[]
): PlayerStats => {
  const isMatch = event.type === GameType.Match;
  const playerLoad =
    event.report?.stats.players[playerId]?.fullSession?.playerLoad?.total || 0;
  const loadPerMin =
    event.report?.stats.players[playerId]?.fullSession?.playerLoad?.pMinute ||
    0;
  let lowestLoad = 0;
  let highestLoad = 0;
  let totalLoadSum = 0;
  let lowestEvent = null;
  let highestEvent = null;

  if (event.benchmark?.indicator === Infinity) {
    return {
      totalLoad: Math.round(playerLoad),
      lowestLoad,
      highestLoad,
      averageLoad: 0,
      numberOfSameTypeEvents: 0,
      lowestEvent,
      highestEvent,
      loadPerMin: loadPerMin.toFixed(2)
    };
  }

  const playerGames = [
    ...games.sort((a, b) => {
      const bool = moment(
        `${a.date} ${a.startTime}`,
        'YYYY/MM/DD HH:mm'
      ).isBefore(moment(`${b.date} ${b.startTime}`, 'YYYY/MM/DD HH:mm'));

      return bool ? 1 : -1;
    })
  ];

  const gameId = event.id;
  const indexOfGame = playerGames.map((event) => event.id).indexOf(gameId);

  const sameTypeEvents = playerGames
    .slice(indexOfGame, games.length)
    .filter(({ id, type, benchmark }) => {
      if (isMatch) return type === GameType.Match;
      return (
        type === GameType.Training &&
        id !== event.id &&
        benchmark?.indicator === event.benchmark?.indicator
      );
    });

  sameTypeEvents.forEach((event, i) => {
    const load =
      event.report?.stats.players[playerId]?.fullSession?.playerLoad?.total ||
      0;
    if (load > highestLoad) {
      highestLoad = load;
      if (isMatch) {
        highestEvent = event;
      }
    }
    if (i === 0 || load < lowestLoad) {
      lowestLoad = load;
      if (isMatch) {
        lowestEvent = event;
      }
    }
    totalLoadSum += load;
  });

  const averageLoad = totalLoadSum / sameTypeEvents.length || 0;
  return {
    totalLoad: Math.round(playerLoad),
    lowestLoad: Math.round(lowestLoad),
    highestLoad: Math.round(highestLoad),
    averageLoad: Math.round(averageLoad),
    numberOfSameTypeEvents: isMatch
      ? sameTypeEvents.length - 1
      : sameTypeEvents.length,
    lowestEvent: sameTypeEvents.length - 1 === 0 ? null : lowestEvent,
    highestEvent,
    loadPerMin: loadPerMin.toFixed(2)
  };
};

const FORMAT_WEEK = 'YYYY/MM/DD';

export const acuteChronicPlayerApp = (
  playerId: string,
  acuteDates: string[],
  currentDate: Moment | false,
  games: GameAny[]
) => {
  const calculatePlayerLoad = (
    gamesList: GameAny[]
  ): Record<string, PlayerLoadData> => {
    return gamesList.reduce(
      (acc: Record<string, PlayerLoadData>, game: GameAny) => {
        if (!acc[playerId]) {
          acc[playerId] = { totalLoad: 0, accessCount: 0 };
        }
        acc[playerId].totalLoad +=
          game.report?.stats.players[playerId].fullSession.playerLoad.total ||
          0;
        acc[playerId].accessCount += 1;

        return acc;
      },
      {} as Record<string, PlayerLoadData>
    );
  };

  let datesToProcess = acuteDates;

  if (currentDate) {
    const indexOfDate = acuteDates.indexOf(currentDate.format(FORMAT_WEEK)) + 1;

    datesToProcess =
      indexOfDate < 11
        ? indexOfDate < 1
          ? acuteDates.slice(0, 1)
          : acuteDates.slice(0, indexOfDate)
        : acuteDates.slice(indexOfDate - 11, indexOfDate);
  }

  const playerLoad = datesToProcess.map((date) => {
    const acuteGames = selectGamesWithinDateRangePlayerApp(
      store.getState(),
      moment(date).subtract(7, 'days').format(FORMAT_WEEK),
      moment(date).format(FORMAT_WEEK),
      playerId,
      GameType.Training
    );
    const chronicGames = selectGamesWithinDateRangePlayerApp(
      store.getState(),
      moment(date).subtract(28, 'days').format(FORMAT_WEEK),
      moment(date).format(FORMAT_WEEK),
      playerId,
      GameType.Training
    );

    const acutePlayerLoad = calculatePlayerLoad(acuteGames);
    const chronicPlayerLoad = calculatePlayerLoad(chronicGames);

    return {
      date,
      acutePlayerLoad,
      chronicPlayerLoad,
      totalLoad: Object.keys(acutePlayerLoad).reduce((acc, playerId) => {
        return acc + acutePlayerLoad[playerId].totalLoad;
      }, 0),
      totalTime: acuteGames.reduce((acc, game) => {
        return acc + (game.report?.stats?.team?.fullSession?.duration || 0);
      }, 0)
    };
  });

  const calculateCalculationLoad = () => {
    const firstFinishedTrainingDate = games.find(
      (game) => game.status?.isFinal
    )?.date;
    if (playerLoad.length && firstFinishedTrainingDate) {
      return playerLoad.map((item) => {
        const dayDifference = moment(item.date).diff(
          moment(firstFinishedTrainingDate),
          'days'
        );
        const acuteDivider = dayDifference > 7 ? 7 : dayDifference;
        const chronicDivider = dayDifference > 28 ? 28 : dayDifference;
        if (
          item?.acutePlayerLoad[playerId] &&
          item?.chronicPlayerLoad[playerId]
        ) {
          const acuteLoad = Math.round(
            (item.acutePlayerLoad[playerId].totalLoad || 1) /
              (acuteDivider || 1)
          );

          const chronicLoad = Math.round(
            (item.chronicPlayerLoad[playerId].totalLoad || 1) /
              (chronicDivider || 1)
          );
          return {
            date: item.date,
            acuteLoad,
            chronicLoad,
            acuteChronicRatio:
              acuteLoad === 0 || chronicLoad === 0 ? 0 : acuteLoad / chronicLoad
          };
        } else {
          return {
            date: '',
            acuteLoad: 0,
            chronicLoad: 0,
            acuteChronicRatio: 0
          };
        }
      });
    } else {
      return [{ acuteLoad: 0, chronicLoad: 0, acuteChronicRatio: 0, date: '' }];
    }
  };

  return calculateCalculationLoad();
};
