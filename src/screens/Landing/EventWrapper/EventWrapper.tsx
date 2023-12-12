import React from 'react';
import { StyleSheet, View } from 'react-native';
import moment from 'moment';

import { variables } from '../../../utils/mixins';

import EventWrapperBottomDates from './EventWrapperBottomDates';
import EventWrapperChartDates from './EventWrapperChartDates';
import EventWrapperLines from './EventWrapperLines';

type Props = {
  date: string;
  children: React.ReactNode;
  gameIndicator?: number | string | undefined;
  isCircleDate?: boolean;
};

export default function EventWrapper({
  date,
  children,
  gameIndicator,
  isCircleDate = false
}: Props) {
  const isActive = moment().format('DD.MM.YY') === date;

  return (
    <View style={styles.eventWrapper}>
      {!isCircleDate && <EventWrapperLines />}
      {children}
      <View style={styles.container}>
        <View
          style={[styles.dateContent, isActive && styles.dateContentActive]}
        >
          {isCircleDate
            ? (
            <EventWrapperBottomDates isActive={isActive} date={date} />
              )
            : (
            <EventWrapperChartDates
              isActive={isActive}
              date={date}
              gameIndicator={gameIndicator}
            />
              )}
        </View>
      </View>
      <View style={[styles.line, styles.lineLeft]}></View>
      <View style={[styles.line, styles.lineRight]}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20
  },
  dateContent: {
    alignItems: 'center',
    borderRadius: 50,
    height: 56,
    justifyContent: 'center',
    width: 56
  },
  dateContentActive: {
    backgroundColor: variables.realWhite
  },
  eventWrapper: {
    marginBottom: 20,
    paddingHorizontal: 4
  },
  line: {
    backgroundColor: variables.lightGrey,
    bottom: 27,
    height: 1,
    position: 'absolute',
    width: 60
  },
  lineLeft: {
    left: 0
  },
  lineRight: {
    right: 0
  }
});
