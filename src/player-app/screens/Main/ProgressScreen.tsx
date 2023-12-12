import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';

import { GameType } from '../../../../types';
import { selectAuth } from '../../../redux/slices/authSlice';
import { selectFinishedGamesByPlayer } from '../../../redux/slices/gamesSlice';
import { progressFilterState } from '../../../redux/slices/progressFilter';
import { useAppSelector } from '../../../redux/store';
import { ActivitiesStackParamList } from '../../../types';
import { progressFilterFiltration } from '../../heleprs';

import Progress from './Progress';

const ProgressScreen = () => {
  const route = useRoute() as RouteProp<
    ActivitiesStackParamList,
    'ActivitiesProgress'
  >;

  const auth = useAppSelector(selectAuth);
  const playerId = auth?.playerId || '';
  const playerGames = [
    ...useAppSelector((state) => selectFinishedGamesByPlayer(state, playerId))
  ].reverse();
  const progressFilter = useAppSelector(progressFilterState);

  const getGames = () => {
    if (route.params?.game) {
      const game = route.params?.game;
      const isMatch = game.type === GameType.Match;
      if (isMatch) {
        return playerGames.filter(({ type }) => type === GameType.Match);
      }
      const desc = game.benchmark?.indicator;
      return playerGames.filter(
        ({ benchmark }) => benchmark?.indicator === desc
      );
    }
    if (progressFilter.numberOfFilters > 0) {
      return progressFilterFiltration(
        progressFilter.filterOptions,
        playerGames
      );
    }

    return playerGames;
  };

  return (
    <Progress
      games={getGames()}
      playerId={playerId}
      screenNumber={route.params?.game ? 1 : 0}
    />
  );
};

export default ProgressScreen;
