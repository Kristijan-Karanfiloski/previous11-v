import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { utils, variables } from '../../../utils/mixins';

type ChartHorizontalBarProps = {
  barWidth: number;
  totalLoad: number;
  benchmarkLoad: number;
  isDontCompare: boolean;
  isHockey?: boolean;
  isLoadPerMinute?: boolean;
};

const ChartHorizontalBar: React.FC<ChartHorizontalBarProps> = ({
  barWidth,
  totalLoad,
  benchmarkLoad,
  isDontCompare,
  isHockey = false,
  isLoadPerMinute = false
}) => {
  const getBarWidthStyle = (): string => {
    if (isDontCompare) return '0%';
    if (barWidth > 100) return '100%';
    if (benchmarkLoad < 1) {
      return '0%';
    }
    return `${barWidth}%`;
  };

  const getBarTextStyle = (): object => {
    const baseStyle = { color: variables.textBlack };
    if (barWidth < 20) {
      return barWidth < 1
        ? { ...baseStyle, left: 10 }
        : { ...baseStyle, left: '110%' };
    }
    if (benchmarkLoad < 1) {
      return { ...baseStyle, left: 10 };
    }
    return { color: variables.realWhite, right: '1%' };
  };

  const formatLoadText = (): string => {
    if (isHockey) {
      if (benchmarkLoad < 1) {
        return `${utils.convertMilisecondsToTime(totalLoad * 1000)} / -`;
      }
      return `${utils.convertMilisecondsToTime(
        totalLoad * 1000
      )} / ${utils.convertMilisecondsToTime(benchmarkLoad * 1000)}`;
    }
    if (isLoadPerMinute) {
      if (benchmarkLoad < 1) {
        return `${totalLoad.toFixed(2)} / -`;
      }
      return `${totalLoad.toFixed(2)} / ${benchmarkLoad.toFixed(2)}`;
    }
    if (benchmarkLoad < 1) {
      return `${totalLoad} / -`;
    }
    return `${totalLoad} / ${benchmarkLoad}`;
  };

  return (
    <View style={[styles.mainContainer, { width: getBarWidthStyle() }]}>
      {!isDontCompare && (
        <Text style={[styles.barText, getBarTextStyle()]}>
          {formatLoadText()}
        </Text>
      )}
    </View>
  );
};

export default ChartHorizontalBar;

const styles = StyleSheet.create({
  barText: {
    fontFamily: variables.mainFontMedium,
    fontSize: 16,
    letterSpacing: 1,
    position: 'absolute',
    top: '30%'
  },
  mainContainer: {
    alignItems: 'center',
    backgroundColor: variables.textBlack,
    flexDirection: 'row',
    height: 45,
    justifyContent: 'flex-end'
  }
});
