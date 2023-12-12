import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

interface CurrentWeekState {
  start: string;
  end: string;
}

const initialState: CurrentWeekState = {
  start: moment().clone().startOf('isoWeek').format('YYYY/MM/DD'),
  end: moment().clone().endOf('isoWeek').format('YYYY/MM/DD')
};

const currentWeek = createSlice({
  name: 'currentWeek',
  initialState,
  reducers: {
    setNewWeek: (
      state,
      action: PayloadAction<{
        isNextWeek: boolean;
      }>
    ) => {
      const { isNextWeek } = action.payload;

      if (isNextWeek) {
        const nextWeekStart = moment(state.start, 'YYYY/MM/DD')
          .add(7, 'days')
          .format('YYYY/MM/DD');
        const nextWeekEnd = moment(state.end, 'YYYY/MM/DD')
          .add(7, 'days')
          .format('YYYY/MM/DD');
        return (state = { start: nextWeekStart, end: nextWeekEnd });
      } else {
        const prevWeekStart = moment(state.start, 'YYYY/MM/DD')
          .subtract(7, 'days')
          .format('YYYY/MM/DD');
        const prevWeekEnd = moment(state.end, 'YYYY/MM/DD')
          .subtract(7, 'days')
          .format('YYYY/MM/DD');
        return (state = { start: prevWeekStart, end: prevWeekEnd });
      }
    }
  }
});

export const { setNewWeek } = currentWeek.actions;

export const getCurrentWeek = (state: any) => state.currentWeek;

export default currentWeek;
