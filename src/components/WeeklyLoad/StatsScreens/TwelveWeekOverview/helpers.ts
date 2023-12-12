import moment from 'moment';

import { GameAny } from '../../../../../types';

export type WeekOverviewData = {
  weekIndex: number;
  totalLoad: number;
  pastTwelveWeeksTotalLoad: number;
  pastTwelveWeeksTotalAverage: number;
  pastTwelveWeeksStartDate: string;
  pastTwelveWeeksEndDate: string;
  percentageOfAverage: number;
  percentageOfPrevWeek: number;
  title: string;
  weekNumber: number;
};

export const getTwelveWeekOverviewData = (
  games: GameAny[],
  startOfWeek: string,
  playerId?: string | undefined
) => {
  const data = [] as WeekOverviewData[];

  for (let i = 0; i < 13; i++) {
    const start = moment(startOfWeek, 'YYYY/MM/DD')
      .subtract(i * 7, 'd')
      .format('YYYY/MM/DD');
    const end = moment(startOfWeek, 'YYYY/MM/DD')
      .endOf('week')
      .subtract(i * 7, 'd')
      .format('YYYY/MM/DD');
    const startDateOfPrevTwelveWeek = moment(start, 'YYYY/MM/DD')
      .subtract(12, 'weeks')
      .format('YYYY/MM/DD');
    const title = `${moment(start, 'YYYY/MM/DD').format('MMMM DD')} - ${moment(
      end,
      'YYYY/MM/DD'
    ).format('MMMM DD')}`;

    const weekNumber = moment(start, 'YYYY/MM/DD').week();

    data.unshift({
      weekIndex: 12 - i,
      totalLoad: 0,
      pastTwelveWeeksTotalLoad: 0,
      pastTwelveWeeksTotalAverage: 0,
      pastTwelveWeeksStartDate: startDateOfPrevTwelveWeek,
      pastTwelveWeeksEndDate: start,
      percentageOfAverage: 0,
      percentageOfPrevWeek: 0,
      title,
      weekNumber
    });
  }

  games.forEach((item) => {
    const start = moment(item.date, 'YYYY/MM/DD')
      .startOf('week')
      .format('MMMM DD');
    const end = moment(item.date, 'YYYY/MM/DD').endOf('week').format('MMMM DD');

    const key = `${start} - ${end}`;
    let load = 0;

    if (playerId) {
      load = Math.round(
        (item.report?.stats?.players &&
          item.report?.stats?.players[playerId]?.fullSession?.playerLoad
            ?.total) ||
          0
      );
    } else {
      load = Math.round(
        item.report?.stats.team.fullSession.playerLoad.total || 0
      );
    }

    const index = data.findIndex(({ title }) => {
      return title === key;
    });

    if (data[index]) {
      data[index].totalLoad = data[index].totalLoad + load;
    }

    data.forEach((week) => {
      const startOfPrevTwelveWeeks = week.pastTwelveWeeksStartDate;
      const endOfPrevTwelveWeeks = week.pastTwelveWeeksEndDate;
      const isInTwelveWeeksRange = moment(item.date, 'YYYY/MM/DD').isBetween(
        startOfPrevTwelveWeeks,
        endOfPrevTwelveWeeks,
        undefined,
        '[)'
      );
      if (isInTwelveWeeksRange) {
        week.pastTwelveWeeksTotalLoad = week.pastTwelveWeeksTotalLoad + load;
      }
    });
  });

  data.forEach((item, i) => {
    const prevWeekLoad = data[i - 1]?.totalLoad || 0;
    const twelveWeeksAverage = Math.round(item.pastTwelveWeeksTotalLoad / 12);
    item.pastTwelveWeeksTotalAverage = twelveWeeksAverage;
    item.percentageOfAverage = Math.round(
      (item.totalLoad / twelveWeeksAverage - 1) * 100
    );
    item.percentageOfPrevWeek = Math.round(
      (item.totalLoad / prevWeekLoad - 1) * 100
    );
  });

  const lastWeekNumber = data[data.length - 1].weekNumber;

  if (lastWeekNumber < 12) {
    const newData = data.filter(
      ({ weekNumber }) => weekNumber <= lastWeekNumber
    );
    return [
      ...newData,
      ...new Array(12 - lastWeekNumber).fill({
        weekIndex: 0,
        totalLoad: 0,
        pastTwelveWeeksTotalLoad: 0,
        pastTwelveWeeksTotalAverage: 0,
        pastTwelveWeeksStartDate: '',
        pastTwelveWeeksEndDate: '',
        percentageOfAverage: 0,
        percentageOfPrevWeek: 0,
        title: '',
        weekNumber: 0
      })
    ].map((item, index) => ({ ...item, weekIndex: index + 1 }));
  }

  return data.filter(({ weekIndex }) => !!weekIndex);
};
