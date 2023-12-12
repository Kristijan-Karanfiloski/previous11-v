import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { GameAny, GameType, IntensityZones } from '../../../../../../../types';
import { Icon } from '../../../../../../components/icon/icon';
import { selectAuth } from '../../../../../../redux/slices/authSlice';
import { selectFinishedGamesByPlayer } from '../../../../../../redux/slices/gamesSlice';
import { useAppSelector } from '../../../../../../redux/store';
import { derivePlayerStats } from '../../../../../../utils/adapter';
import { variables } from '../../../../../../utils/mixins';
import DescriptionBubble from '../../../../../components/DescriptionBubble';
import { getTrainingTitle, getZonesData } from '../../../../../heleprs';
import CardContainer from '../CardContainer';
import TotalLoadGameCard from '../TotalLoad/TotalLoadGameCard';

import {
  getDescriptionText,
  getIcon,
  getTotalAndPercentageLoad
} from './helpers';

type Props = {
  event: GameAny;
  playerLoad: number;
};

const TeamEffort = ({ event, playerLoad }: Props) => {
  const navigation = useNavigation() as any;
  const auth = useAppSelector(selectAuth);
  const playerId = auth?.playerId || '';
  const isMatch = event.type === GameType.Match;
  const games = useAppSelector((state) =>
    selectFinishedGamesByPlayer(state, playerId)
  );

  const { load, percentageOfLoad, lowestGame, highestGame } =
    getTotalAndPercentageLoad(isMatch, games, event);

  const descriptionText = getDescriptionText(
    isMatch,
    percentageOfLoad,
    getTrainingTitle(event.benchmark?.indicator)
  );
  const icon = getIcon(isMatch, percentageOfLoad);
  const iconStyle = icon === 'spot_on' ? styles.iconSpotOn : styles.iconArrow;
  const isHighestMatch = isMatch && percentageOfLoad >= 100;

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

  if (!percentageOfLoad) {
    return null;
  }

  return (
    <CardContainer>
      <Text style={styles.title}>Team Effort</Text>
      <View>
        <Text style={styles.subtitle}>Average team Load</Text>
        <View
          style={[
            styles.wrapper,
            isHighestMatch && { marginBottom: 30, marginTop: 15 }
          ]}
        >
          <Text style={[styles.text, isHighestMatch && { fontSize: 24 }]}>
            {isHighestMatch ? 'Highest Match' : `${percentageOfLoad}%`}
          </Text>
          <Icon
            style={StyleSheet.flatten([styles.icon, iconStyle])}
            icon={icon}
          />
        </View>
      </View>
      <View style={styles.descriptionContainer}>
        <DescriptionBubble text={descriptionText} icon={icon} />
      </View>
      {isMatch && (
        <View style={{ marginBottom: 28 }}>
          {highestGame && renderEventCard(highestGame, 'highest')}
          {lowestGame && renderEventCard(lowestGame, 'lowest')}
        </View>
      )}
      <Pressable
        onPress={() => navigation.navigate('TeamEffort', { game: event })}
        style={styles.button}
      >
        <Text style={styles.buttonText}>View the complete Team Effort</Text>
      </Pressable>
    </CardContainer>
  );
};

export default TeamEffort;

const styles = StyleSheet.create({
  button: {
    marginLeft: 'auto'
  },
  buttonText: {
    color: variables.grey2,
    fontFamily: variables.mainFontBold
  },
  descriptionContainer: { marginBottom: 35 },
  icon: {
    marginLeft: 5
  },
  iconArrow: {
    height: 16,
    width: 16
  },
  iconSpotOn: {
    height: 20,
    width: 20
  },

  subtitle: {
    fontFamily: variables.mainFontLight,
    fontSize: 10
  },
  text: {
    fontFamily: variables.mainFontBold,
    fontSize: 55
  },
  title: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 18,
    marginBottom: 28
  },
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row'
  }
});
