import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import _ from 'lodash';
import moment, { Moment } from 'moment';

import { selectAllGames } from '../../redux/slices/gamesSlice';
import { useAppSelector } from '../../redux/store';
import { color } from '../../theme';
import { variables } from '../../utils/mixins';
import DatePicker from '../common/DatePicker';

import CalendarGrid from './CalendarGrid';
import CalendarHeader from './CalendarHeader';

interface CalendarBodyProps {
  calendarDate?: Moment;
  hideHeader?: boolean;
  isOnboarding?: boolean;
}

const CalendarBody = ({
  calendarDate = moment(),
  hideHeader = false,
  isOnboarding = false
}: CalendarBodyProps) => {
  const panRef = useRef(null);
  const lastSwipeRef = useRef({ x: 0, y: 0 });
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(calendarDate);
  const [eventsFilter, setEventsFilter] = useState<string>('all');
  const animatedLeftMargin = useRef(new Animated.Value(0)).current;

  const games = useAppSelector(selectAllGames);

  useEffect(() => {
    if (calendarDate) {
      setCurrentDate(calendarDate);
    }
  }, [calendarDate]);

  const swipeAnimation = useCallback((xValue: number, date: Moment) => {
    Animated.timing(animatedLeftMargin, {
      toValue: xValue,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.linear
    }).start(() => {
      setCurrentDate(date);

      Animated.sequence([
        Animated.timing(animatedLeftMargin, {
          toValue: -xValue,
          duration: 0,
          useNativeDriver: true,
          easing: Easing.linear
        }),
        Animated.timing(animatedLeftMargin, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.linear
        })
      ]).start();
    });
  }, []);

  const handleSwipe = _.throttle(
    (event: {
      nativeEvent: {
        oldState: number;
        translationX: number;
        translationY: number;
      };
    }) => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        const { translationX, translationY } = event.nativeEvent;
        const { x: lastX, y: lastY } = lastSwipeRef.current;
        lastSwipeRef.current = { x: translationX, y: translationY };

        if (Math.abs(translationY - lastY) > Math.abs(translationX - lastX)) {
          return;
        }

        const newDate =
          translationX < 0
            ? currentDate.clone().add(1, 'month')
            : currentDate.clone().subtract(1, 'month');

        if (Math.abs(translationX) > 50) {
          swipeAnimation(
            translationX < 0 ? -variables.deviceWidth : variables.deviceWidth,
            newDate
          );
        }
      }
    },
    100,
    { leading: true, trailing: false }
  );

  const goToMonth = useCallback(
    (date: Moment) => {
      const direction = currentDate.isBefore(date, 'month') ? -1 : 1;
      swipeAnimation(direction * variables.deviceWidth, date);
    },
    [currentDate, swipeAnimation]
  );

  const Weekdays = useMemo(
    () =>
      variables.weekdaysAbbr.map((label, index) => (
        <View key={index} style={styles.weekDayHeader}>
          <Text style={styles.weekDayHeaderText}>{label}</Text>
        </View>
      )),
    []
  );

  const opacity = animatedLeftMargin.interpolate({
    inputRange: [-variables.deviceWidth, 0, variables.deviceWidth],
    outputRange: [0.3, 1, 0.3],
    extrapolate: 'clamp'
  });

  return (
    <View style={{ flex: 1 }}>
      {!hideHeader && (
        <CalendarHeader
          currentDate={currentDate}
          setCurrentDate={goToMonth}
          toggleDatePicker={() => setShowDatepicker((prev) => !prev)}
          onEventTypeChange={setEventsFilter}
          eventType={eventsFilter}
        />
      )}

      <PanGestureHandler ref={panRef} onHandlerStateChange={handleSwipe}>
        <Animated.View
          style={[
            styles.calendar,
            {
              transform: [{ translateX: animatedLeftMargin }],
              opacity
            }
          ]}
        >
          <View
            style={[
              styles.weekDayContainer,
              !isOnboarding && {
                backgroundColor: color.palette.realWhite,
                borderTopColor: color.palette.greyE1,
                borderTopWidth: 1
              }
            ]}
          >
            {Weekdays}
          </View>

          <View style={{ flex: 1 }}>
            <CalendarGrid
              games={
                eventsFilter === 'all'
                  ? games
                  : games.filter((game) => game.type === eventsFilter)
              }
              year={currentDate.year()}
              month={+currentDate.format('MM')}
            />
          </View>
        </Animated.View>
      </PanGestureHandler>

      {showDatepicker && (
        <DatePicker
          selectedDate={currentDate.toDate()}
          style={{ width: variables.deviceWidth * 0.4 }}
          onSelect={goToMonth}
          dismiss={() => setShowDatepicker(false)}
        />
      )}
    </View>
  );
};

export default CalendarBody;

const styles = StyleSheet.create({
  calendar: {
    flex: 1
  },
  weekDayContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: variables.weekDayHeaderHeight,
    justifyContent: 'space-around',
    shadowColor: color.palette.realBlack,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1
  },
  weekDayHeader: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  weekDayHeaderText: {
    color: color.palette.lightGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 14
  }
});
