import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../../utils/mixins';

type Props = {
  playerLoad: number;
  average: number;
  highest: number;
  lowest: number;
};

const TotalLoadGraphV2 = ({ playerLoad, average, highest, lowest }: Props) => {
  //   const playerLoad = 40;

  //   const lowest = 50;
  //   const highest = 300;
  //   const avarage = 100;

  const getInnerLineWidth = () => {
    const width = (playerLoad - lowest) / (highest - lowest);
    if (width > 1) return 1;
    if (width < 0) return 0.01;
    return width;
  };

  return (
    <View style={styles.container}>
      <View style={styles.verticalLine}></View>
      <View style={styles.mainLine}>
        <Text style={styles.loadNumber}>{lowest}</Text>
        <Text style={styles.loadText}>Lowest</Text>
        <View
          style={[styles.innerLine, { width: `${getInnerLineWidth() * 100}%` }]}
        ></View>
        <View
          style={[
            styles.averageLine,
            { left: `${((average - lowest) / (highest - lowest)) * 100}%` }
          ]}
        >
          <Text
            style={[
              styles.loadNumber,
              {
                left: '50%',
                width: 50,
                textAlign: 'center',
                top: -21,
                transform: [{ translateX: -25 }]
              }
            ]}
          >
            {average}
          </Text>
          <Text
            style={[
              styles.loadText,
              {
                left: '50%',
                width: 50,
                transform: [{ translateX: -25 }],
                textAlign: 'center',
                bottom: -21
              }
            ]}
          >
            Average
          </Text>
        </View>

        <Text style={[styles.loadNumber, { right: 0, textAlign: 'right' }]}>
          {highest}
        </Text>
        <Text style={[styles.loadText, { right: 0 }]}>Highest</Text>
      </View>
      <View
        style={[styles.verticalLine, { backgroundColor: '#21F90F' }]}
      ></View>
    </View>
  );
};

export default TotalLoadGraphV2;

const styles = StyleSheet.create({
  averageLine: {
    backgroundColor: '#606060',
    height: 46,
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -23 }],
    width: 1
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 200
  },
  innerLine: {
    backgroundColor: variables.black,
    height: '100%',
    width: '20%'
  },
  loadNumber: {
    fontFamily: variables.mainFontBold,
    fontSize: 10,
    position: 'absolute',
    top: -30,
    width: 50
  },
  loadText: {
    bottom: -30,
    fontFamily: variables.mainFontLight,
    fontSize: 10,
    position: 'absolute',
    textTransform: 'uppercase'
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
