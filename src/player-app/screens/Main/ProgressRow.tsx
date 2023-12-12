import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';

import { GameAny, GameType, IntensityZones } from '../../../../types';
import { Icon } from '../../../components/icon/icon';
import LinearGradientView from '../../../components/LinearGradientView';
import { color } from '../../../theme';
import { ActivitiesStackParamList } from '../../../types';
import { derivePlayerStats } from '../../../utils/adapter';
import { variables } from '../../../utils/mixins';
import {
  getIconMatch,
  getIconTraining,
  getTrainingTitle,
  getZonesData
} from '../../heleprs';

interface ProgressRowProps {
  game: GameAny;
  playerId: string;
  playerGames: GameAny[];
  activeItem?: string;
  section?: string;
  screenNumber?: 1 | 0;
}

const ProgressRow = ({
  game,
  playerGames,
  playerId,
  activeItem,
  section,
  screenNumber
}: ProgressRowProps) => {
  const route = useRoute() as RouteProp<
    ActivitiesStackParamList,
    'ActivitiesProgress'
  >;
  const session = route.params?.game;
  const navigation = useNavigation() as any;
  const isMatch = game.type === 'match';
  const playerStats = useMemo(
    () => derivePlayerStats(game, playerId, playerGames),
    [game, playerId, playerGames]
  );
  const { totalLoad, numberOfSameTypeEvents, averageLoad, highestLoad } =
    playerStats;
  const zones = useMemo(
    () =>
      getZonesData(
        game.report?.stats?.players[playerId]?.fullSession
          .intensityZones as IntensityZones,
        true
      ),
    [game, game.report, playerId]
  );
  let totalTime = zones.totalTime
    .split(' ')
    .filter((string) => !string.includes('s'))
    .join(' ');

  if (!totalTime) {
    totalTime = zones.totalTime;
  }

  const load = isMatch
    ? Math.round((totalLoad / highestLoad) * 100 - 100)
    : Math.round((totalLoad / averageLoad) * 100 - 100);

  const icon = isMatch
    ? getIconMatch(numberOfSameTypeEvents, load)
    : getIconTraining(numberOfSameTypeEvents, load);

  const gameTitle = isMatch
    ? `vs. ${
        game.versus && game.versus?.length > 12
          ? `${game.versus.slice(0, 12)}.`
          : game.versus
      }`
    : `${getTrainingTitle(game.benchmark?.indicator)} Training`;

  const Row = () => (
    <Pressable
      onPress={() => {
        if (session?.id === game.id) return;

        const prevRoute = session
          ? session.type === GameType.Match
            ? 'All Matches'
            : `All ${getTrainingTitle(session.benchmark?.indicator)} Trainings`
          : 'Progress';
        navigation.push('ActivityInfo', {
          game,
          playerStats,
          prevRoute
        });
      }}
      style={styles.rowContainer}
    >
      {activeItem === game.id && <View style={styles.activeRow} />}
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.dateText}>
          {moment(game.date).format('MMMM DD')}
        </Text>
        {isMatch && screenNumber === 0 && (
          <LinearGradientView
            linearGradient={{ y2: '100%' }}
            colors={[
              {
                offset: 0,
                color: variables.gradientPink
              },
              {
                offset: 1,
                color: variables.gradientPurple
              }
            ]}
            style={{ height: 8, width: 8, borderRadius: 50 }}
          />
          // style={{ height: 8, width: 8, borderRadius: 50 }}
          // source={DotMatchImage}
          // />
        )}
      </View>
      <Text style={styles.rowText}>{gameTitle}</Text>

      <Text
        style={{
          ...styles.rowText,
          width: 55,
          flex: 0
        }}
      >
        {totalTime}
      </Text>

      <View style={styles.totalLoadContainer}>
        <Text style={styles.totalLoadText}>{totalLoad}</Text>
        <View style={{ width: 12 }}>
          {icon !== 'info_icon' && (
            <Icon
              icon={icon}
              style={{
                color: variables.chartLightGrey,
                height: icon === 'spot_on' ? 12 : 10
              }}
            />
          )}
        </View>
      </View>
      <View>
        {session?.id !== game.id
          ? (
          <Icon icon="arrow_next" style={styles.nextIcon} />
            )
          : (
          <View style={{ width: 20 }} />
            )}
      </View>
    </Pressable>
  );

  if (section) {
    return (
      <View>
        <Text style={styles.sectionTitle}>{section}</Text>
        <Row />
      </View>
    );
  }

  return <Row />;
};

export default ProgressRow;

const styles = StyleSheet.create({
  activeRow: {
    backgroundColor: color.palette.orange,
    borderRadius: 6,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 5
  },
  dateText: {
    color: variables.textBlack,
    fontSize: 12,
    marginRight: 10
  },
  nextIcon: {
    color: variables.chartLightGrey,
    height: 14
  },
  rowContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    height: 44,
    justifyContent: 'space-between',
    marginBottom: 1,
    paddingLeft: 21,
    paddingRight: 15
  },
  rowText: {
    color: variables.textBlack,
    flex: 1,
    fontSize: 12
  },
  sectionTitle: {
    backgroundColor: variables.white,
    color: variables.grey2,
    fontFamily: variables.mainFont,
    fontSize: 10,
    height: 44,
    paddingLeft: 16,
    paddingTop: 21
  },
  totalLoadContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
    width: 70
  },
  totalLoadText: {
    color: color.palette.black2,
    fontFamily: variables.mainFontBold,
    fontSize: 12
  }
});
