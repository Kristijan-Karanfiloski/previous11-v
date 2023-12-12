import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import OptimalBoxImage from '../../assets/images/optimal_range_box.png';
import { variables } from '../../utils/mixins';

type Props = {
  playerLoad: number;
  average: number;
};

const OptimalRangeGraph = ({ playerLoad, average }: Props) => {
  const [boxWidth, setBoxWidth] = useState(0);

  const innerLineWidth =
    playerLoad / (average * 2) > 1 ? 1 : playerLoad / (average * 2);

  return (
    <View style={styles.container}>
      <View style={styles.verticalLine}></View>
      <View style={styles.mainLine}>
        <View
          style={StyleSheet.flatten([
            styles.innerLine,
            { width: `${innerLineWidth * 100}%` }
          ])}
        ></View>
        <View style={styles.averageLine}></View>
        <View
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setBoxWidth(width);
          }}
          style={StyleSheet.flatten([
            styles.averageBox,
            { transform: [{ translateX: -(boxWidth / 2) }] }
          ])}
        >
          <ImageBackground style={{ flex: 1 }} source={OptimalBoxImage} />
          <Text style={styles.loadNumber}>{average}</Text>
          <Text style={styles.loadText}>Average</Text>
        </View>
      </View>
      <View style={styles.verticalLine}></View>
    </View>
  );
};

export default OptimalRangeGraph;

const styles = StyleSheet.create({
  averageBox: {
    height: 46,
    left: '50%',
    position: 'absolute',
    top: -9,
    width: '25%'
  },
  averageLine: {
    backgroundColor: '#21F90F',
    height: 46,
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -23 }],
    width: 2
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 100
  },
  innerLine: {
    backgroundColor: variables.black,
    height: '100%',
    width: '20%'
  },
  loadNumber: {
    fontFamily: variables.mainFontBold,
    fontSize: 10,
    left: '50%',
    position: 'absolute',
    textAlign: 'center',
    top: -21,
    transform: [{ translateX: -25 }],
    width: 50
  },
  loadText: {
    bottom: -21,
    fontFamily: variables.mainFontLight,
    fontSize: 10,
    left: '50%',
    position: 'absolute',
    textAlign: 'center',
    textTransform: 'uppercase',
    transform: [{ translateX: -25 }],
    width: 50
  },
  mainLine: {
    backgroundColor: variables.white,
    flex: 1,
    height: 28
  },
  verticalLine: {
    backgroundColor: '#606060',
    height: 46,
    width: 1
  }
});
