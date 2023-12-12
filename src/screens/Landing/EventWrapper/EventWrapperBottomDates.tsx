import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import { variables } from '../../../utils/mixins';

interface EventWrapperBottomDatesProps {
  isActive: boolean;
  date: string;
}

const EventWrapperBottomDates = ({
  isActive,
  date
}: EventWrapperBottomDatesProps) => {
  return (
    <View
      style={{
        backgroundColor: isActive ? variables.realWhite : variables.white,
        alignItems: 'center'
      }}
    >
      <Text style={[styles.dateText, isActive && styles.activeText]}>
        {moment(date, 'DD.MM.YY').format('DD')}
      </Text>
      <Text
        style={[styles.dateText, styles.dayText, isActive && styles.activeText]}
      >
        {moment(date, 'DD.MM.YY').format('ddd.')}
      </Text>
    </View>
  );
};

export default EventWrapperBottomDates;

const styles = StyleSheet.create({
  activeText: {
    color: variables.red
  },
  dateText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 18
  },
  dayText: {
    fontSize: 14
  }
});
