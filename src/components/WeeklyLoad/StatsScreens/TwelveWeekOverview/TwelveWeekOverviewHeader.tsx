import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../../../../utils/mixins';

import { WeekOverviewData } from './helpers';

type Props = {
  data: WeekOverviewData;
};

const TwelveWeekOverviewHeader = ({ data }: Props) => {
  const { title, totalLoad, percentageOfAverage, percentageOfPrevWeek } = data;

  const getPercentage = (perOfAvg: number) =>
    isNaN(perOfAvg) || !isFinite(perOfAvg) ? '/' : `${perOfAvg}%`;

  return (
    <View style={styles.container}>
      <Text style={styles.activeWeekText}>{title}</Text>
      <View style={styles.wrapper}>
        <Text style={styles.labelText}>Weekly Load</Text>
        <Text style={styles.valueText}>{totalLoad}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.wrapper}>
        <Text style={styles.labelText}>vs Previous Week</Text>
        <Text style={styles.valueText}>
          {getPercentage(percentageOfPrevWeek)}
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.wrapper}>
        <Text style={styles.labelText}>vs 12 Week Average</Text>
        <Text style={styles.valueText}>
          {getPercentage(percentageOfAverage)}
        </Text>
      </View>
      <View style={styles.wrapperSecondary}>
        <View style={styles.rect} />
        <Text style={styles.text}>12 WEEK AVG.</Text>
      </View>
    </View>
  );
};

export default TwelveWeekOverviewHeader;

const styles = StyleSheet.create({
  activeWeekText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 12,
    textTransform: 'uppercase',
    width: 230
  },
  container: {
    flexDirection: 'row',
    marginBottom: 8
  },
  divider: {
    backgroundColor: variables.lightGrey,
    height: 24,
    marginHorizontal: 13,
    width: 1
  },
  labelText: {
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginBottom: 7
  },
  rect: {
    backgroundColor: variables.red,
    borderRadius: 2,
    height: 2,
    marginRight: 4,
    width: 10
  },
  text: {
    color: variables.grey2,
    fontFamily: variables.mainFontLight,
    fontSize: 10
  },
  valueText: {
    fontFamily: variables.mainFont,
    fontSize: 24
  },
  wrapper: {
    width: 120
  },
  wrapperSecondary: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginLeft: 'auto'
  }
});
