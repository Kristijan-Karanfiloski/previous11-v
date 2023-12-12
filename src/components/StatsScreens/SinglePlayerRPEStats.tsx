import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { GameAny, GameType } from '../../../types';
import { selectActiveClub } from '../../redux/slices/clubsSlice';
import { useAppSelector } from '../../redux/store';
import PlayerWellness from '../../screens/Wellness/PlayerWellness';
import { CHART_TITLES, EXPLANATION_TYPES, variables } from '../../utils/mixins';
import ChartsContainer from '../charts/ChartsContainer';
import RPECircles from '../charts/common/RPECircles';

interface Props {
  event: GameAny;
  playerId: string;
}

const SinglePlayerRPEStats = ({ event, playerId }: Props) => {
  const playerFeedback =
    event && event.rpe && event.rpe[playerId] ? event.rpe[playerId] : 0;
  const { wellness } = useAppSelector(selectActiveClub);
  const date = event.date;
  const wellnessData = wellness && wellness[date] ? wellness[date] : {};

  const getPlayerWellness = () => {
    return {
      name: '',
      fatigued: wellnessData[playerId]?.fatigued || 0,
      sleepQuality: wellnessData[playerId]?.sleepQuality || 0,
      sleepDuration: wellnessData[playerId]?.sleepDuration || 0,
      muscleSoreness: wellnessData[playerId]?.muscleSoreness || 0,
      comment: wellnessData[playerId]?.comment || '',
      noData: !wellnessData[playerId]
    };
  };

  const playerWellnessData = getPlayerWellness();

  return (
    <View>
      <ScrollView>
        <ChartsContainer
          title={
            event.type === GameType.Match
              ? CHART_TITLES.match_feedback
              : CHART_TITLES.training_feedback
          }
          modalType={EXPLANATION_TYPES.rpe}
        >
          <View style={styles.container}>
            <RPECircles playerFeedback={playerFeedback} hasText />
          </View>
        </ChartsContainer>
        <ChartsContainer title={CHART_TITLES.wellness}>
          {playerWellnessData.noData && (
            <Text style={styles.noWellnessText}>No Wellness response</Text>
          )}
          <PlayerWellness
            date={date}
            data={playerWellnessData}
            showPlayerName={false}
          />
        </ChartsContainer>
      </ScrollView>
    </View>
  );
};

export default SinglePlayerRPEStats;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  noWellnessText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginTop: 10,
    textTransform: 'uppercase'
  }
});
