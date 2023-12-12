import React, { useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { GameAny } from '../../../types';
import { selectTrackingEvent } from '../../redux/slices/trackingEventSlice';
import { useAppSelector } from '../../redux/store';
import { utils, variables } from '../../utils/mixins';

import CalendarCell from './CalendarCell';

interface CalendarGridProps {
  games: GameAny[];
  month: number;
  year: number;
  viewHeight?: number;
}

const CalendarGrid = ({ month, year, games }: CalendarGridProps) => {
  const activeEvent = useAppSelector(selectTrackingEvent);
  const navigation = useNavigation();
  const [gridHeight, setGridHeight] = useState(0);

  const data = useMemo(
    () => utils.generateCalendarDays(month, year),
    [month, year]
  );

  const eventsPerDay = useMemo(() => {
    const events: any = Array(data.length)
      .fill(null)
      .map(() => []);
    for (let i = 0; i < data.length; i++) {
      const itemDate = moment(
        `${data[i].day}/${data[i].month}/${year}`,
        'DD/MM/YYYY'
      ).format('YYYY/MM/DD');
      for (const game of games) {
        const { date, dateFormat } = utils.checkAndFormatUtcDate(
          game.UTCdate,
          game.date,
          game.startTime
        );
        if (moment(date, `${dateFormat}`).isSame(itemDate, 'day')) {
          events[i].push(game);
        }
      }
    }
    return events;
  }, [data, games, year]);

  const onCalendarCellPress = (
    id: string | undefined,
    item: {
      day: number;
      month: number;
      isCurrentMonth: boolean;
    },
    eventsOnDay: GameAny[]
  ) => {
    const date = `${item.day}/${item.month}/${year}`;
    const isPastDate = moment(date, 'DD/MM/YYYY').isBefore(
      moment('00:00:00', 'h:mm:ss'),
      'day'
    );
    if (!id) {
      if (isPastDate) {
        return navigation.navigate('AskToLoadSessionModal', {
          date
        });
      }
      const time = moment(new Date()).format('HH:mm');
      navigation.navigate('CreateEventModal', {
        date: moment(`${date} ${time}`, 'DD/MM/YYYY HH:mm').toDate()
      });
    } else {
      if (activeEvent?.id === id) {
        return navigation.navigate('LiveView');
      }

      const event = eventsOnDay.find((event) => event.id === id);

      if (event && isPastDate && !event.status?.isFinal) {
        return navigation.navigate('AskToLoadSessionModal', {
          date,
          event
        });
      }

      if (event) {
        navigation.navigate('EventDetailsModal', {
          event
        });
      }
      return null;
    }
  };

  const renderGrid = useCallback(() => {
    return data.map((item, index) => {
      const eventsOnDay: GameAny[] = eventsPerDay[index];
      const customStyle = {
        backgroundColor: '#eee',
        opacity: item?.isCurrentMonth === false ? 0.35 : 1,
        height: gridHeight / 6
      };

      return (
        <CalendarCell
          key={index}
          customStyle={customStyle}
          date={item}
          events={eventsOnDay}
          onPress={(id) => {
            onCalendarCellPress(id, item, eventsOnDay);
          }}
        />
      );
    });
  }, [data, gridHeight, activeEvent, eventsPerDay, year, navigation]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setGridHeight(height);
  }, []);

  return (
    <View style={styles.container} onLayout={onLayout}>
      {renderGrid()}
    </View>
  );
};

export default CalendarGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: '100%',
    justifyContent: 'center',
    width: variables.deviceWidth
  }
});
