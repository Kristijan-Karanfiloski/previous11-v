import React, { useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { GameAny } from '../../../types';
import { color } from '../../theme';
import { utils, variables } from '../../utils/mixins';
import EventCardCalendar from '../EventCard/EventCardCalendar';

interface CalendarCellProps {
  date: {
    day: number;
    month: number;
    isCurrentMonth?: boolean;
  };
  customStyle?: ViewStyle;
  events?: GameAny[];
  onPress?: (id?: string) => void;
}

const calendarCellWidth = variables.deviceWidth / 7 - 0.01;

const CalendarCell = ({
  date,
  customStyle,
  events = [],
  onPress
}: CalendarCellProps) => {
  const navigation = useNavigation();
  const { day, month } = date;
  const currentDate = new Date();

  const isCellClickable = useMemo(() => events.length <= 1, [events]);

  const handlePress = useCallback(() => {
    if (onPress && isCellClickable) onPress();
  }, [onPress, isCellClickable]);

  const { eventsOnDay, remainingSessions } = useMemo(() => {
    const eventsOnDay = [];
    let remainingSessions = 0;
    for (let i = 0; i < events.length; i++) {
      if (i < 2) {
        eventsOnDay.push(
          <TouchableOpacity
            key={i}
            onPress={() => onPress && onPress(events[i].id)}
            style={styles.cardWrapper}
          >
            <EventCardCalendar event={events[i]} linGradIndex={events.length} />
          </TouchableOpacity>
        );
      } else {
        remainingSessions++;
      }
    }
    return { eventsOnDay, remainingSessions };
  }, [events, handlePress]);

  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;

  const marked = useMemo(
    () => day === currentDay && month === currentMonth,
    [day, month]
  );

  const moreButtonText = useMemo(
    () =>
      remainingSessions
        ? `${remainingSessions} more session${remainingSessions > 1 ? 's' : ''}`
        : '',
    [remainingSessions]
  );

  return (
    <TouchableOpacity
      style={[styles.cell, customStyle]}
      onPress={handlePress}
      activeOpacity={!isCellClickable ? 1 : 0.2}
    >
      <Text
        style={[
          styles.cellDate,
          marked && {
            color: color.palette.orange
          }
        ]}
      >
        {day}
      </Text>
      <View style={{ flex: 1 }}>
        {eventsOnDay}
        {remainingSessions > 0 && (
          <View style={styles.moreButtonContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SessionsMenu', {
                  initialDate: utils.checkAndFormatUtcDate(
                    events[0].UTCdate,
                    events[0].date,
                    events[0].startTime
                  ).date
                })
              }
              style={styles.moreButton}
            >
              <Text style={styles.moreButtonText}>{moreButtonText}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CalendarCell;

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 0.5,
    marginBottom: 3
  },
  cell: {
    borderBottomWidth: 1,
    borderColor: color.palette.greyE1,
    borderLeftWidth: 1,
    paddingHorizontal: 4,
    paddingTop: 10,
    width: calendarCellWidth
  },
  cellDate: {
    fontFamily: variables.mainFont,
    fontSize: 15,
    marginBottom: 7,
    marginRight: 12,
    textAlign: 'right'
  },
  moreButton: {
    backgroundColor: variables.realWhite,
    borderRadius: 2,
    height: 22
  },
  moreButtonContainer: {
    height: 22,
    marginTop: 4
  },
  moreButtonText: {
    fontFamily: variables.mainFontLight,
    fontSize: 11,
    paddingTop: 4,
    textAlign: 'center'
  }
});
