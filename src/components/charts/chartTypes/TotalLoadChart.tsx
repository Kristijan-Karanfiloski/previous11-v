import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../../../utils/mixins';
import ChartHorizontalBar from '../common/ChartHorizontalBar';

type TotalLoadChartProps = {
  data: {
    percentageValue: number;
    totalLoad: number;
    benchmarkLoad: number;
  };
  isDontCompare?: boolean;
  isLoadPerMinute?: boolean;
};

const TotalLoadChart = ({
  data,
  isDontCompare = false,
  isLoadPerMinute = false
}: TotalLoadChartProps) => {
  const { percentageValue, totalLoad, benchmarkLoad } = data;

  const generateValue = () => {
    if (isDontCompare) {
      if (totalLoad === 0) return '00';
      if (isLoadPerMinute) return totalLoad.toFixed(2);
      return Math.round(totalLoad);
    }
    if (benchmarkLoad < 1) {
      return '-%';
    }
    return `${Math.round(percentageValue)}%`;
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.valueContainer}>
        <Text style={styles.percentageValue}>{generateValue()}</Text>
      </View>
      <View style={styles.barContainer}>
        <View style={styles.barInnerContainer}>
          <ChartHorizontalBar
            barWidth={percentageValue}
            totalLoad={totalLoad}
            benchmarkLoad={benchmarkLoad}
            isDontCompare={isDontCompare}
            isLoadPerMinute={isLoadPerMinute}
          />
        </View>
      </View>
    </View>
  );
};

export default TotalLoadChart;

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
