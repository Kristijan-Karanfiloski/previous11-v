import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import { GameAny, GameType } from '../../../../types';
import ScatterChart from '../../../components/charts/chartTypes/ScatterChart';
import {
  SyncedScrollViewContext,
  syncedScrollViewState
} from '../../../hooks/SyncedScrollViewContext';
import { ActivitiesStackParamList } from '../../../types';
import { derivePlayerStats } from '../../../utils/adapter';
import { variables } from '../../../utils/mixins';
import { SyncedScrollView } from '../../components/SyncedScrollView';
import { getIconMatch, getIconTraining } from '../../heleprs';

import ProgressRow from './ProgressRow';

type Props = {
  games: GameAny[];
  playerId: string;
  screenNumber: 0 | 1;
};

const Progress = ({ games, playerId, screenNumber }: Props) => {
  const route = useRoute() as RouteProp<
    ActivitiesStackParamList,
    'ActivitiesProgress'
  >;
  const game = route.params?.game;
  const [activeItem, setActiveItem] = useState<any>(null);

  useEffect(() => {
    const latestGameId = games[0]?.id;
    if (game) {
      setActiveItem(game.id);
    } else if (latestGameId) {
      setActiveItem(latestGameId);
    }
  }, [game]);

  const generateStatsData = useCallback(() => {
    return games.map((game, index) => {
      const { totalLoad, averageLoad, numberOfSameTypeEvents } =
        derivePlayerStats(game, playerId, games);

      const percentage = Math.round((totalLoad / averageLoad) * 100 - 100);
      const icon =
        game.type === GameType.Match
          ? getIconMatch(numberOfSameTypeEvents, percentage)
          : getIconTraining(numberOfSameTypeEvents, percentage);

      return {
        gameId: game.id,
        y: totalLoad,
        x: index + Math.random() * index * 10,
        id: game.id,
        isMatch: game.type === GameType.Match,
        averageLoad,
        icon
      };
    });
  }, [games, playerId]);

  const generateStatsDataVertical = useCallback(() => {
    const yearSections: string[] = [];
    return games.map((game, i) => {
      const year = game.date.split('/')[0];
      if (i === 0 || !yearSections.includes(year)) {
        yearSections.push(year);
        return { id: game.id, game, section: year };
      }

      return { id: game.id, game };
    });
  }, [games]);

  const renderRow = ({
    game,
    section
  }: {
    game: GameAny;
    section?: string;
  }) => {
    return (
      <ProgressRow
        key={game.id}
        game={game}
        playerId={playerId}
        playerGames={games}
        activeItem={activeItem}
        section={section}
        screenNumber={screenNumber}
      />
    );
  };

  return (
    <SyncedScrollViewContext.Provider value={syncedScrollViewState}>
      <SafeAreaView style={{ flex: 1, backgroundColor: variables.white }}>
        <StatusBar barStyle="dark-content" />
        <ScatterChart
          data={generateStatsData()}
          setActiveItem={setActiveItem}
          activeItem={activeItem}
          screenNumber={screenNumber}
        />

        <SyncedScrollView
          id={'1'}
          showsVerticalScrollIndicator={false}
          data={generateStatsDataVertical()}
          renderRow={({ item }) => {
            return renderRow(item);
          }}
          screenNumber={screenNumber}
        />
      </SafeAreaView>
    </SyncedScrollViewContext.Provider>
  );
};

export default Progress;
