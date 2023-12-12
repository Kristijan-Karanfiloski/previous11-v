import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import useTimer from '../../../hooks/useTimer';
import { palette } from '../../../theme';
import { variables } from '../../../utils/mixins';

type Props = {
  timeLeft: number;
};

const EventCountdown = ({ timeLeft }: Props) => {
  const { time } = useTimer(timeLeft, () => undefined);

  const { days, hours, minutes, seconds } = time;

  return (
    <View style={[{ marginBottom: 21 }, styles.row]}>
      <Text style={styles.announceText}>Starting in</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {days && (
          <Text style={[styles.timer, styles.countdownText, styles.days]}>
            {days}
          </Text>
        )}
        <Text style={[styles.timer, styles.countdownText]}>{hours}</Text>
        <Text style={[styles.timer, styles.countdownText]}>:</Text>
        <Text style={[styles.timer, styles.countdownText]}>{minutes}</Text>
        {!days && (
          <>
            <Text style={[styles.timer, styles.countdownText]}>:</Text>
            <Text style={[styles.timer, styles.countdownText]}>{seconds}</Text>
          </>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly'
        }}
      >
        {days && <Text style={styles.timerText}>Days</Text>}
        <Text style={styles.timerText}>Hours</Text>
        <Text style={styles.timerText}>Min</Text>
        {!days && <Text style={styles.timerText}>Sec</Text>}
      </View>
    </View>
  );
};

export default EventCountdown;

const styles = StyleSheet.create({
  announceText: {
    color: palette.greyC4,
    fontFamily: variables.mainFontMedium,
    fontSize: 16,
    textAlign: 'center'
  },
  countdownText: {
    color: palette.greyC4,
    fontSize: 64,
    textAlign: 'center'
  },
  days: {
    marginRight: 40
  },
  row: {
    borderBottomColor: variables.lineGrey,
    borderBottomWidth: 1,
    paddingBottom: 16
  },
  timer: {
    color: variables.realWhite,
    fontFamily: variables.mainFontMedium,
    fontSize: 40
  },
  timerText: {
    color: palette.greyC4,
    fontFamily: variables.mainFont,
    fontSize: 14,
    lineHeight: 17.86
  }
});
