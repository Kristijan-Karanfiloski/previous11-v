import React, { Dispatch, SetStateAction } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Line, Svg } from 'react-native-svg';

import { variables } from '../../../../utils/mixins';

import { WeekOverviewData } from './helpers';

const DOT_WITH_HEIGHT = 12;

type Props = {
  data: WeekOverviewData;
  chartHeigth: number;
  maxLoad: number;
  activeWeek: WeekOverviewData;
  setActiveWeek: Dispatch<SetStateAction<WeekOverviewData>>;
  chartWidth: number;
  nextWeek: WeekOverviewData | undefined;
};

const ChartItem = ({
  data,
  chartHeigth,
  maxLoad,
  activeWeek,
  setActiveWeek,
  chartWidth,
  nextWeek
}: Props) => {
  const { totalLoad, weekIndex, weekNumber } = data;
  const nextWeekTotalLoad = nextWeek?.weekNumber
    ? nextWeek?.totalLoad
    : undefined;

  const bottom = (chartHeigth - DOT_WITH_HEIGHT) * (totalLoad / maxLoad);
  const isActive = activeWeek.weekIndex === weekIndex;

  const getLineCoords = () => {
    return {
      x1: '0',
      y1: `${Math.round(chartHeigth - DOT_WITH_HEIGHT / 2 - bottom)}`,
      x2: `${Math.ceil(chartWidth / 11)}`,
      y2: nextWeekTotalLoad
        ? `${Math.round(
            chartHeigth -
              DOT_WITH_HEIGHT / 2 -
              (chartHeigth - DOT_WITH_HEIGHT) * (nextWeekTotalLoad / maxLoad)
          )}`
        : `${chartHeigth - DOT_WITH_HEIGHT / 2}`
    };
  };

  const { x1, x2, y1, y2 } = getLineCoords();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setActiveWeek(data)}
        style={{
          ...styles.dot,
          bottom
        }}
      >
        <View
          style={{
            ...styles.dotInner,
            backgroundColor: isActive
              ? variables.textBlack
              : variables.realWhite
          }}
        />
        {isActive && <View style={styles.dotOuter} />}
      </Pressable>
      <View style={styles.labelContainer}>
        <View style={styles.labelLine} />
        <Text
          style={{
            ...styles.label,
            fontFamily: isActive ? variables.mainFontBold : variables.mainFont
          }}
        >
          {weekNumber}
        </Text>
      </View>
      {nextWeekTotalLoad !== undefined && (
        <Svg
          height={200}
          width={200}
          style={{ position: 'absolute', left: 0 }}
          key={weekIndex}
        >
          <Line
            stroke={variables.textBlack}
            strokeWidth={2.5}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
          />
        </Svg>
      )}
    </View>
  );
};

export default ChartItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: variables.lightestGrey,
    height: '100%',
    width: 1
  },
  dot: {
    backgroundColor: variables.textBlack,
    borderRadius: 50,
    height: DOT_WITH_HEIGHT,
    left: -5,
    position: 'absolute',
    width: DOT_WITH_HEIGHT,
    zIndex: 1
  },
  dotInner: {
    backgroundColor: variables.realWhite,
    borderRadius: 50,
    height: 8,
    left: 2,
    position: 'absolute',
    top: 2,
    width: 8
  },
  dotOuter: {
    backgroundColor: 'rgba(23, 24, 26, 0.2)',
    borderRadius: 50,
    height: 24,
    left: -6,
    position: 'absolute',
    top: -6,
    width: 24
  },
  label: {
    color: variables.grey,
    fontFamily: variables.mainFont,
    height: 18,
    transform: [{ translateX: -7 }]
  },
  labelContainer: {
    bottom: 0,
    position: 'absolute',
    transform: [{ translateY: 36 }],
    width: 22
  },
  labelLine: {
    backgroundColor: variables.lightestGrey,
    height: 12,
    marginBottom: 6,
    width: 1
  }
});
