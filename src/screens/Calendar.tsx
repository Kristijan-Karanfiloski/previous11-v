import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import moment from 'moment';

import CalendarBody from '../components/Calendar/CalendarBody';
import { RootStackParamList } from '../types';

const Calendar = () => {
  const route = useRoute() as RouteProp<RootStackParamList, 'Calendar'>;

  return <CalendarBody calendarDate={route.params?.calendarDate || moment()} />;
};

export default Calendar;
