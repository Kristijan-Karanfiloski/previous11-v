import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Line, Svg } from 'react-native-svg';

import { variables } from '../../../utils/mixins';

const DOT_WITH_HEIGHT = 12;

interface Props {
  data: number;
  chartHeigth: number;
  maxLoad: number;
  chartWidth: number;
  nextData: number;
  index: number;
  Xaxis: string;
  chartItems: number;
  playerId: string | null;
  playerData: number;
  playerNextData: number;
}

const WeeklyFeedbackLine = ({
  data,
  chartHeigth,
  chartWidth,
  maxLoad,
  nextData,
  index,
  Xaxis,
  chartItems,
  playerId,
  playerData,
  playerNextData
}: Props) => {
  const dotHeight = DOT_WITH_HEIGHT / 2;
  const bottom = (chartHeigth - dotHeight) * (data / maxLoad);
  const playerBottom = (chartHeigth - dotHeight) * (playerData / maxLoad);
  const getLineCoords = () => {
    return {
      x1: '0',
      y1: `${Math.round(chartHeigth - dotHeight / 2 - bottom)}`,
      x2: `${Math.ceil(chartWidth / (chartItems - 1))}`,
      y2:
        nextData !== undefined
          ? `${Math.round(
              chartHeigth -
                dotHeight / 2 -
                (chartHeigth - dotHeight) * (nextData / maxLoad)
            )}`
          : `${chartHeigth - dotHeight / 2}`
    };
  };

  const getPlayerLineCoords = () => {
    return {
      px1: '0',
      py1: `${Math.round(chartHeigth - dotHeight / 2 - playerBottom)}`,
      px2: `${Math.ceil(chartWidth / (chartItems - 1))}`,
      py2:
        nextData !== undefined
          ? `${Math.round(
              chartHeigth -
                dotHeight / 2 -
                (chartHeigth - dotHeight) * (playerNextData / maxLoad)
            )}`
          : `${chartHeigth - dotHeight / 2}`
    };
  };

  const { x1, x2, y1, y2 } = getLineCoords();

  const { px1, px2, py1, py2 } = getPlayerLineCoords();

  return (
    <View style={styles.container}>
      <View
        style={[
          playerId ? styles.greyDot : styles.dot,
          { bottom: bottom - dotHeight / (playerId ? 4 : 2) }
        ]}
      >
        <View
          style={[
            playerId ? {} : styles.dotInner,
            { backgroundColor: variables.realWhite }
          ]}
        />
      </View>

      {playerId
        ? (
        <View
          style={{
            ...styles.dot,
            bottom: playerBottom - dotHeight / 2
          }}
        >
          <View
            style={{
              ...styles.dotInner,
              backgroundColor: variables.realWhite
            }}
          />
        </View>
          )
        : null}

      <View style={styles.labelContainer}>
        <View style={styles.labelLine} />
        <Text
          style={{
            ...styles.label,
            fontFamily: variables.mainFont
          }}
        >
          {Xaxis}
        </Text>
      </View>
      {nextData !== undefined && (
        <Svg
          height={chartHeigth}
          width={chartWidth}
          style={{ position: 'absolute', left: 0 }}
          key={index}
        >
          <Line
            stroke={playerId ? variables.lightGrey : variables.textBlack}
            strokeWidth={2.5}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
          />
          {playerId
            ? (
            <Line
              stroke={variables.textBlack}
              strokeWidth={2.5}
              x1={px1}
              y1={py1}
              x2={px2}
              y2={py2}
            />
              )
            : null}
        </Svg>
      )}
    </View>
  );
};

export default WeeklyFeedbackLine;

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
  greyDot: {
    backgroundColor: variables.lightGrey,
    borderRadius: 50,
    height: 7,
    left: -2,
    position: 'absolute',
    width: 7,
    zIndex: 1
  },
  label: {
    color: variables.grey,
    fontFamily: variables.mainFont,
    height: 18,
    textAlign: 'center',
    transform: [{ translateX: -15 }]
  },
  labelContainer: {
    bottom: 0,
    position: 'absolute',
    transform: [{ translateY: 36 }],
    width: 42
  },
  labelLine: {
    backgroundColor: variables.lightestGrey,
    height: 12,
    marginBottom: 6,
    width: 1
  }
});
