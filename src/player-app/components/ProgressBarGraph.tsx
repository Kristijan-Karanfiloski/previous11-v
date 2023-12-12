import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../../utils/mixins';

type Props = {
  title: string;
  time: string;
  color: string;
  percentage: number;
};

const ProgressBarGraph = ({ title, time, color, percentage }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.headers}>
        <Text style={styles.text}>{title}</Text>
        <Text style={styles.text}>{time}</Text>
      </View>
      <View>
        <View style={[styles.progressBar, { backgroundColor: color }]}></View>
        <View
          style={[
            styles.progressBarInner,
            { backgroundColor: color, width: `${percentage}%` }
          ]}
        ></View>
      </View>
    </View>
  );
};

export default ProgressBarGraph;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(227, 227, 227, 0.2)',
    height: 58,
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingTop: 7
  },
  headers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  progressBar: {
    height: 23,
    opacity: 0.3
  },
  progressBarInner: {
    height: 23,
    left: 0,
    position: 'absolute',
    top: 0,
    width: '0%'
  },
  text: {
    fontFamily: variables.mainFont,
    fontSize: 12,
    textTransform: 'uppercase'
  }
});
