import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../../../utils/mixins';

type ChartHorizontalBarsProps = {
  barWidth: number;
  barText: string;
  barColor: string;
  isDontCompare: boolean;
  missingBarText: string;
  widthPercentage: number;
};

const ChartHorizontalBars = ({
  barWidth,
  barText,
  barColor,
  isDontCompare,
  widthPercentage
}: ChartHorizontalBarsProps) => {
  return (
    <View
      style={[
        styles.mainContainer,
        {
          width: widthPercentage > 100 ? '100%' : `${widthPercentage}%`,
          backgroundColor: barColor
        }
      ]}
    >
      {barWidth > 15 && (
        <>
          <Text style={styles.barText}>{barText}</Text>
          {barWidth < 100 && !isDontCompare && (
            <Text style={styles.barNumber}>{Math.round(barWidth)}%</Text>
          )}
        </>
      )}
    </View>
  );
};

export default ChartHorizontalBars;

const styles = StyleSheet.create({
  barNumber: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 12,
    letterSpacing: 1,
    marginRight: 4
  },
  barText: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 12,
    letterSpacing: 1,
    marginLeft: 8,
    marginRight: 10,
    textTransform: 'capitalize'
  },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 28,
    justifyContent: 'space-between',
    marginBottom: 5
  }
});
