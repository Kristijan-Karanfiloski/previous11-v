import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TimeOnIce } from '../../../../types';
import { utils, variables } from '../../../utils/mixins';
import ChartHorizontalBar from '../common/ChartHorizontalBar';

interface Props {
  data: TimeOnIce;
  bestMatchData: TimeOnIce | null;
  isDontCompare: boolean;
}

const TotalTimeOnIce = ({ isDontCompare, data, bestMatchData }: Props) => {
  const percentageValue = (data.total / (bestMatchData?.total || 1)) * 100;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.valueContainer}>
        <Text style={styles.percentageValue}>
          {isDontCompare
            ? data.total === 0
              ? '00'
              : utils.convertMilisecondsToTime(data.total * 1000)
            : `${Math.round(percentageValue)}%`}
        </Text>
      </View>
      <View style={styles.barContainer}>
        <View style={styles.barInnerContainer}>
          <ChartHorizontalBar
            barWidth={percentageValue}
            totalLoad={data.total}
            benchmarkLoad={bestMatchData?.total || 0}
            isDontCompare={isDontCompare}
            isHockey
          />
        </View>
      </View>
    </View>
  );
};

export default TotalTimeOnIce;

const styles = StyleSheet.create({
  barContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  barInnerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%'
  },
  mainContainer: {
    height: 120,
    zIndex: 10
  },
  percentageValue: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 60,
    letterSpacing: 2,
    lineHeight: 70,
    marginLeft: 8
  },
  valueContainer: {
    height: 60,
    marginBottom: 8,
    marginTop: 8
  }
});
