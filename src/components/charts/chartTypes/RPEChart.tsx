import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GameAny } from '../../../../types';
import {
  RPECoachGnerateData,
  RPEPlayerData
} from '../../../helpers/chartHelpers';
import { selectAllPlayers } from '../../../redux/slices/playersSlice';
import { useAppSelector } from '../../../redux/store';
import { variables } from '../../../utils/mixins';
import RPECircles from '../common/RPECircles';

interface Props {
  event: GameAny;
}

const RPEChart = ({ event }: Props) => {
  const players = useAppSelector(selectAllPlayers);

  const rpeData = useMemo(
    () => RPECoachGnerateData(event, players),
    [event, players]
  );

  return (
    <View style={styles.mainContainer}>
      {rpeData
        .sort((a: RPEPlayerData, b: RPEPlayerData) => {
          return b.feedback - a.feedback;
        })
        .map((data, index) => {
          return (
            <View
              key={index}
              style={[
                styles.container,
                data.feedback === 0 ? { opacity: 0.4 } : {}
              ]}
            >
              <Text style={styles.playerName}>
                {data.tag} {data.playerName}
              </Text>
              <View style={styles.circleContainer}>
                <RPECircles playerFeedback={data.feedback} />
              </View>
            </View>
          );
        })}
    </View>
  );
};

export default RPEChart;

const styles = StyleSheet.create({
  circleContainer: {
    flexDirection: 'row'
  },
  container: {
    alignItems: 'center',
    borderBottomColor: variables.backgroundColor,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between'
  },
  mainContainer: {
    borderColor: variables.backgroundColor,
    borderWidth: 1
  },
  playerName: {
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginLeft: 12
  }
});
