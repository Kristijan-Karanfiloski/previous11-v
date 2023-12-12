import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { GameAny } from '../../../../types';
import { RPECoachGnerateData } from '../../../helpers/chartHelpers';
import { selectAllPlayers } from '../../../redux/slices/playersSlice';
import { useAppSelector } from '../../../redux/store';
import { CHART_TITLES } from '../../../utils/mixins';
import ChartsContainer from '../../charts/ChartsContainer';
import WeeklyFeedbackChart from '../../charts/chartTypes/WeeklyFeedbackChart';
import WeeklyPlayerChart from '../../charts/chartTypes/WeeklyPlayerChart';

interface Props {
  weekEvents: GameAny[];
}

const WeeklyFeedbackStats = ({ weekEvents }: Props) => {
  const players = useAppSelector(selectAllPlayers);

  const weekPlayers = useMemo(() => {
    const weekPlayersList: string[] = [];
    weekEvents.forEach((event) => {
      const eventPlayers = event.report
        ? Object.keys(event?.report?.stats?.players || {})
        : event.preparation?.playersInPitch;
      eventPlayers?.forEach((it) => {
        if (!weekPlayersList.includes(it)) {
          weekPlayersList.push(it);
        }
      });
    });

    const finalData = weekPlayersList
      .map((player) => {
        const playerData = players.find((it) => it.id === player);
        if (!playerData) return null;
        return {
          id: player,
          playerName: playerData.name,
          tShirt: playerData.tShirtNumber
        };
      })
      .filter((item) => item !== null);

    return finalData;
  }, [weekEvents]);

  const weekRpe = useMemo(() => {
    return weekEvents
      .filter((event) => event.status && event.status.isFinal)
      .map((event) => {
        const rpeData = RPECoachGnerateData(event, players);
        return {
          rpeData,
          event
        };
      });
  }, [weekEvents, weekPlayers]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <ChartsContainer title={CHART_TITLES.aggregated_feedback}>
          <WeeklyFeedbackChart weekRpe={weekRpe} />
        </ChartsContainer>
        <WeeklyPlayerChart weekRpe={weekRpe} weekPlayers={weekPlayers} />
      </ScrollView>
    </View>
  );
};

export default WeeklyFeedbackStats;

const styles = StyleSheet.create({
  container: { flex: 1 }
});
