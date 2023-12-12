import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

import { selectAuth } from '../../../../redux/slices/authSlice';
import { selectFinishedGamesByPlayer } from '../../../../redux/slices/gamesSlice';
import { useAppSelector } from '../../../../redux/store';
import { getWeeklyEffortData } from '../../../heleprs';

import WeeklyGraph from './components/WeeklyGraph';
import WeekOverview from './components/WeekOverview';
import WeekSessionsList from './components/WeekSessionsList';
const WeeklyEffort = () => {
  const auth = useAppSelector(selectAuth);
  const playerId = auth?.playerId || '';
  const games = useAppSelector((state) =>
    selectFinishedGamesByPlayer(state, playerId)
  );
  const data = getWeeklyEffortData(games, playerId);

  const [activeWeek, setActiveWeek] = useState(0);

  const onArrowPress = (type: 'prev' | 'next') => {
    if (type === 'prev') {
      setActiveWeek((prevState) => prevState + 1);
    } else {
      setActiveWeek((prevState) => prevState - 1);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <WeekOverview
        data={data[activeWeek]}
        activeWeek={activeWeek}
        onArrowPress={onArrowPress}
      />

      <WeeklyGraph data={data} activeWeek={activeWeek} />
      <WeekSessionsList
        data={data[activeWeek]}
        activeWeek={activeWeek}
        playerId={playerId}
      />
    </ScrollView>
  );
};

export default WeeklyEffort;
