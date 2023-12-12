import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../utils/mixins';

import CountDown from './common/Countdown';
import { Icon } from './icon/icon';

type Props = {
  timeLeft: number;
  onFinish?: () => void;
  isMatch: boolean;
};

export default function UpcomingEventCountdown({
  timeLeft,
  onFinish = () => undefined,
  isMatch
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>
          Upcoming {isMatch ? 'Match' : 'Training'}
        </Text>
        <View style={styles.startContainer}>
          <Text style={styles.textSecondary}>Start</Text>
          <Icon icon="record_red" />
        </View>
      </View>
      <CountDown timeLeft={timeLeft} onFinish={onFinish} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(38, 39, 42, 0.5)',
    borderColor: variables.grey,
    borderRadius: 2,
    borderWidth: 1,
    height: 105,
    paddingHorizontal: 14,
    paddingTop: 12,
    width: 245
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  startContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  text: {
    color: variables.realWhite,
    fontFamily: variables.mainFontSemiBold,
    fontSize: 12
  },
  textSecondary: {
    color: variables.realWhite,
    fontFamily: variables.mainFontMedium,
    fontSize: 16,
    marginRight: 5
  }
});
