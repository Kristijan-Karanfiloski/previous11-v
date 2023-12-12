import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { toNumber } from 'lodash';
import moment from 'moment';

import { GameAny, GameType } from '../../../../types';
import {
  createBatchTrainingGamesAction,
  selectAllGames
} from '../../../redux/slices/gamesSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { WeekDaySelectedType, WeekDayType } from '../../../types';
import { formatDateTime } from '../../../utils';
import { ONBOARDING_NAVIGATOR_TEXTS, utils } from '../../../utils/mixins';
import OverlayLoader from '../../common/OverlayLoader';
import OnboardingNavigator from '../common/OnboardingNavigator';
import OnboardingWeekDaySelector from '../common/OnboardingWeekDaySelector';

type RecurringWeekDaySelectProps = {
  handleModal: (type: string) => void;
  modalType: boolean;
};
type NewGame = Partial<GameAny>;

const RecurringWeekDaySelect = ({
  handleModal,
  modalType
}: RecurringWeekDaySelectProps) => {
  const dispatch = useAppDispatch();
  const allGames = useAppSelector(selectAllGames);
  const [isLoading, setIsLoading] = useState(false);

  const [time, setTime] = useState<WeekDayType>({
    Monday: new Date(),
    Tuesday: new Date(),
    Wednesday: new Date(),
    Thursday: new Date(),
    Friday: new Date(),
    Saturday: new Date(),
    Sunday: new Date()
  });
  const [selectedDays, setSelectedDays] = useState<WeekDaySelectedType>({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false
  });

  const handleDate = (date: Date, day: string) => {
    const copyTime = { ...time };
    copyTime[day as keyof WeekDayType] = date;
    setTime(copyTime);
  };

  const handleSelectedDay = (day: string) => {
    setSelectedDays({
      ...selectedDays,
      [day]: !selectedDays[day as keyof WeekDaySelectedType]
    });
  };

  const getDateData = (dateData: Date, day: string) => {
    const dateDayNumber =
      toNumber(moment(dateData).format('d')) === 0
        ? 7
        : toNumber(moment(dateData).format('d'));
    const dayNumber =
      toNumber(moment(day, 'ddd').format('d')) === 0
        ? 7
        : toNumber(moment(day, 'ddd').format('d'));

    const date = moment(dateData).format('YYYY/MM/DD');
    if (dateDayNumber === dayNumber) {
      return date;
    }
    if (dateDayNumber > dayNumber) {
      const addedDays = 7 - toNumber(dateDayNumber) + toNumber(dayNumber);
      return moment(date, 'YYYY/MM/DD')
        .add(addedDays, 'd')
        .format('YYYY/MM/DD');
    }
    const addedDays = toNumber(dayNumber) - toNumber(dateDayNumber);
    return moment(date, 'YYYY/MM/DD').add(addedDays, 'd').format('YYYY/MM/DD');
  };

  const getEventData = (dateData: Date, day: string) => {
    const date = getDateData(dateData, day);
    const recurringEventDate =
      moment().format('X') + moment(day, 'ddd').format('d');

    const newEventData: NewGame = {
      type: GameType.Training,
      date: formatDateTime(date),
      UTCdate: utils.localeToUTC(date, dateData),
      startTime: formatDateTime(dateData, 'HH:mm').toString(),
      endTime: formatDateTime(
        moment(formatDateTime(dateData, 'HH:mm').toString())
          .add(120, 'minutes')
          .toDate(),
        'HH:mm'
      ).toString(),
      location: 'Home',
      recurringEventId: toNumber(recurringEventDate)
    };

    return newEventData;
  };

  const isButtonSelected = !Object.values(selectedDays).includes(true);

  const handleSaveEvents = () => {
    setIsLoading(true);
    const selectedRecurringDay: Partial<GameAny>[] = [];
    Object.keys(selectedDays).forEach((day) => {
      if (selectedDays[day as keyof WeekDaySelectedType]) {
        selectedRecurringDay.push(
          getEventData(time[day as keyof WeekDayType], day)
        );
      }
    });
    const endOfSeasonDate = moment(selectedRecurringDay[0].date, 'YYYY/MM/DD')
      .add(5, 'months')
      .format('YYYY/MM/DD');
    selectedRecurringDay.forEach((data: any) => {
      const dates: string[] = [];
      let date = data.UTCdate;
      let isDateBeforeSeasonEnd = moment(
        date,
        'YYYY/MM/DD HH:mm'
      ).isSameOrBefore(endOfSeasonDate);

      while (isDateBeforeSeasonEnd) {
        dates.push(date);

        date = moment(dates[dates.length - 1], 'YYYY/MM/DD HH:mm')
          .add(7, 'd')
          .format('YYYY/MM/DD HH:mm');

        isDateBeforeSeasonEnd = moment(
          dates[dates.length - 1],
          'YYYY/MM/DD HH:mm'
        )
          .add(7, 'd')
          .isSameOrBefore(endOfSeasonDate);
      }

      const eventsPromiseArr = dates
        .filter((date) => {
          const gamesOnSelectedDate = allGames.filter((game) => {
            return game.date === formatDateTime(date);
          });

          if (gamesOnSelectedDate.length > 1) return false;

          if (gamesOnSelectedDate.length === 1) {
            const startTimeOnExistingEvent = moment(
              gamesOnSelectedDate[0].date,
              'YYYY/MM/DD HH:mm'
            ).format('HH:mm');
            if (
              moment(data.data, 'YYYY/MM/DD HH:mm').format('HH:mm') ===
              startTimeOnExistingEvent
            ) {
              return false;
            }
          }

          return true;
        })
        .map((date) => ({ ...data, date, UTCdate: date }));

      dispatch(createBatchTrainingGamesAction(eventsPromiseArr))
        .unwrap()
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  const saveEventTimeout = () => {
    setIsLoading(true);
    handleModal('weekdaySelect');
    setTimeout(() => {
      handleSaveEvents();
    }, 10);
  };

  return (
    <>
      {isLoading
        ? (
        <OverlayLoader isLoading={isLoading} />
          )
        : (
        <Modal
          isVisible={modalType}
          animationIn="fadeIn"
          animationOut="fadeOut"
          useNativeDriver
          style={styles.modalContainer}
        >
          <OnboardingWeekDaySelector
            time={time}
            handleDate={handleDate}
            selectedDays={selectedDays}
            handleSelectedDay={handleSelectedDay}
          />
          <OnboardingNavigator
            hasSkipButton
            activeBubble={1}
            text={ONBOARDING_NAVIGATOR_TEXTS.RECURRING_EVENT}
            mainButtonHandler={saveEventTimeout}
            disableMainButton={isButtonSelected}
          />
        </Modal>
          )}
    </>
  );
};

export default RecurringWeekDaySelect;

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
    width: '100%'
  }
});
