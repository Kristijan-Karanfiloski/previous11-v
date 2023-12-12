import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { GameAny, GameType } from '../../../types';
import { CHART_TITLES, EXPLANATION_TYPES } from '../../utils/mixins';
import ChartsContainer from '../charts/ChartsContainer';
import RPEChart from '../charts/chartTypes/RPEChart';

interface RpeStatsProps {
  event: GameAny | undefined;
}

const RpeStats = ({ event }: RpeStatsProps) => {
  if (!event) return null;

  return (
    <View style={styles.container}>
      <ScrollView>
        <ChartsContainer
          title={
            event.type === GameType.Match
              ? CHART_TITLES.match_feedback
              : CHART_TITLES.training_feedback
          }
          modalType={EXPLANATION_TYPES.rpe}
        >
          <RPEChart event={event} />
        </ChartsContainer>
      </ScrollView>
    </View>
  );
};

export default RpeStats;

const styles = StyleSheet.create({
  container: { flex: 1 }
});
