import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import { GameType } from '../../../../../types';
import { selectAuth } from '../../../../redux/slices/authSlice';
import { selectActiveClub } from '../../../../redux/slices/clubsSlice';
import { updateGameAction } from '../../../../redux/slices/gamesSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import { ActivitiesStackParamList } from '../../../../types';
import { variables } from '../../../../utils/mixins';
import EventDetailsHeader from '../../../components/EventDetailsHeader';

import AcuteChronicPlayerApp from './components/AcuteChronic';
import CardContainer from './components/CardContainer';
import IntensityZones from './components/IntensityZones';
import TeamEffort from './components/TeamEffort';
import TimeOnIce from './components/TimeOnIce';
import TotalLoad from './components/TotalLoad';

const ActivityInfo = () => {
  const dispatch = useAppDispatch();
  const { params } = useRoute() as RouteProp<
    ActivitiesStackParamList,
    'ActivityInfo'
  >;
  const auth = useAppSelector(selectAuth);

  const playerId = auth?.playerId || '';
  const { game, playerStats } = params;
  const isMatch = game.type === GameType.Match;
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  const rpeNumber = game.rpe ? game.rpe[playerId] : 0;

  useEffect(() => {
    addUserToReaderList();
  }, []);

  const addUserToReaderList = () => {
    const readerList = [...(game?.readerList || [])];
    if (!readerList.includes(playerId)) {
      readerList.push(playerId);
      dispatch(updateGameAction({ ...game, readerList }));
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <EventDetailsHeader game={game} />
      {!!rpeNumber && (
        <View style={styles.rpeContainer}>
          <Text style={styles.rpeText}>
            {isMatch ? 'Match' : 'Training'} feedback
          </Text>
          <View style={styles.rpeWrapper}>
            {Array(10)
              .fill(null)
              .map((_, index) => {
                const number = index + 1;
                return (
                  <View
                    style={[
                      styles.rpeCircle,
                      rpeNumber === number && styles.activeRpeCircle
                    ]}
                    key={index}
                  >
                    <Text
                      style={[
                        styles.rpeTextSecondary,
                        rpeNumber === number && styles.activeRpeTextSecondary
                      ]}
                    >
                      {number}
                    </Text>
                  </View>
                );
              })}
          </View>
        </View>
      )}
      <ScrollView style={{ paddingTop: 10, marginBottom: 10 }}>
        <CardContainer>
          <TotalLoad
            event={game}
            playerStats={playerStats}
            playerId={playerId}
          />
        </CardContainer>
        {isMatch && isHockey && (
          <CardContainer>
            <TimeOnIce event={game} playerId={playerId} />
          </CardContainer>
        )}
        <TeamEffort event={game} playerLoad={playerStats.totalLoad} />
        <CardContainer>
          <IntensityZones
            zones={
              game.report?.stats.players[playerId].fullSession.intensityZones
            }
          />
        </CardContainer>
        {game.type === GameType.Training && (
          <CardContainer>
            <AcuteChronicPlayerApp game={game} />
          </CardContainer>
        )}
      </ScrollView>
    </View>
  );
};

export default ActivityInfo;

const styles = StyleSheet.create({
  activeRpeCircle: {
    backgroundColor: variables.lighterGrey
  },
  activeRpeTextSecondary: {
    color: variables.realWhite
  },
  rpeCircle: {
    alignItems: 'center',
    borderColor: variables.lighterGrey,
    borderRadius: 50,
    borderWidth: 2,
    height: 32,
    justifyContent: 'center',
    width: 32
  },
  rpeContainer: {
    backgroundColor: variables.realWhite,
    padding: 16
  },
  rpeText: {
    color: variables.grey,
    fontFamily: variables.mainFontSemiBold,
    fontSize: 12,
    marginBottom: 16
  },
  rpeTextSecondary: {
    color: variables.lighterGrey,
    fontFamily: variables.mainFontBold,
    fontSize: 12
  },
  rpeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
