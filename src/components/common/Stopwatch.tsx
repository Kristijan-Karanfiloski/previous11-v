import React, { useContext } from 'react';
import { Pressable, StyleSheet, Text, TextStyle } from 'react-native';

import { LiveTimerContext } from '../../hooks/liveTimerContext';
import { variables } from '../../utils/mixins';

interface StopwatchProps {
  customStyle?: TextStyle;
  onPress?: () => void;
}

const Stopwatch = ({ customStyle, onPress }: StopwatchProps) => {
  const { formattedTime } = useContext(LiveTimerContext);

  return (
    <Pressable
      pointerEvents={onPress ? 'auto' : 'none'}
      onPress={onPress || null}
    >
      <Text style={[styles.timer, customStyle]}>{formattedTime}</Text>
    </Pressable>
  );
};

export default Stopwatch;

const styles = StyleSheet.create({
  timer: {
    color: variables.realWhite,
    fontFamily: variables.mainFontMedium,
    fontSize: 40
  }
});
