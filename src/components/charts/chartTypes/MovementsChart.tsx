import React from 'react';
import { StyleSheet, View } from 'react-native';
import _ from 'lodash';
interface MovementsChartProps {
  data: { xValue: number; yValue: number; color: string }[];
  matchDuration: number;
}

const MovementsChart = ({ data, matchDuration }: MovementsChartProps) => {
  const maxYValue = _.max(data?.map((item) => item.yValue));
  const factor =
    (maxYValue || 1) / 5 < 1
      ? (maxYValue || 1) / 5
      : Math.round((maxYValue || 1) / 5);
  const verticalPercentage = 100 / ((maxYValue || 1) + factor);
  const horizontalPercentage = 100 / matchDuration;

  const generatePositions = (xValue: number, yValue: number, color: string) => {
    const styles = {
      height: `${verticalPercentage * yValue}%`,
      backgroundColor: color
    };
    Object.assign(styles, {
      left: xValue === 0 ? 0 : `${horizontalPercentage * xValue}%`
    });
    return styles;
  };

  return (
    <View style={styles.mainContainer}>
      {data?.map((bar, index) => {
        return (
          <View
            key={index}
            style={[
              styles.horizontalBar,
              generatePositions(bar.xValue, bar.yValue, bar.color)
            ]}
          />
        );
      })}
    </View>
  );
};

export default MovementsChart;

const styles = StyleSheet.create({
  horizontalBar: {
    bottom: 0,
    position: 'absolute',
    width: 8,
    zIndex: 10
  },
  mainContainer: {
    height: 250,
    width: '100%',
    zIndex: 1
  }
});
