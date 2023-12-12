import _ from 'lodash';
import moment from 'moment';

import {
  DropdownFilterKeys,
  GameAny,
  GameType,
  IntensityZones,
  Player,
  PlayerLoadSerie,
  Substitutions,
  WeeklyOverview
} from '../../types';
import { selectActiveClub } from '../redux/slices/clubsSlice';
import { selectGameById } from '../redux/slices/gamesSlice';
import store from '../redux/store';
import { deriveNewStats } from '../utils/adapter';
import {
  EVENT_SUBSESSIONS,
  EXPLANATION_TYPES,
  INTENSITY_ZONES,
  PLAYER_LIST_CHART_ZONE_SELECTOR,
  PLAYER_LIST_CHART_ZONE_SELECTOR_HOCKEY,
  utils,
  variables,
  WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR
} from '../utils/mixins';

export const generateSubtitleTotalLoad = (
  event: GameAny,
  deriveData: any,
  isDontCompare: boolean,
  comparisonFilterKey: string,
  playerId?: string | null
) => {
  if (isDontCompare) {
    return '';
  }
  const state = store.getState();
  const { bestMatch } = selectActiveClub(state);
  const indicator = event?.benchmark?.indicator;
  if (
    event.type === GameType.Training &&
    comparisonFilterKey !== DropdownFilterKeys.BEST_MATCH
  ) {
    if (typeof indicator === 'number' && !isFinite(indicator)) {
      return '';
    }
    let trainingText = '';
    const hasBenchmark = deriveData && deriveData.bestMatchLoad !== 0;

    if (typeof indicator === 'number') {
      trainingText =
        indicator === 0
          ? 'Matchday'
          : indicator > 0
            ? `+ ${indicator}`
            : `${indicator}`;
    }
    if (typeof indicator === 'string') {
      trainingText = utils.getTrainingTitleFromString(indicator);
    }

    if (hasBenchmark) {
      return `(avg. of previous ${trainingText} trainings)`;
    } else {
      return `(No benchmark recorded for ${trainingText} trainings)`;
    }
  } else {
    let evtId = bestMatch?.team?.id || null;
    if (playerId) {
      evtId =
        (bestMatch?.players &&
          bestMatch?.players[playerId] &&
          bestMatch?.players[playerId].intensity > 1 &&
          bestMatch?.players[playerId].id) ||
        null;
    }
    if (!evtId) return `No best match recorded`;

    const game = selectGameById(state, evtId);
    if (game && evtId && game.versus) {
      return `( vs ${game.versus} ${game.date} )`;
    } else {
      return `No best match recorded`;
    }
  }
};

export const generateTimeInZoneData = (
  deriveData: any,
  isDontCompare: boolean,
  isLowIntensityDisabled?: boolean,
  isModerateIntensityDisabled?: boolean,
  isMatch?: boolean
) => {
  const intensityZones = deriveData.intensityZones;
  const intensityZonesBenchmark = deriveData.bestIntensityZones;

  const zonesArray = INTENSITY_ZONES.filter(({ key }) => {
    if (key === 'low' && isLowIntensityDisabled) return false;
    if (key === 'moderate' && isModerateIntensityDisabled) return false;
    return true;
  });

  const timeInZoneData = zonesArray.map((zone) => {
    const barTextData =
      isDontCompare || deriveData.comparisonLoad === 0
        ? intensityZones[zone.key] * 1000
        : Math.abs(
          intensityZonesBenchmark[zone.key] - intensityZones[zone.key]
        ) * 1000;

    const valueData =
      isDontCompare || deriveData.comparisonLoad === 0
        ? intensityZones[zone.key]
        : (intensityZones[zone.key] /
            (intensityZonesBenchmark[zone.key] || 1)) *
          deriveData.percentageFactor;

    return {
      percentageValue: valueData,
      barText: zone.label,
      missingBarText: utils.convertMilisecondsToTime(barTextData),
      barColor: zone.color,
      isNoBenchmark: isMatch ? deriveData.comparisonLoad === 0 : false
    };
  });

  const maxPercentageValue = _.max(
    timeInZoneData?.map((item) => item.percentageValue)
  );

  const finalData = timeInZoneData?.map((item) => {
    return {
      ...item,
      maxPercentageValue
    };
  });
  return finalData;
};

export const generateWeeklyLoadTimeInZoneData = (
  timeInZone: any,
  timeInZoneLastWeek: any,
  comparisonFilter: string,
  isLowIntensityDisabled?: boolean,
  isModerateIntensityDisabled?: boolean
) => {
  const zonesArray = INTENSITY_ZONES.filter(({ key }) => {
    if (key === 'low' && isLowIntensityDisabled) return false;
    if (key === 'moderate' && isModerateIntensityDisabled) return false;
    return true;
  });
  const isLast4Weeks = comparisonFilter === DropdownFilterKeys.LAST_4_WEEK;
  const timeInZoneData = zonesArray.map((zone) => {
    const barTextData = timeInZone[zone.key] * 1000;
    const barTextDataLastWeek = isLast4Weeks
      ? (timeInZoneLastWeek[zone.key] / 4) * 1000
      : timeInZoneLastWeek[zone.key] * 1000;
    const percentageFactor =
      !isNaN(timeInZoneLastWeek[zone.key]) && timeInZoneLastWeek[zone.key] > 0
        ? 100
        : 1;
    const valueData =
      comparisonFilter !== DropdownFilterKeys.DONT_COMPARE
        ? (timeInZone[zone.key] /
            (isLast4Weeks
              ? timeInZoneLastWeek[zone.key] / 4
              : timeInZoneLastWeek[zone.key] || 1)) *
          percentageFactor
        : timeInZone[zone.key];

    const missingBarText =
      comparisonFilter === DropdownFilterKeys.LAST_WEEK
        ? Math.abs(barTextDataLastWeek - barTextData)
        : barTextData;

    return {
      percentageValue: valueData,
      barText: zone.label,
      missingBarText: utils.convertMilisecondsToTime(missingBarText),
      barColor: zone.color,
      isNoBenchmark: false
    };
  });

  const maxPercentageValue = _.max(
    timeInZoneData?.map((item) => item.percentageValue)
  );

  const finalData = timeInZoneData?.map((item) => {
    return {
      ...item,
      maxPercentageValue
    };
  });
  return finalData;
};

export const generateWeeklyTotalLoadData = (
  totalLoad: number,
  totalLoadLastWeek: number,
  comparisonFilter: string
) => {
  if (comparisonFilter !== DropdownFilterKeys.DONT_COMPARE) {
    const lastWeekLoad = totalLoadLastWeek
      ? comparisonFilter === DropdownFilterKeys.LAST_4_WEEK
        ? totalLoadLastWeek / 4
        : totalLoadLastWeek
      : 0;
    const percentageFactor = !isNaN(lastWeekLoad) && lastWeekLoad > 0 ? 100 : 1;
    return {
      percentageValue: Math.round(
        (totalLoad / (lastWeekLoad || 1)) * percentageFactor
      ),
      totalLoad: Math.round(totalLoad),
      benchmarkLoad: Math.round(lastWeekLoad)
    };
  }
  return { percentageValue: 0, totalLoad, benchmarkLoad: 0 };
};

export const generatePlayerListData = (
  event: GameAny,
  activeSelector: any,
  players: any,
  comparisonFilter: any,
  isDontCompare: boolean,
  activeSubSession: string
) => {
  const eventPlayers = event.report
    ? Object.keys(event?.report?.stats?.players || {})
    : event.preparation?.playersInPitch;
  const substitutions = event?.preparation?.substitutions || {};
  const playerData = eventPlayers?.map((player) => {
    const deriveData = deriveNewStats({
      event,
      isMatch: event.type === GameType.Match,
      currentPlayerId: player,
      explicitBestMatch:
        event.type !== GameType.Match &&
        comparisonFilter.key === DropdownFilterKeys.BEST_MATCH,
      dontCompare: isDontCompare,
      activeSubSession
    });
    const wasSubbed = substitutions[player as keyof Substitutions];
    const playerData = players.find(
      (item: { id: string }) => item.id === player
    );
    const playerName = (playerData && playerData.name) || '';
    if (activeSelector.key === PLAYER_LIST_CHART_ZONE_SELECTOR[0].key) {
      const playerLoad = Math.round(deriveData.teamLoad);
      const playerBestMatchLoad = Math.round(deriveData.comparisonLoad);
      const playerPercentage = deriveData.percentageLoad;

      return {
        id: player,
        playerName,
        playerPercentage,
        playerLoad,
        playerBestMatchLoad,
        isNoBenchmark: deriveData.comparisonLoad === 0,
        wasSubbed: (wasSubbed && wasSubbed[wasSubbed.length - 1].subbed) || null
      };
    }
    if (activeSelector.key === PLAYER_LIST_CHART_ZONE_SELECTOR[1].key) {
      const playerLoad = deriveData.loadPerMinute || 0;
      const playerBestMatchLoad = deriveData.comparisonLoadPerMin || 0;

      const playerPercentage = Math.round(
        (playerLoad / (playerBestMatchLoad || 1)) * 100
      );

      return {
        id: player,
        playerName,
        playerPercentage,
        playerLoad,
        playerBestMatchLoad,
        isNoBenchmark: deriveData.comparisonLoad === 0,
        wasSubbed: (wasSubbed && wasSubbed[wasSubbed.length - 1].subbed) || null
      };
    }
    if (activeSelector.key === PLAYER_LIST_CHART_ZONE_SELECTOR_HOCKEY[0].key) {
      const playerLoad = Math.round(deriveData.timeOnIce?.total || 0);
      const playerBestMatchLoad = Math.round(
        deriveData.timeOnIceBestLoad?.total || 0
      );
      const playerPercentage = Math.round(
        (playerLoad / (playerBestMatchLoad || 1)) * 100
      );

      return {
        id: player,
        playerName,
        playerPercentage,
        playerLoad,
        playerBestMatchLoad,
        isNoBenchmark: deriveData.comparisonLoad === 0,
        wasSubbed: (wasSubbed && wasSubbed[wasSubbed.length - 1].subbed) || null
      };
    }
    const playerIntensity = deriveData.intensityZones;
    const playerBestIntensity = deriveData.bestIntensityZones;
    const currentZone = activeSelector.key;
    const playerPercentage = Math.round(
      (playerIntensity[currentZone as keyof IntensityZones] /
        (playerBestIntensity[currentZone as keyof IntensityZones] || 1)) *
        deriveData.percentageFactor
    );

    return {
      id: player,
      playerName,
      playerPercentage,
      playerLoad: Math.round(
        playerIntensity[currentZone as keyof IntensityZones]
      ),
      playerBestMatchLoad: Math.round(
        playerBestIntensity[currentZone as keyof IntensityZones]
      ),
      isNoBenchmark: deriveData.comparisonLoad === 0,
      wasSubbed: (wasSubbed && wasSubbed[wasSubbed.length - 1].subbed) || null
    };
  });
  const maxPercentageValue = _.max(playerData?.map((item) => item.playerLoad));

  const finalData = playerData?.map((item) => {
    return {
      ...item,
      maxPercentageValue
    };
  });

  if (activeSelector.sort === 1) {
    return finalData?.sort((a, b) => {
      let playerA = a.playerPercentage;
      let playerB = b.playerPercentage;
      if (a.isNoBenchmark) {
        playerA = -1;
      }
      if (b.isNoBenchmark) {
        playerB = -1;
      }
      if (!isDontCompare) {
        return playerA > playerB ? -1 : 1;
      }
      return a.playerLoad > b.playerLoad ? -1 : 1;
    });
  }
  if (activeSelector.sort === 2) {
    return finalData?.sort((a, b) => {
      let playerA = a.playerPercentage;
      let playerB = b.playerPercentage;
      if (a.isNoBenchmark) {
        playerA = 9999999999999;
      }
      if (b.isNoBenchmark) {
        playerB = 9999999999999;
      }
      if (!isDontCompare) {
        return playerA > playerB ? 1 : -1;
      }

      return a.playerLoad > b.playerLoad ? 1 : -1;
    });
  }
  if (activeSelector.sort === 3) {
    return finalData?.sort((a, b) => {
      let playerA = 0;
      let playerB = 0;
      if (a.isNoBenchmark) {
        playerA = 1;
      } else {
        playerA = -1;
      }
      if (b.isNoBenchmark) {
        playerB = 1;
      } else {
        playerB = -1;
      }

      return playerA > playerB ? 1 : -1;
    });
  }
  return finalData;
};

export const generateContinuousMovementsData = (deriveData: any) => {
  const explosiveData = deriveData?.explosiveZones.map((item: any) => {
    return {
      xValue: item.time / 60,
      yValue: item.length / 60,
      color: variables.chartExplosive
    };
  });
  const veryHighData = deriveData?.veryHighZones.map((item: any) => {
    return {
      xValue: item.time / 60,
      yValue: item.length / 60,
      color: variables.chartVeryHigh
    };
  });
  return explosiveData.concat(veryHighData);
};

export const divideNumberInSlices = (num: number, divider: number) => {
  const slices = [];
  if (num < divider) return [0, num];
  for (let i = 0; i < num; i += divider) {
    slices.push(i);
  }
  return slices;
};

export const getYAxisData = (max: number, divider: number) => {
  const data = [0];
  let num = 0;
  while (num < max) {
    num = num + divider;
    data.push(num);
  }
  return data;
};

export const generateStepData = (minVal = 0, maxVal: number, dataLen = 5) => {
  // Calculate the step size

  const step = (maxVal - minVal) / (dataLen - 1);

  // Create the array
  const arr = Array.from({ length: dataLen }, (_, i) => {
    return minVal + i * step;
  });

  return arr;
};

export const generateContinuousMovementsHorizontalLines = (deriveData: any) => {
  const data: { xValue: number; yValue: number; color: string }[] =
    generateContinuousMovementsData(deriveData);
  const maxValue = _.max(data?.map((item) => item.yValue * 60));
  const factor = (maxValue || 1) / 5 < 1 ? 1 : (maxValue || 1) / 5;

  return getYAxisData(maxValue || 1, factor);
};

export const generateActivityGraphHorizontalLines = (
  data: PlayerLoadSerie[]
) => {
  const maxValue = _.max(data?.map((item: any) => item.value));

  const factor =
    (maxValue || 1) / 5 < 1 ? (maxValue || 1) / 5 : (maxValue || 1) / 5;
  return getYAxisData(maxValue || 1, factor);
};

export const collectPastSessions = (games: GameAny[], id: string) => {
  const gameIndex = games.findIndex((game) => game.id === id);
  let finalData: GameAny[] = [];
  if (gameIndex >= 21) {
    finalData = games.slice(gameIndex - 19, gameIndex + 1);
  } else if (gameIndex < 1) {
    finalData = [games[gameIndex]];
  } else {
    finalData = games.slice(0, gameIndex + 1);
  }
  return finalData;
};

export const generatePastSessionsHorizontalLines = (
  pastSessionGames: GameAny[],
  playerId?: string | null
) => {
  const maxValue = _.max(
    pastSessionGames?.map((game) => {
      if (playerId) {
        if (
          game?.report?.stats?.players &&
          game?.report?.stats?.players[playerId]
        ) {
          return (
            game?.report?.stats?.players[playerId]?.fullSession?.playerLoad
              ?.total || 0
          );
        } else {
          return 0;
        }
      }

      return game?.report?.stats?.team?.fullSession?.playerLoad.total || 0;
    })
  );

  const factor =
    (maxValue || 1) / 5 < 1 ? (maxValue || 1) / 5 : (maxValue || 1) / 5;
  const data = getYAxisData(maxValue || 0, factor);
  data.push(data[data.length - 1] + factor);

  return data;
};

export const generatePastSessionsData = (
  pastSessions: GameAny[],
  playerId?: string | null
) => {
  return pastSessions.map((event) => {
    if (playerId) {
      if (
        event?.report?.stats?.players &&
        event?.report?.stats?.players[playerId]
      ) {
        return (
          event?.report?.stats?.players[playerId]?.fullSession?.playerLoad
            ?.total || 0
        );
      }
      return 0;
    }
    return event?.report?.stats?.team?.fullSession?.playerLoad?.total || 0;
  });
};

export const generateCustomChartLegend = (
  data: number[],
  pastSessions: GameAny[]
) => {
  return data.map((item) => {
    const { date, benchmark } = pastSessions[item];
    let indicator: string | number | null = null;
    if (typeof benchmark?.indicator === 'string') {
      if (benchmark.indicator === 'no_category') {
        indicator = 'NC';
      }
      if (benchmark.indicator === 'individual') {
        indicator = 'IT';
      }
    } else if (typeof benchmark?.indicator === 'number') {
      if (isFinite(benchmark.indicator)) {
        indicator = benchmark.indicator;
        if (benchmark.indicator === 0) {
          indicator = 'MD';
        }
        if (benchmark.indicator > 0) {
          indicator = `+${benchmark.indicator}`;
        }
      } else {
        indicator = 'T';
      }
    } else if (benchmark?.indicator === null) {
      indicator = 'T';
    }

    if (pastSessions[item].type === GameType.Match) {
      indicator = null;
    }
    return {
      positionIndex: item,
      date,
      indicator
    };
  });
};

export const generatePastMatchHorizontalLines = (games: GameAny[]) => {
  const maxValue = _.max(
    games.map(
      (game) => game.report?.stats?.team?.fullSession?.playerLoad?.total || 0
    )
  );

  const factor =
    (maxValue || 1) / 5 < 1 ? (maxValue || 1) / 5 : (maxValue || 1) / 5;
  const data = getYAxisData(maxValue || 0, factor);
  data.push(data[data.length - 1] + factor);

  return data;
};

export const generateWeeklyOverviewHorizontalLines = (
  weeklyOverview: WeeklyOverview,
  activeSelector: {
    label: string;
    color: string;
    key: string;
    aboveAverageColor: string;
    sort?: number;
  }
) => {
  const maxValue = _.max(
    weeklyOverview.map((item) => {
      if (activeSelector.key === WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR[0].key) {
        return item.load;
      }
      if (activeSelector.key === WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR[1].key) {
        return item.explosive;
      }
      if (activeSelector.key === WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR[2].key) {
        return item.veryHigh;
      }

      return item.high;
    })
  );

  const factor =
    (maxValue || 1) / 5 < 1 ? (maxValue || 1) / 5 : (maxValue || 1) / 5;
  const data = getYAxisData(maxValue || 0, factor);
  data.push(data[data.length - 1] + factor);

  return data;
};

export const generateWeeklyOverviewVerticalLines = () => {
  return Array.from({ length: 7 }, (_, i) => {
    return i;
  });
};

export const generateCustomLegendWeeklyOverview = (
  weeklyOverview: WeeklyOverview,
  weekStartDate: string,
  weekEndDate: string
) => {
  const data = [];
  let startingDate = weekStartDate;
  while (moment(startingDate).isSameOrBefore(weekEndDate)) {
    const gamesFound = weeklyOverview.filter(
      (game) => game.date === startingDate
    );
    if (gamesFound.length !== 0) {
      const foundGame = gamesFound[0];
      if (foundGame.indicator === null) {
        data.push({
          position: startingDate,
          text: 'Training'
        });
      } else {
        if (typeof foundGame.indicator === 'number') {
          if (foundGame.indicator === 0) {
            data.push({
              position: startingDate,
              text: 'Match'
            });
          } else {
            data.push({
              position: startingDate,
              text: `MD ${foundGame.indicator > 0 ? '+' : '-'}${Math.abs(
                foundGame.indicator
              )}`
            });
          }
        }

        if (typeof foundGame.indicator === 'string') {
          data.push({
            position: startingDate,
            text: foundGame.indicator
          });
        }
      }
    } else {
      data.push({
        position: startingDate,
        text: 'Day off'
      });
    }
    startingDate = moment(startingDate, 'YYYY/MM/DD')
      .add(1, 'days')
      .format('YYYY/MM/DD');
  }
  return data;
};

export const weeklyLoadData = (weekEvents: GameAny[], allPlayers: Player[]) => {
  let weekTotalLoad = 0;
  let totalLoadPerMin = 0;

  const timeInZone = {
    explosive: 0,
    veryHigh: 0,
    high: 0,
    moderate: 0,
    low: 0
  };
  const headerData = {
    trainingTime: 0,
    matchTime: 0
  };

  const weeklyOverview: {
    id: string;
    load: number;
    explosive: number;
    veryHigh: number;
    high: number;
    date: any;
    indicator: number | string | null;
    type: GameType.Match | GameType.Training;
  }[] = [];

  const playersData: Record<
    string,
    {
      id: string;
      name: string;
      totalLoad: number;
      totalLoadPerMin: number;
      timeInZone: {
        explosive: number;
        veryHigh: number;
        high: number;
        moderate: number;
        low: number;
      };
      weeklyOverview: {
        load: number;
        explosive: number;
        veryHigh: number;
        high: number;
        date: string;
        indicator: number | string | null;
      }[];
    }
  > = {};

  weekEvents.forEach((game) => {
    const { teamLoad, intensityZones, loadPerMinute } = deriveNewStats({
      event: game,
      isMatch: game.type === GameType.Match
    });

    weekTotalLoad += teamLoad;
    totalLoadPerMin += loadPerMinute || 0;

    Object.keys(timeInZone).forEach((zone) => {
      timeInZone[zone as keyof IntensityZones] +=
        intensityZones[zone as keyof IntensityZones];
    });
    // header data
    const time = game?.report?.stats?.team?.fullSession?.duration || 0;
    if (game.type === GameType.Match) {
      headerData.matchTime += time;
    } else {
      headerData.trainingTime += time;
    }
    // weekly overview data
    const overview = {
      id: game.id,
      load: teamLoad,
      loadPerMin: totalLoadPerMin,
      explosive: intensityZones.explosive,
      veryHigh: intensityZones.veryHigh,
      high: intensityZones.high,
      date: game.date,
      indicator: game.benchmark?.indicator ?? null,
      type: game.type
    };
    weeklyOverview.push(overview);

    if (game.report && game.report.stats && game.report.stats.players) {
      Object.keys(game.report.stats.players).forEach((item) => {
        const {
          teamLoad: playerLoad,
          intensityZones: playerZones,
          loadPerMinute: playerLoadPerMin
        } = deriveNewStats({
          event: game,
          isMatch: game.type === GameType.Match,
          currentPlayerId: item
        });
        const currentPlayer = allPlayers.find((player) => player.id === item);

        if (currentPlayer) {
          const player = {
            id: item,
            name: currentPlayer.name,
            totalLoad: playerLoad,
            totalLoadPerMin: playerLoadPerMin || 0,
            timeInZone: { ...playerZones },
            weeklyOverview: [
              {
                load: playerLoad,
                explosive: playerZones.explosive,
                veryHigh: playerZones.veryHigh,
                high: playerZones.high,
                date: game.date,
                indicator: game.benchmark?.indicator || null
              }
            ]
          };

          if (!playersData[player.id]) {
            playersData[player.id] = { ...player };
          } else {
            playersData[player.id].totalLoad += player.totalLoad;
            playersData[player.id].totalLoadPerMin +=
              player.totalLoadPerMin || 0;
            Object.keys(player.timeInZone).forEach((zone) => {
              playersData[player.id].timeInZone[zone as keyof IntensityZones] +=
                player.timeInZone[zone as keyof IntensityZones];
            });
            playersData[player.id].weeklyOverview = playersData[
              player.id
            ].weeklyOverview.concat([...player.weeklyOverview]);
          }
        }
      });
    }
  });
  return {
    totalLoad: weekTotalLoad,
    totalLoadPerMin,
    timeInZone,
    weeklyOverview,
    headerData,
    playersData: Object.values(playersData)
  };
};

export const converterDataForWeeklyPlayersStats = (
  playersData: any,
  activeSelector: any,
  players: any,
  playersDataLastWeek: any,
  comparisonFilter: string
) => {
  const isLast4Weeks = comparisonFilter === DropdownFilterKeys.LAST_4_WEEK;
  const convertedPlayerData = playersData.map((player: any) => {
    const playerLastWeek = playersDataLastWeek.find(
      (item: any) => item.id === player.id
    );
    if (activeSelector.key === PLAYER_LIST_CHART_ZONE_SELECTOR[0].key) {
      const playerLoad = Math.round(player.totalLoad);
      const playerLoadLastWeek =
        playerLastWeek && playerLastWeek.totalLoad
          ? Math.round(
            isLast4Weeks
              ? playerLastWeek.totalLoad / 4
              : playerLastWeek.totalLoad
          )
          : 0;
      const playerData = players.find(
        (item: { id: string }) => item.id === player.id
      );
      const playerName = (playerData && playerData.name) || '';
      const percentageFactor =
        playerLastWeek && !isNaN(playerLoadLastWeek) && playerLoadLastWeek > 0
          ? 100
          : 1;
      const playerPercentage = Math.round(
        (playerLoad / (playerLoadLastWeek || 1)) * percentageFactor
      );

      return {
        id: player.id,
        playerName,
        playerPercentage,
        playerLoad,
        playerBestMatchLoad: playerLoadLastWeek,
        isNoBenchmark: playerLoadLastWeek === 0,
        wasSubbed: null
      };
    } else if (activeSelector.key === PLAYER_LIST_CHART_ZONE_SELECTOR[1].key) {
      const playerLoad = Math.round(player.totalLoadPerMin);
      const playerLoadLastWeek = playerLastWeek
        ? Math.round(playerLastWeek.totalLoadPerMin || 0)
        : 0;
      const playerData = players.find(
        (item: { id: string }) => item.id === player.id
      );
      const playerName = (playerData && playerData.name) || '';
      const percentageFactor =
        playerLastWeek && !isNaN(playerLoadLastWeek) && playerLoadLastWeek > 0
          ? 100
          : 1;
      const playerPercentage = Math.round(
        (playerLoad / (playerLoadLastWeek || 1)) * percentageFactor
      );

      return {
        id: player.id,
        playerName,
        playerPercentage,
        playerLoad,
        playerBestMatchLoad: playerLoadLastWeek,
        isNoBenchmark: playerLoadLastWeek === 0,
        wasSubbed: null
      };
    } else {
      const playerIntensity = player.timeInZone;
      const playerIntensityLastWeek = playerLastWeek
        ? playerLastWeek.timeInZone
        : { explosive: 0, veryHigh: 0, high: 0, moderate: 0, low: 0 };
      const currentZone = activeSelector.key;
      const percentageFactor =
        playerLastWeek &&
        !isNaN(playerIntensityLastWeek[currentZone as keyof IntensityZones]) &&
        playerIntensityLastWeek[currentZone as keyof IntensityZones] > 0
          ? 100
          : 1;

      const playerBestIntensity = {
        explosive: 0,
        veryHigh: 0,
        high: 0,
        moderate: 0,
        low: 0
      };
      const playerData = players.find(
        (item: { id: string }) => item.id === player.id
      );
      const playerName = (playerData && playerData.name) || '';

      return {
        id: player.id,
        playerName,
        playerPercentage: Math.round(
          (playerIntensity[currentZone as keyof IntensityZones] /
            (playerIntensityLastWeek[currentZone as keyof IntensityZones] ||
              1)) *
            percentageFactor
        ),
        playerLoad: Math.round(
          playerIntensity[currentZone as keyof IntensityZones]
        ),
        playerBestMatchLoad: Math.round(
          playerBestIntensity[currentZone as keyof IntensityZones]
        ),
        isNoBenchmark: false,
        wasSubbed: null
      };
    }
  });
  const maxPercentageValue = _.max(
    convertedPlayerData?.map((item: any) => item.playerLoad)
  );

  const finalData = convertedPlayerData?.map((item: any) => {
    return {
      ...item,
      maxPercentageValue
    };
  });
  const isDontCompare = comparisonFilter === DropdownFilterKeys.DONT_COMPARE;
  if (activeSelector.sort === 1) {
    return finalData?.sort((a: any, b: any) => {
      let playerA = a.playerPercentage;
      let playerB = b.playerPercentage;
      if (a.isNoBenchmark) {
        playerA = -1;
      }
      if (b.isNoBenchmark) {
        playerB = -1;
      }
      if (!isDontCompare) {
        return playerA > playerB ? -1 : 1;
      }
      return a.playerLoad > b.playerLoad ? -1 : 1;
    });
  }
  if (activeSelector.sort === 2) {
    return finalData?.sort((a: any, b: any) => {
      let playerA = a.playerPercentage;
      let playerB = b.playerPercentage;
      if (a.isNoBenchmark) {
        playerA = 9999999999999;
      }
      if (b.isNoBenchmark) {
        playerB = 9999999999999;
      }
      if (!isDontCompare) {
        return playerA > playerB ? 1 : -1;
      }

      return a.playerLoad > b.playerLoad ? 1 : -1;
    });
  }
  if (activeSelector.sort === 3) {
    return finalData?.sort((a: any, b: any) => {
      let playerA = 0;
      let playerB = 0;
      if (a.isNoBenchmark) {
        playerA = 1;
      } else {
        playerA = -1;
      }
      if (b.isNoBenchmark) {
        playerB = 1;
      } else {
        playerB = -1;
      }

      return playerA > playerB ? 1 : -1;
    });
  }
  return finalData;
};

export const emptyWeeklyOverview = [
  {
    load: 0,
    explosive: 0,
    veryHigh: 0,
    high: 0,
    date: '',
    indicator: 0
  }
];

export const emptyTimeInzone = {
  explosive: 0,
  veryHigh: 0,
  high: 0,
  moderate: 0,
  low: 0
};

export const emptyWeeklyPlayersData = [
  {
    id: '',
    name: '',
    totalLoad: 0,
    totalLoadPerMin: 0,
    timeInZone: {
      explosive: 0,
      veryHigh: 0,
      high: 0,
      moderate: 0,
      low: 0
    },
    weeklyOverview: [
      {
        load: 0,
        explosive: 0,
        veryHigh: 0,
        high: 0,
        date: '',
        indicator: null
      }
    ]
  }
];

export const generateActivityGraphBackgroundColor = (
  item: number,
  horizontalZoneLines: number[]
) => {
  if (item > horizontalZoneLines[0]) {
    return variables.red;
  }
  if (item > horizontalZoneLines[1]) {
    return variables.yellowDark;
  }
  if (item > horizontalZoneLines[2]) {
    return variables.purple;
  }
  if (item > horizontalZoneLines[3]) {
    return variables.lightishBlue;
  }
  return variables.textBlack;
};

export const getModalTypeFromFilter = (key: string) => {
  switch (key) {
    case DropdownFilterKeys.LOAD_GOAL:
      return EXPLANATION_TYPES.loadGoal;
    case DropdownFilterKeys.BENCHMARK:
      return EXPLANATION_TYPES.benchmark;
    case DropdownFilterKeys.BEST_MATCH:
      return EXPLANATION_TYPES.bestMatch;
    case DropdownFilterKeys.DONT_COMPARE:
      return EXPLANATION_TYPES.playerLoad;
    default:
      return EXPLANATION_TYPES.playerLoad;
  }
};

export const getDrillStyle = (
  startingPercentage: number,
  endingPercentage: number,
  sessionId: string,
  isMatch: boolean
) => {
  if (isMatch) {
    if (
      sessionId === EVENT_SUBSESSIONS.firstHalf ||
      sessionId === EVENT_SUBSESSIONS.firstPeriod ||
      sessionId === EVENT_SUBSESSIONS.secondPeriod ||
      sessionId === EVENT_SUBSESSIONS.secondHalf ||
      sessionId === EVENT_SUBSESSIONS.thirdPeriod
    ) {
      return {
        left: `${startingPercentage}%`,
        width: `${endingPercentage - startingPercentage}%`,
        backgroundColor: utils.rgba(variables.lightestGrey, 0.2)
      };
    }
    return {
      left: `${startingPercentage}%`,
      width: `${endingPercentage - startingPercentage}%`
    };
  }
  return {
    left: `${startingPercentage}%`,
    width: `${endingPercentage - startingPercentage}%`,
    backgroundColor: utils.rgba(variables.lightestGrey, 0.2)
  };
};

export const generateSessions = (event: GameAny, duration = 0) => {
  const drills = event?.report?.stats?.team?.drills || {};

  const drillsData = Object.keys(drills).map((drill) => {
    let drillName = '';
    if (drill.includes('_')) {
      drillName = drill.split('_')[1];
    } else drillName = drill;

    return {
      sessionName: drillName,
      sessionId: drill,
      active: drills[drill].duration === 0,
      time: drills[drill].duration,
      startTime: drills[drill].startTimestamp,
      endTime: drills[drill].endTimestamp
    };
  });

  return [
    {
      sessionName: 'fullSession',
      sessionId: 'fullSession',
      active: false,
      time: event?.report?.stats?.team?.fullSession?.duration || 0,
      startTime: 0,
      endTime: duration || 0
    },
    ...drillsData
  ];
};

export type RPEPlayerData = {
  id: string;
  playerName: any;
  tag: any;
  feedback: number;
};
export type RPEFormatedData = RPEPlayerData[];

export const RPECoachGnerateData = (event: GameAny, players: any) => {
  const eventPlayers = event.report
    ? Object.keys(event?.report?.stats?.players || {})
    : event.preparation?.playersInPitch;

  if (!eventPlayers?.length) return [];

  const rpeData: RPEFormatedData = [];

  eventPlayers?.forEach((player) => {
    const playerData = players.find(
      (item: { id: string }) => item.id === player
    );
    if (!playerData) return null;
    rpeData.push({
      id: playerData.id || '',
      playerName: playerData.name || '',
      tag: playerData.tShirtNumber,
      feedback: event.rpe && event?.rpe[player] ? event?.rpe[player] : 0
    });
  });

  return rpeData;
};

export const getWeeklyFeedbackDescription = (weekEvent: GameAny) => {
  const isMatch = weekEvent.type === GameType.Match;
  if (weekEvent.date === moment(new Date()).format('YYYY/MM/DD')) {
    return 'Today';
  }
  if (isMatch) {
    return `Match`;
  }
  const indicator = weekEvent?.benchmark?.indicator;
  if (typeof indicator === 'number' && isFinite(indicator)) {
    const trainingCategorySign = indicator > 0 ? '+' : '';
    return indicator === 0 ? 'MD' : `MD${trainingCategorySign}${indicator}`;
  }
  if (typeof indicator === 'string') {
    if (indicator === 'no_category') return 'NC';
    if (indicator === 'individual') return 'IT';
    return 'T';
  }
  return 'T';
};
