import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../../utils/mixins';

type Props = {
  playerLoad: number;
  average: number;
  highest: number;
  lowest: number;
  isTraining?: boolean;
  numberOfSameTypeEvents?: number;
};

const TotalLoadGraphTest = ({
  playerLoad,
  average,
  highest,
  lowest,
  isTraining,
  numberOfSameTypeEvents
}: Props) => {
  const getInnerLineWidth = () => {
    if (playerLoad === lowest) {
      return numberOfSameTypeEvents ? 0.01 : 1;
    }
    if (playerLoad <= average) {
      const width = (playerLoad - lowest) / (average - lowest) / 2;
      return width;
    } else {
      const width = 0.5 + (0.5 * (playerLoad - average)) / (highest - average);
      if (width > 1) return 1;
      return width;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.verticalLine}></View>
      <View style={styles.mainLine}>
        <Text style={styles.loadNumber}>
          {isTraining || !numberOfSameTypeEvents ? 0 : lowest}
        </Text>
        {!isTraining && !!numberOfSameTypeEvents && (
          <Text style={styles.loadText}>Lowest</Text>
        )}
        <View
          style={[styles.innerLine, { width: `${getInnerLineWidth() * 100}%` }]}
        ></View>
        {!isTraining && !!numberOfSameTypeEvents && (
          <View style={styles.averageLine}>
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
        )}

        <Text style={[styles.loadNumber, { right: 0, textAlign: 'right' }]}>
          {highest}
        </Text>
        <Text style={[styles.loadText, { right: 0 }]}>Highest</Text>
      </View>
      <View
        style={[
          styles.verticalLine,
          { backgroundColor: isTraining ? '#606060' : '#21F90F' }
        ]}
      ></View>
    </View>
  );
};

export default TotalLoadGraphTest;

const styles = StyleSheet.create({
  averageLine: {
    backgroundColor: '#606060',
    height: 46,
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -23 }, { translateX: -0.5 }],
    width: 1
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 23
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
