import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { getCurrentWeek } from '../../../../redux/slices/currentWeek';
import { selectAllGames } from '../../../../redux/slices/gamesSlice';
import { useAppSelector } from '../../../../redux/store';

import { getTwelveWeekOverviewData } from './helpers';
import TwelveWeekOverviewChart from './TwelveWeekOverviewChart';
import TwelveWeekOverviewHeader from './TwelveWeekOverviewHeader';

type Props = {
  playerId?: string;
  startOfCurrentWeek?: string;
};

const TwelveWeekOverview = ({ playerId, startOfCurrentWeek }: Props) => {
  const currentWeek = useAppSelector(getCurrentWeek);
  const allGames = useAppSelector(selectAllGames);
  const { start } = currentWeek;
  const startOfWeek = startOfCurrentWeek || start;

  const [data, setData] = useState(
    getTwelveWeekOverviewData(allGames, startOfWeek, playerId)
  );
  const [activeWeek, setActiveWeek] = useState(data[data.length - 1]);

  useEffect(() => {
    const weekNo = moment(startOfWeek, 'YYYY/MM/DD').week();
    if (weekNo < 12) return;
    setData(getTwelveWeekOverviewData(allGames, startOfWeek, playerId));
    setActiveWeek(data[data.length - 1]);
  }, [currentWeek]);

  return (
    <>
      <TwelveWeekOverviewHeader data={activeWeek} />
      <TwelveWeekOverviewChart
        data={data}
        activeWeek={activeWeek}
        setActiveWeek={setActiveWeek}
      />
    </>
  );
};

export default TwelveWeekOverview;
