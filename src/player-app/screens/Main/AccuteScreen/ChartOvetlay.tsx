import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../../../../utils/mixins';

const ChartOvetlay = () => {
  return (
    <View pointerEvents="none" style={styles.container}>
      <View style={styles.horizontalLine} />
      <View style={{ ...styles.horizontalLine, marginTop: 130 }} />
      <View style={styles.yAxesContainer}>
        <Text style={[styles.text, { top: -5 }]}>2.00</Text>
        <Text style={[styles.text, { top: 60 }]}>1.00</Text>
        <Text style={[styles.text, { top: 126 }]}>0</Text>
      </View>
    </View>
  );
};

export default ChartOvetlay;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'absolute',
    width: '100%'
  },
  horizontalLine: {
    backgroundColor: variables.backgroundColor,
    height: 1,
    transform: [{ translateY: -1 }],
    width: '100%'
  },
  text: {
    backgroundColor: variables.realWhite,
    fontSize: 10,
    paddingRight: 4,
    position: 'absolute',
    right: 0,
    textAlign: 'right'
  },
  yAxesContainer: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    height: '100%',
    left: 0,
    position: 'absolute',
    top: -1,
    width: 50
  }
});
