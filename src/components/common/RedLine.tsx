import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { color } from '../../theme/color';

export interface RedLineProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle;

  top?: boolean;
}

/**
 * Describe your component here
 */
export function RedLine(props: RedLineProps) {
  const { style, top = true } = props;
  const containerStyle = [
    top ? [styles.container, styles.floatTop] : styles.container,
    style
  ];

  return <View style={containerStyle} />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.palette.orange,
    height: 4,
    justifyContent: 'center',
    width: '100%'
  },
  floatTop: {
    left: 0,
    position: 'absolute',
    top: 0
  }
});
