import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { GameAny, GameType, IntensityZones } from '../../../../../../../types';
import { Icon } from '../../../../../../components/icon/icon';
import { selectFinishedGamesByPlayer } from '../../../../../../redux/slices/gamesSlice';
import { useAppSelector } from '../../../../../../redux/store';
import { derivePlayerStats } from '../../../../../../utils/adapter';
import { variables } from '../../../../../../utils/mixins';
import ActivityDescription from '../../../../../components/ActivityDescription';
import OptimalRangeGraph from '../../../../../components/OptimalRangeGraph';
import TotalLoadGraph from '../../../../../components/TotalLoadGraph';
import TotalLoadPlayer from '../../../../../components/TotalLoadPlayer';
import { getTrainingTitle, getZonesData } from '../../../../../heleprs';
import { PlayerStats } from '../../../../../playerAppTypes';

import LoadPerMinute from './LoadPerMinute';
import TotalLoadGameCard from './TotalLoadGameCard';

type Props = {
  event: GameAny;
  playerId: string;
  playerStats: PlayerStats;
};

const TotalLoad = ({ event, playerStats, playerId }: Props) => {
  const navigation = useNavigation() as any;
  const games = useAppSelector((state) =>
    selectFinishedGamesByPlayer(state, playerId)
  );
  const isMatch = event.type === GameType.Match;

  const {
    totalLoad,
    lowestLoad,
    highestLoad,
    averageLoad,
    numberOfSameTypeEvents,
    lowestEvent,
    highestEvent,
    loadPerMin
  } = playerStats;

  const renderGraph = () => {
    if (!isMatch) {
      if (numberOfSameTypeEvents === 0) {
        return (
          <TotalLoadGraph
            playerLoad={totalLoad}
            average={averageLoad}
            highest={totalLoad}
            lowest={lowestLoad}
            isTraining
          />
        );
      }

      return <OptimalRangeGraph playerLoad={totalLoad} average={averageLoad} />;
    }

    return (
      <TotalLoadGraph
        playerLoad={totalLoad}
        average={averageLoad}
        highest={highestLoad}
        lowest={lowestLoad}
        numberOfSameTypeEvents={numberOfSameTypeEvents}
      />
    );
  };

  const renderEventCard = (game: GameAny, type: 'lowest' | 'highest') => {
    const playerStats = derivePlayerStats(game, playerId, games);
    const { totalTime } = getZonesData(
      (playerId &&
        game.report?.stats?.players[playerId] &&
        game.report?.stats?.players[playerId]?.fullSession &&
        (game.report?.stats?.players[playerId]?.fullSession
          .intensityZones as IntensityZones)) || {
        explosive: 0,
        high: 0,
        low: 0,
        veryHigh: 0,
        moderate: 0
      },
      true
    );
    return (
      <TotalLoadGameCard
        load={type === 'lowest' ? lowestLoad : highestLoad}
        type={type}
        event={game}
        isPressable={game.id !== event.id}
        onPress={() =>
          navigation.replace('ActivityInfo', { game, playerStats })
        }
        totalTime={totalTime}
      />
    );
  };

  const renderGameCards = () => {
    if (!highestEvent && !lowestEvent) return null;
    return (
      <View style={styles.gameCardsContainer}>
        {lowestEvent && renderEventCard(lowestEvent, 'lowest')}
        {highestEvent && renderEventCard(highestEvent, 'highest')}
      </View>
    );
  };

  const getViewAllButtonText = () => {
    if (isMatch) return 'View All Matches';
    const desc = getTrainingTitle(event.benchmark?.indicator);
    return `View all ${desc} trainings`;
  };

  const renderViewAllButton = () => {
    if (event.benchmark?.indicator === Infinity) return null;
    return (
      <Pressable
        onPress={() =>
          navigation.navigate('ActivitiesProgress', {
            game: event
          })
        }
        style={styles.viewAllButton}
      >
        <Text style={styles.viewAllText}>{getViewAllButtonText()}</Text>
      </Pressable>
    );
  };

  return (
    <>
      <Pressable
        style={styles.infoIcon}
        onPress={() =>
          navigation.navigate('TooltipModal', {
            modal: isMatch ? 'totalLoadMatch' : 'totalLoadTraining'
          })
        }
      >
        <Icon icon="info_icon" style={{ color: '#DADADA' }} />
      </Pressable>
      <Text style={styles.eventTitle}>Total Load</Text>
      <TotalLoadPlayer
        isMatch={isMatch}
        playerStats={playerStats}
        uiType="horizontal"
      />
      <LoadPerMinute load={loadPerMin} />
      <ActivityDescription
        isMatch={isMatch}
        playerStats={playerStats}
        indicator={event.benchmark?.indicator}
      />
      {renderGraph()}
      {renderGameCards()}
      {renderViewAllButton()}
    </>
  );
};

export default TotalLoad;

const styles = StyleSheet.create({
  eventTitle: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 18
  },

  gameCardsContainer: {
    marginTop: 37
  },
  infoIcon: {
    position: 'absolute',
    right: 20,
    top: 24,
    zIndex: 1
  },
  viewAllButton: {
    alignSelf: 'flex-end',
    marginTop: 35
  },
  viewAllText: {
    color: variables.grey2,
    fontFamily: variables.mainFontBold,
    fontSize: 14
  }
});
