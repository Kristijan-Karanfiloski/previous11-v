import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GameAny } from '../../../../types';
import {
  getWeeklyFeedbackDescription,
  RPEFormatedData
} from '../../../helpers/chartHelpers';
import { variables } from '../../../utils/mixins';
import TwelveWeekOverviewDashLine from '../../WeeklyLoad/StatsScreens/TwelveWeekOverview/TwelveWeekOverviewDashLine';
import WeeklyFeedbackLine from '../common/WeeklyFeedbackLine';
interface Props {
  weekRpe: {
    rpeData: RPEFormatedData;
    event: GameAny;
  }[];
  playerId?: string | null;
  playerChartData?: number[];
}

const CHART_HEIGHT = 180;

const WeeklyFeedbackChart = ({
  weekRpe,
  playerId = null,
  playerChartData = []
}: Props) => {
  const [chartWidth, setChartWidth] = useState(0);
  const spacing = 16;
  const dashes = new Array(Math.ceil(chartWidth / spacing)).fill(null);
  const dashedLines = new Array(9).fill(null);

  const chartData = useMemo(() => {
    return weekRpe.map((item) => {
      let sumOfEventRpe = 0;
      item.rpeData.forEach((data) => {
        sumOfEventRpe += data.feedback;
      });
      if (sumOfEventRpe === 0) {
        return 0;
      }
      return sumOfEventRpe / item.rpeData.length;
    });
  }, [weekRpe]);

  const Xaxis = weekRpe.map((item) => {
    return getWeeklyFeedbackDescription(item.event);
  });

  const renderItems = () => {
    const maxLoad = 10;
    if (
      chartData.length === 0 ||
      chartData.filter((item) => item > 0).length === 0
    ) {
      return (
        <View style={styles.noDataContaiener}>
          <Text style={styles.noDataText}>
            None of you players have provided a feedback on their RPE yet.
          </Text>
        </View>
      );
    }
    return chartData.map((item, index) => {
      return (
        <WeeklyFeedbackLine
          key={index}
          data={item}
          chartHeigth={CHART_HEIGHT}
          maxLoad={maxLoad}
          chartWidth={chartWidth}
          nextData={chartData[index + 1]}
          index={index}
          Xaxis={Xaxis[index]}
          chartItems={chartData.length}
          playerId={playerId}
          playerData={playerChartData[index]}
          playerNextData={playerChartData[index + 1]}
        />
      );
    });
  };

  const renderXValues = () => {
    const items = new Array(9).fill(null).map((_, i) => {
      const value = Math.round((10 / 10) * (9 - i));
      return (
        <Text key={value} style={styles.yLabel}>
          {value}
        </Text>
      );
    });

    return items;
  };

  return (
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
      </View>
      <View style={styles.labelContainer}>
        {<Text style={styles.yLabel}>{10}</Text>}
        {renderXValues()}
        <Text style={styles.yLabel}>0</Text>
      </View>
    </View>
  );
};

export default WeeklyFeedbackChart;

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
    flexDirection: 'row',
    height: 220
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
  labelContainer: {
    height: 200,
    justifyContent: 'space-between',
    position: 'absolute',
    right: 10
  },
  noDataContaiener: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  noDataText: {
    color: variables.grey2,
    fontFamily: variables.mainFont,
    fontSize: 14
  },
  yLabel: {
    color: variables.chartLightGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 12
  }
});
