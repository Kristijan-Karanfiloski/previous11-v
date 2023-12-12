import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { selectAllGames } from '../../../redux/slices/gamesSlice';
import { useAppSelector } from '../../../redux/store';
import { variables } from '../../../utils/mixins';
import CalendarBody from '../../Calendar/CalendarBody';
import RecurringEditDaySelect from '../Modals/RecurringEditDaySelect';
import RecurringWeekDaySelect from '../Modals/RecurringWeekDaySelect';

export enum RecurringModalTypes {
  weekdaySelect = 'weekdaySelect',
  editDaySelect = 'editDaySelect'
}

const OnboardingEvents = () => {
  const navigation = useNavigation();

  const allGames = useAppSelector(selectAllGames);

  const [modalType, setModalType] = useState(
    allGames.length === 0
      ? {
          weekdaySelect: true,
          editDaySelect: false
        }
      : {
          weekdaySelect: false,
          editDaySelect: true
        }
  );

  const handleModal = (type: string) => {
    switch (type) {
      case RecurringModalTypes.weekdaySelect:
        return setModalType({
          ...modalType,
          weekdaySelect: false,
          editDaySelect: true
        });
      case RecurringModalTypes.editDaySelect:
        return navigation.navigate('FinishedRecurringScreen');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.calendarContainer}>
        <CalendarBody hideHeader calendarDate={moment()} isOnboarding />
      </View>
      <RecurringWeekDaySelect
        modalType={modalType.weekdaySelect}
        handleModal={handleModal}
      />
      <RecurringEditDaySelect handleModal={handleModal} />
    </View>
  );
};

export default OnboardingEvents;

const styles = StyleSheet.create({
  calendarContainer: {
    height: '100%',
    marginTop: 20
  },
  mainContainer: {
    backgroundColor: variables.realWhite,
    height: '100%'
  }
});
