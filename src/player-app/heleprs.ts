import moment from 'moment';

import { GameAny, GameType, IntensityZones } from '../../types';
import { PrgoressFilterType } from '../types';
import { utils } from '../utils/mixins';

type DayOfWeek = {
  load: number;
  isMatchday: boolean;
};
export type WeeklyEffortData = {
  benchmark: number;
  name: string;
  totalWeeklyLoad: number;
  weekIndex: number;
  benchMarkRange: [number, number];
  isInRange: boolean;
  description: string;
  sessions: GameAny[];
  daysOfWeek: {
    monday: DayOfWeek;
    tuesday: DayOfWeek;
    wednesday: DayOfWeek;
    thursday: DayOfWeek;
    friday: DayOfWeek;
    saturday: DayOfWeek;
    sunday: DayOfWeek;
  };
};

const getTooltipSecondSentenceTraining = (percentage: number): string => {
  switch (true) {
    case percentage > 50:
      return 'Be cautious of rest and recovery to optimize energy levels for your next activity.';
    case percentage > 25:
      return 'Be cautious of recovery to optimize energy levels and try not to spike your daily Total Load.';
    case percentage >= -25:
      return 'This is within your optimal range.';
    case percentage > -50:
      return "Be cautious that your average activity level is maintained so your fitness level doesn't drop.";
    default:
      return 'Be cautious of your activity level during training and match to avoid de-training.';
  }
};

export const getTooltipMessageTraining = (
  numberOfSameTypeEvents: number,
  totalLoad: number,
  indicator: number | string | null,
  percentage: number
) => {
  if (indicator === null) {
    return `Your total load is ${totalLoad}. Since this is an uncategorised training session, there is no benchmark.`;
  }

  const trainingTitle = getTrainingTitle(indicator);

  if (numberOfSameTypeEvents === 0) {
    return `Your total load is ${totalLoad}. Since this is your first ${trainingTitle} training session, there's no benchmark yet.`;
  }

  const text =
    percentage > 0
      ? `${Math.abs(percentage)}% higher than`
      : percentage < 0
        ? `${Math.abs(percentage)}% lower than`
        : 'same as';

  return `Your Total Load was ${text} your average ${trainingTitle} training. ${getTooltipSecondSentenceTraining(
    percentage
  )}`;
};

export const getIconTraining = (
  numberOfSameTypeEvents: number,
  percentage: number
) => {
  if (numberOfSameTypeEvents === 0) return 'info_icon';

  if (percentage >= -25 && percentage <= 25) {
    return 'spot_on';
  }

  if (percentage > 25) {
    return 'arrow_upward';
  }

  return 'arrow_downward';
};

export const getTooltipMessageMatch = (
  numberOfSameTypeEvents: number,
  totalLoad: number,
  percentage: number
) => {
  if (numberOfSameTypeEvents === 0 || percentage >= 0) {
    return `Your total load is ${totalLoad}, which means this is your highest match so far.`;
  }

  return `The Total Load of this match was ${Math.abs(
    percentage
  )}% lower than your highest match.`;
};

export const getIconMatch = (
  numberOfSameTypeEvents: number,
  percentage: number
) => {
  if (numberOfSameTypeEvents === 0 || percentage >= 0) return 'spot_on';

  return 'arrow_downward';
};

const getPercentageFromTotal = (total: number, value: number) =>
  (value / total) * 100;

export const getTime = (totalSeconds: number, timeWithLetters = false) => {
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (timeWithLetters) {
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  }
  return `${utils.pad(hours)}:${utils.pad(minutes)}:${utils.pad(seconds)}`;
};

export const getZonesData = (
  zones: IntensityZones | undefined,
  timeWithLetters = false
) => {
  if (!zones) {
    return {
      explosive: { time: '', percentageFromTotal: 0 },
      veryHigh: { time: '', percentageFromTotal: 0 },
      high: { time: '', percentageFromTotal: 0 },
      low: { time: '', percentageFromTotal: 0 },
      moderate: { time: '', percentageFromTotal: 0 },
      totalTime: ''
    };
  }
  const { explosive, veryHigh, high, low, moderate } = zones;

  const totalTime = Object.values(zones).reduce(
    (a, b) => Math.round(a) + Math.round(b)
  );

  return {
    explosive: {
      time: getTime(Math.round(explosive), timeWithLetters),
      percentageFromTotal: getPercentageFromTotal(totalTime, explosive)
    },
    veryHigh: {
      time: getTime(Math.round(veryHigh), timeWithLetters),
      percentageFromTotal: getPercentageFromTotal(totalTime, veryHigh)
    },
    high: {
      time: getTime(Math.round(high), timeWithLetters),
      percentageFromTotal: getPercentageFromTotal(totalTime, high)
    },
    low: {
      time: getTime(Math.round(low), timeWithLetters),
      percentageFromTotal: getPercentageFromTotal(totalTime, low)
    },
    moderate: {
      time: getTime(Math.round(moderate), timeWithLetters),
      percentageFromTotal: getPercentageFromTotal(totalTime, moderate)
    },
    totalTime: getTime(Math.round(totalTime), true)
  };
};

export const getTrainingTitle = (
  indicator: number | string | null | undefined
) => {
  if (typeof indicator === 'string') {
    return utils.getTrainingTitleFromString(indicator);
  }
  if (indicator === null || indicator === undefined || !isFinite(indicator)) {
    return '';
  }
  if (indicator === 0) return 'MD';
  if (typeof indicator === 'number' && Math.sign(indicator) === 1) {
    return `+${indicator}`;
  }
  return `${indicator}`;
};

export const matchOptions = ['All Matches', 'Won', 'Lost', 'Tied'];

export const TrainingOptionsPlus = [
  'Matchday Trainings',
  '+1 Training',
  '+2 Training',
  '+3 Training'
];
export const TrainingOptionsMinus = [
  '-1 Training',
  '-2 Training',
  '-3 Training',
  '-4 Training',
  '-5 Training',
  '-6 Training',
  '-7 Training',
  '-8 Training'
];

export const CategorisedTrainings = ['No category', 'Individual'];

export const getCategorisedOption = (option: string) => {
  switch (option) {
    case 'No Category':
      return 'noCategory';
    case 'Individual':
      return 'individual';
    default:
      return 'Individual';
  }
};

export const getFilterOption = (option: string) => {
  switch (option) {
    case matchOptions[0]:
      return 'allMatches';
    default:
      return option.toLowerCase();
  }
};

export const getFilterOptionTraining = (option: string) => {
  switch (option) {
    case TrainingOptionsPlus[0]:
      return 'matchday';
    case TrainingOptionsPlus[1]:
      return 'plusOne';
    case TrainingOptionsPlus[2]:
      return 'plusTwo';
    case TrainingOptionsPlus[3]:
      return 'plusThree';
    case TrainingOptionsMinus[0]:
      return 'minusOne';
    case TrainingOptionsMinus[1]:
      return 'minusTwo';
    case TrainingOptionsMinus[2]:
      return 'minusThree';
    case TrainingOptionsMinus[3]:
      return 'minusFour';
    case TrainingOptionsMinus[4]:
      return 'minusFive';
    case TrainingOptionsMinus[5]:
      return 'minusSix';
    case TrainingOptionsMinus[6]:
      return 'minusSeven';
    case TrainingOptionsMinus[7]:
      return 'minusEight';
    default:
      return '';
  }
};

export const initialProgressFilter = {
  allMatches: false,
  won: false,
  lost: false,
  tied: false,
  allTrainings: false,
  matchday: false,
  plusOne: false,
  plusTwo: false,
  plusThree: false,
  minusOne: false,
  minusTwo: false,
  minusThree: false,
  minusFour: false,
  minusFive: false,
  minusSix: false,
  minusSeven: false,
  minusEight: false,
  noCategory: false,
  individual: false
};
const getTooltipWeeklyEffort = (
  load: number,
  range: number[],
  weekIndex: number
) => {
  if (weekIndex === 0) return `Your Total Load this week is ${load} so far!`;
  if (load < range[0]) {
    return 'Your Total Load this week was lower than usual. This can be beneficial for recovery.';
  }
  if (load > range[1]) {
    return 'Your Total Load this week was higher than usual. Steady training minimizes the risk of injuries.';
  }
  return 'Well done! Your Total Load this week is spot on compared to the average of your previous 12 weeks.';
};

export const getWeeklyEffortData = (games: GameAny[], playerId: string) => {
  const data = {} as any;

  for (let i = 0; i < 12; i++) {
    const start = moment()
      .startOf('week')
      .subtract(i * 7, 'd')
      .format('YYYY/MM/DD');
    const end = moment()
      .endOf('week')
      .subtract(i * 7, 'd')
      .format('YYYY/MM/DD');
    data[`${start}-${end}`] = {
      weekIndex: i,
      totalWeeklyLoad: 0,
      sessions: [],
      daysOfWeek: {
        monday: {
          load: 0,
          isMatchday: false
        },
        tuesday: {
          load: 0,
          isMatchday: false
        },
        wednesday: {
          load: 0,
          isMatchday: false
        },
        thursday: {
          load: 0,
          isMatchday: false
        },
        friday: {
          load: 0,
          isMatchday: false
        },
        saturday: {
          load: 0,
          isMatchday: false
        },
        sunday: {
          load: 0,
          isMatchday: false
        }
      }
    };
  }

  games.forEach((item) => {
    const start = moment(item.date, 'YYYY/MM/DD')
      .startOf('week')
      .format('YYYY/MM/DD');
    const end = moment(item.date, 'YYYY/MM/DD')
      .endOf('week')
      .format('YYYY/MM/DD');

    const key = `${start}-${end}`;
    if (!data[key]) return;

    const playerLoad = Math.round(
      item.report?.stats.players[playerId]?.fullSession?.playerLoad?.total || 0
    );
    const dayOfWeek = moment(item.date, 'YYYY/MM/DD')
      .format('dddd')
      .toLowerCase();

    const isMatch = item.type === GameType.Match;

    data[key].totalWeeklyLoad = data[key].totalWeeklyLoad + playerLoad;
    data[key].daysOfWeek[dayOfWeek].load =
      data[key].daysOfWeek[dayOfWeek].load + playerLoad;
    data[key].sessions = [...data[key].sessions, item];
    if (isMatch) {
      data[key].daysOfWeek[dayOfWeek].isMatchday = true;
    }
  });

  Object.keys(data).forEach((key) => {
    const weekIndex = data[key].weekIndex;
    const load = data[key].totalWeeklyLoad;
    const startDayOfWeek = key.split('-')[0];
    const twelveWeekBeforeStartDate = moment(startDayOfWeek, 'YYYY/MM/DD')
      .subtract(12, 'w')
      .format('YYYY/MM/DD');

    let totalLoadFromPrevTwelveWeeks = 0;
    games.forEach((game) => {
      if (
        moment(game.date, 'YYYY/MM/DD').isSameOrAfter(
          moment(twelveWeekBeforeStartDate, 'YYYY/MM/DD')
        ) &&
        moment(game.date, 'YYYY/MM/DD').isBefore(
          moment(startDayOfWeek, 'YYYY/MM/DD')
        )
      ) {
        const playerLoad = Math.round(
          game.report?.stats.players[playerId]?.fullSession?.playerLoad
            ?.total || 0
        );

        totalLoadFromPrevTwelveWeeks =
          totalLoadFromPrevTwelveWeeks + playerLoad;
      }
    });
    const benchmark = Math.round(totalLoadFromPrevTwelveWeeks / 12);
    const benchMarkRange = [
      Math.round(benchmark * 0.75),
      Math.round(benchmark * 1.25)
    ];
    const isInRange = load >= benchMarkRange[0] && load <= benchMarkRange[1];
    data[key].benchmark = benchmark;
    data[key].benchMarkRange = benchMarkRange;
    data[key].isInRange = load === 0 ? false : isInRange;
    data[key].description = getTooltipWeeklyEffort(
      load,
      benchMarkRange,
      weekIndex
    );
  });

  const finalData = {} as { [n: string]: WeeklyEffortData };
  Object.keys(data).forEach((key) => {
    const newKey = data[key].weekIndex;
    finalData[newKey] = { ...data[key], name: key };
  });

  return finalData;
};

export const generateMatchComparisonArray = (options: PrgoressFilterType) => {
  if (options.allMatches) return [];

  return matchOptions
    .filter(
      (item) => options[getFilterOption(item) as keyof PrgoressFilterType]
    )
    .map((item) => {
      if (item === matchOptions[1]) return 'w';
      if (item === matchOptions[2]) return 'l';
      if (item === matchOptions[3]) return 'd';
      return item;
    });
};

export const generateTrainingComparisonArray = (
  options: PrgoressFilterType
) => {
  if (options.allTrainings) return [];

  const filteringArray = [...TrainingOptionsMinus, ...TrainingOptionsPlus];
  return filteringArray
    .filter(
      (item) =>
        options[getFilterOptionTraining(item) as keyof PrgoressFilterType]
    )
    .map((item) => {
      const plusIndex = TrainingOptionsPlus.indexOf(item);
      if (plusIndex !== -1) return `${plusIndex}`;

      const minusIndex = TrainingOptionsMinus.indexOf(item);
      if (minusIndex !== -1) return `-${minusIndex + 1}`;

      return '';
    });
};

export const progressFilterFiltration = (
  progressFilter: PrgoressFilterType,
  playerGames: GameAny[]
) => {
  const matchComparisonArray = generateMatchComparisonArray(progressFilter);
  const trainingComparisonArray =
    generateTrainingComparisonArray(progressFilter);
  const { allMatches, allTrainings, individual, noCategory } = progressFilter;
  return playerGames.filter((game) => {
    if (
      (allMatches && game.type === GameType.Match) ||
      (allTrainings && game.type === GameType.Training)
    ) {
      return true;
    }
    if (
      individual &&
      game.type === GameType.Training &&
      game.benchmark?.indicator === 'individual'
    ) {
      return true;
    }
    if (
      noCategory &&
      game.type === GameType.Training &&
      game.benchmark?.indicator === 'no_category'
    ) {
      return true;
    }
    if (game.type === GameType.Match) {
      const gameResult = game.status?.scoreResult;
      return gameResult && matchComparisonArray.includes(gameResult);
    } else {
      const indicator = game.benchmark?.indicator?.toString();
      return indicator && trainingComparisonArray.includes(indicator as any);
    }
  });
};
