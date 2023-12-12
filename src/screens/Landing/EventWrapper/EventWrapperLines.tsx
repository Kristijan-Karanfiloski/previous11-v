import React from 'react';
import { StyleSheet } from 'react-native';
import { Line, Svg } from 'react-native-svg';

const EventWrapperLines = () => {
  return (
    <>
      {[50, 100].map((item, index) => {
        return (
          <Svg
            height={'88%'}
            width={'100%'}
            style={[
              styles.gridLines,
              { left: index > 0 ? `${item + 10}%` : `${item}%` }
            ]}
            key={index}
          >
            <Line
              stroke={'#DADADA'}
              strokeWidth={2}
              strokeDasharray="3 5"
              x1="0"
              y1="0"
              x2="0"
              y2={'100%'}
            />
          </Svg>
        );
      })}
      {[0, 1, 2, 3, 4].map((item, index) => {
        return (
          <Svg
            height={'100%'}
            width={'130%'}
            style={[styles.barLoad, { top: 350 - item * 87.5 }]}
            key={index}
          >
            <Line
              stroke={'#DADADA'}
              strokeWidth={1}
              x1={'100%'}
              y1="0"
              x2="0"
              y2="0"
            />
          </Svg>
        );
      })}
    </>
  );
};

export default EventWrapperLines;

const styles = StyleSheet.create({
  barLoad: {
    left: 0,
    position: 'absolute'
  },
  gridLines: {
    position: 'absolute',
    top: 0
  }
});
