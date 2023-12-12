import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../../../utils/mixins';

type ChartTitleLegendProps = {
  titleLegend: {
    legendTitle: string;
    legends: { color: string; text: string }[];
  };
};

const renderLegends = (legends: { color: string; text: string }[]) => {
  return legends.map((legend, index) => {
    return (
      <View key={index} style={styles.legendContainer}>
        <View
          style={[styles.legendIndicator, { backgroundColor: legend.color }]}
        />
        <View>
          <Text style={styles.legendText}>{legend.text}</Text>
        </View>
      </View>
    );
  });
};

const ChartTitleLegend = ({ titleLegend }: ChartTitleLegendProps) => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.titleText}>{titleLegend.legendTitle || ''}</Text>
      {renderLegends(titleLegend.legends)}
    </View>
  );
};

export default ChartTitleLegend;

const styles = StyleSheet.create({
  legendContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 15
  },
  legendIndicator: {
    height: 4,
    marginRight: 6,
    width: 12
  },
  legendText: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 12
  },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  titleText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 12,
    marginRight: 15,
    textTransform: 'uppercase'
  }
});
