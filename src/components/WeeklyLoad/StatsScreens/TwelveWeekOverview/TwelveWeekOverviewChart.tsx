import React, { Dispatch, SetStateAction, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../../../../utils/mixins';

import AverageLine from './AverageLine';
import ChartItem from './ChartItem';
import { WeekOverviewData } from './helpers';
import TwelveWeekOverviewDashLine from './TwelveWeekOverviewDashLine';

const CHART_HEIGHT = 172;

type Props = {
  data: WeekOverviewData[];
  activeWeek: WeekOverviewData;
  setActiveWeek: Dispatch<SetStateAction<WeekOverviewData>>;
};

const TwelveWeekOverViewChart = ({
  data,
  activeWeek,
  setActiveWeek
}: Props) => {
  const [chartWidth, setChartWidth] = useState(0);
  const spacing = 16;
  const dashes = new Array(Math.ceil(chartWidth / spacing)).fill(null);
  const dashedLines = new Array(9).fill(null);

  const max = [
    ...data.map(({ totalLoad }) => totalLoad),
    ...data.map(
      ({ pastTwelveWeeksTotalAverage }) => pastTwelveWeeksTotalAverage
    )
  ].reduce((a, b) => Math.max(a, b), -Infinity);

  const renderItems = () => {
    const maxLoad = !max ? 1 : max;
    return data.map((item, index) => {
      if (!item.weekNumber) return <View />;
      return (
        <ChartItem
          key={index}
          data={item}
          chartHeigth={CHART_HEIGHT}
          maxLoad={maxLoad}
          activeWeek={activeWeek}
          setActiveWeek={setActiveWeek}
          chartWidth={chartWidth}
          nextWeek={data[item.weekIndex]}
        />
      );
    });
  };

  const renderXValues = () => {
    if (!max) return null;
    const items = new Array(9).fill(null).map((_, i) => {
      const value = Math.round((max / 10) * (9 - i));
      return (
        <Text key={value} style={styles.yLabel}>
          {value}
        </Text>
      );
    });

    return items;
  };

  return (
    <View>
      <View style={styles.chartContainer}>
        <View
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setChartWidth(width);
          }}
          style={styles.chart}
        >
          <View style={styles.chartLinesContainer}>
            <View style={styles.borderLines}></View>
            {dashedLines.map((_, i) => (
              <TwelveWeekOverviewDashLine
                key={i}
                index={i}
                dashes={dashes}
                spacing={spacing}
              />
            ))}
            <View style={styles.borderLines}></View>
          </View>
          {renderItems()}
          {!!max && (
            <AverageLine
              spacing={spacing}
              dashes={dashes}
              chartHeigth={CHART_HEIGHT}
              maxLoad={max}
              averageLoad={activeWeek.pastTwelveWeeksTotalAverage}
            />
          )}
        </View>
        <View style={{ justifyContent: 'space-between' }}>
          <Text style={[styles.yLabel, styles.yLabelText]}>LOAD</Text>
          {!!max && <Text style={styles.yLabel}>{max}</Text>}
          {renderXValues()}
          <Text style={styles.yLabel}>0</Text>
        </View>
      </View>
      <Text style={styles.xLabel}>Week</Text>
    </View>
  );
};

export default TwelveWeekOverViewChart;

const styles = StyleSheet.create({
  borderLines: {
    backgroundColor: variables.lightestGrey,
    height: 1,
    width: '100%'
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
    marginRight: 40,
    marginVertical: 9
  },
  chartContainer: {
    flexDirection: 'row'
  },
  chartLinesContainer: {
    height: '100%',
    justifyContent: 'space-between',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: -1
  },
  xLabel: {
    color: variables.grey2,
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginTop: 50,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  yLabel: {
    color: variables.chartLightGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 12
  },
  yLabelText: { position: 'absolute', right: 0, top: -20, width: 30 }
});
