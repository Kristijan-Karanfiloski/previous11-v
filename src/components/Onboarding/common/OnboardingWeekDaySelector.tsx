import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { WeekDaySelectedType, WeekDayType } from '../../../types';
import { variables } from '../../../utils/mixins';
import CheckBox from '../../common/CheckBox';
import DateTimePIcker from '../../common/DateTimePicker';

type OnboardingWeekDaySelectorProps = {
  time: WeekDayType;
  handleDate: (date: Date, day: string) => void;
  selectedDays: any;
  handleSelectedDay: (day: string) => void;
};

const OnboardingWeekDaySelector = ({
  time,
  handleDate,
  selectedDays,
  handleSelectedDay
}: OnboardingWeekDaySelectorProps) => {
  return (
    <View style={styles.weekDaysContainer}>
      <Text style={[styles.weekDaysFont, styles.weekDaysHeading]}>
        Create Recurring Trainings
      </Text>
      <View style={styles.borderContainer} />
      <Text style={[styles.weekDaysFont, styles.weekDaysSubHeading]}>
        Pick the weekdays
      </Text>
      <Text style={[styles.weekDaysFont, styles.weekDaysText]}>
        By choosing a start timeslot your recurring training sessions will be
        set up.
      </Text>
      {variables.weekdays.map((day) => {
        return (
          <View key={day} style={styles.weekDayContainer}>
            <View style={styles.dayAndDatePickerContainer}>
              <CheckBox
                label={day}
                value={selectedDays[day as keyof WeekDaySelectedType]}
                onChange={() => handleSelectedDay(day)}
              />
              <DateTimePIcker
                value={time[day as keyof WeekDayType]}
                mode="time"
                onConfirm={(date) => handleDate(date, day)}
              />
            </View>
            <View style={styles.borderContainer} />
          </View>
        );
      })}
    </View>
  );
};

export default OnboardingWeekDaySelector;

const styles = StyleSheet.create({
  borderContainer: {
    borderColor: variables.lineGrey,
    borderWidth: 0.6,
    marginBottom: 18,
    marginTop: 12,
    width: '100%'
  },
  dayAndDatePickerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  weekDayContainer: {
    width: '100%'
  },
  weekDaysContainer: {
    alignItems: 'center',
    backgroundColor: variables.realWhite,
    height: '70%',
    padding: 30,
    position: 'absolute',
    top: '5%',
    width: '70%'
  },
  weekDaysFont: {
    color: variables.textBlack,
    fontFamily: variables.mainFont
  },
  weekDaysHeading: {
    fontSize: 24
  },
  weekDaysSubHeading: {
    fontSize: 16,
    textAlign: 'left',
    width: '100%'
  },
  weekDaysText: {
    color: variables.lightGrey,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'left',
    width: '100%'
  }
});
