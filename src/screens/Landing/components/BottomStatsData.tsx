import React from 'react';
import { StyleSheet, View } from 'react-native';

import { variables } from '../../../utils/mixins';

import LatestTrainingInfo from './LatestTrainingInfo';
import MatchesData from './MatchesData';
import UpcomingActivity from './UpcomingActivity';

const BottomStatsData = () => {
  return (
    <View style={styles.mainContainer}>
      <MatchesData />
      <View style={styles.subContainer}>
        <View style={styles.rightInfoContainer}>
          <LatestTrainingInfo />
        </View>
        <View style={styles.rightInfoContainer}>
          <UpcomingActivity />
        </View>
      </View>
    </View>
  );
};

export default BottomStatsData;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    paddingBottom: 14
  },
  rightInfoContainer: {
    backgroundColor: variables.realWhite,
    borderRadius: 20,
    height: 183,
    marginLeft: 7,
    marginRight: 14,
    marginVertical: 7,
    width: '100%'
  },
  subContainer: {
    width: '64.4%'
  }
});
