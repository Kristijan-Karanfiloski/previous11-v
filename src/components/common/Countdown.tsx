import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';

import useTimer from '../../hooks/useTimer';
import { variables } from '../../utils/mixins';

interface CountDownProps {
  timeLeft: number;
  onFinish?: () => void;
  customStyle?: TextStyle;
}

const CountDown = (props: CountDownProps) => {
  const { timeLeft, customStyle, onFinish = () => undefined } = props;
  const { formattedTime } = useTimer(timeLeft, onFinish);

  return (
    <View>
      <Text style={[styles.timer, customStyle]}>{formattedTime}</Text>
    </View>
  );
};

export default CountDown;

const styles = StyleSheet.create({
  timer: {
    color: variables.realWhite,
    fontFamily: variables.mainFontMedium,
    fontSize: 40
  }
});
