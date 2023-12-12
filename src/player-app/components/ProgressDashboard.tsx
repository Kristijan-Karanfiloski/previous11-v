import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { GameAny, GameType } from '../../../types';
import { selectAuth } from '../../redux/slices/authSlice';
import { selectFinishedGamesByPlayer } from '../../redux/slices/gamesSlice';
import { useAppSelector } from '../../redux/store';
import { variables } from '../../utils/mixins';
import { getTime, getTrainingTitle } from '../heleprs';

import ProgressDashboardGraph from './ProgressDashboardGraph';

const ProgressDashboard = () => {
  const navigation = useNavigation() as any;

  const auth = useAppSelector(selectAuth);
  const playerId = auth?.playerId || '';
  const playerGames = useAppSelector((state) =>
    selectFinishedGamesByPlayer(state, playerId)
  );
  const lastNineGames = [...playerGames].reverse().splice(0, 9);
  const [activeGameIndex, setActiveGameIndex] = useState(0);

  const getPlayerLoad = (game: GameAny, playerId: string) => {
    return Math.round(
      game.report?.stats.players[playerId]?.fullSession?.playerLoad?.total || 0
    );
  };

  const getFormattedDate = (game: GameAny) => {
    return moment(game.date, 'YYYY/MM/DD').format('MMMM DD');
  };

  const getType = (game: GameAny) => {
    if (game.type === GameType.Match) {
      return 'Match';
    }
    const title = getTrainingTitle(game.benchmark?.indicator);
    if (title) {
      return `${title} training`;
    }
    return `training`;
  };

  const getTotalTime = (game: GameAny, playerId: string) => {
    const totalSeconds = Math.round(
      (game.report?.stats.players[playerId]?.fullSession.intensityZones
        .explosive || 0) +
        (game.report?.stats.players[playerId]?.fullSession.intensityZones
          .high || 0) +
        (game.report?.stats.players[playerId]?.fullSession.intensityZones.low ||
          0) +
        (game.report?.stats.players[playerId]?.fullSession.intensityZones
          .moderate || 0) +
        (game.report?.stats.players[playerId]?.fullSession.intensityZones
          .veryHigh || 0)
    );

    return getTime(totalSeconds, true);
  };

  const formattedData = (games: GameAny[]) => {
    return games.map((item) => {
      const playerLoad =
        item.report?.stats.players[playerId]?.fullSession?.playerLoad?.total ||
        0;
      return {
        playerLoad: Math.round(playerLoad),
        isMatch: item.type === GameType.Match
      };
    });
  };

  const onItemPress = (index: number) => {
    setActiveGameIndex(index);
  };

  if (lastNineGames.length === 0) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {getFormattedDate(lastNineGames[activeGameIndex])}
      </Text>
      <View style={styles.content}>
        <Text style={styles.loadText}>
          {getPlayerLoad(lastNineGames[activeGameIndex], playerId)}
        </Text>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.divider}></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Type</Text>
            <Text numberOfLines={1} style={{ ...styles.text }}>
              {getType(lastNineGames[activeGameIndex])}
            </Text>
          </View>
          <View style={styles.divider}></View>
          <View style={{ width: 110 }}>
            <Text style={styles.label}>Activity Time</Text>
            <Text style={styles.text}>
              {getTotalTime(lastNineGames[activeGameIndex], playerId)}
            </Text>
          </View>
        </View>
      </View>
      <ProgressDashboardGraph
        games={formattedData(lastNineGames)}
        activeGameIndex={activeGameIndex}
        onItemPress={onItemPress}
      />
      <Pressable
        onPress={() => navigation.navigate('Progress')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>View full activity log</Text>
      </Pressable>
    </View>
  );
};

export default ProgressDashboard;

const styles = StyleSheet.create({
  button: {
    marginLeft: 'auto'
  },
  buttonText: {
    color: variables.grey2,
    fontFamily: variables.mainFontBold
  },
  container: {
    backgroundColor: variables.realWhite,
    borderRadius: 8,
    marginBottom: 12,
    paddingBottom: 22,
    paddingHorizontal: 16,
    paddingTop: 27,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 32
  },
  divider: {
    backgroundColor: variables.textBlack,
    height: 32,
    marginHorizontal: 24,
    width: 1
  },

  label: {
    fontFamily: variables.mainFontLight,
    fontSize: 10,
    marginBottom: 8
  },
  loadText: {
    fontFamily: variables.mainFontBold,
    fontSize: 55
  },
  text: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 18
  },
  title: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 18
  }
});
