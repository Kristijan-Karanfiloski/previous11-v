import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { G, Rect, Svg } from 'react-native-svg';

import { variables } from '../../../../utils/mixins';

type Props = {
  dashes: null[];
  spacing: number;
  chartHeigth: number;
  maxLoad: number;
  averageLoad: number;
};

const AverageLine = ({
  dashes,
  spacing,
  chartHeigth,
  maxLoad,
  averageLoad
}: Props) => {
  const percentage = averageLoad / maxLoad;
  const bottom = chartHeigth * (percentage <= 1 ? percentage : 1);

  return (
    <View style={{ ...styles.container, bottom }}>
      <Svg height="2" width="100%">
        <G>
          {dashes.map((_, index) => (
            <Rect
              key={index}
              x="0"
              y="0"
              width="10"
              height="2"
              fill={variables.red}
              translateX={spacing * index}
            />
          ))}
        </G>
      </Svg>
      <Text style={styles.text}>{averageLoad}</Text>
    </View>
  );
};

export default AverageLine;

const styles = StyleSheet.create({
  container: {
    left: 0,
    position: 'absolute',
    width: '100%',
    zIndex: -1
  },
  text: {
    color: variables.red,
    fontFamily: variables.mainFontMedium,
    fontSize: 12,
    position: 'absolute',
    right: -36,
    top: -6,
    width: 32
  }
});
