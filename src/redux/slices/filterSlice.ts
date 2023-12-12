import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FilterStateType, GameType } from '../../../types';
import { WeekSelectItem } from '../../components/common/DropdownFilterSelectWeek';
import {
  DROPDOWN_DATA_MATCH,
  DROPDOWN_DATA_TRAINING,
  DROPDOWN_DATA_TRAINING_NO_BENCHMARK,
  DROPDOWN_DATA_WEEKLY_LOAD
} from '../../utils/mixins';

type FilterStateItem = {
  label: string;
  value: string;
  text: string;
  icon: string;
  key: string;
  disabled?: boolean;
  selectedWeek?: WeekSelectItem;
};

interface FilterState {
  match: FilterStateItem;
  training: FilterStateItem;
  noBenchmark: FilterStateItem;
  landing: FilterStateItem;
  weeklyLoad: FilterStateItem;
}

const initialState: FilterState = {
  match: DROPDOWN_DATA_MATCH[0],
  training: DROPDOWN_DATA_TRAINING[1],
  noBenchmark: DROPDOWN_DATA_TRAINING_NO_BENCHMARK[1],
  landing: DROPDOWN_DATA_TRAINING[1],
  weeklyLoad: DROPDOWN_DATA_WEEKLY_LOAD[1]
};

const filterSlice = createSlice({
  name: 'comparisonFilter',
  initialState,
  reducers: {
    setComparisonFilter: (
      state,
      action: PayloadAction<{
        filter:
          | FilterStateType.match
          | FilterStateType.training
          | FilterStateType.noBenchmark
          | FilterStateType.landing
          | FilterStateType.weeklyLoad;
        value: {
          label: string;
          value: string;
          text: string;
          icon: string;
          disabled?: boolean;
          selectedWeek?: WeekSelectItem;
          key: string;
        };
      }>
    ) => {
      const { filter = GameType.Match, value } = action.payload;

      state[filter] = value;
    },
    resetComparisonFilter: (state: FilterState) => {
      state = initialState;
    }
  }
});

export const { setComparisonFilter, resetComparisonFilter } =
  filterSlice.actions;
export const selectComparisonFilter = (
  state: any,
  type:
    | FilterStateType.match
    | FilterStateType.training
    | FilterStateType.noBenchmark
    | FilterStateType.landing
    | FilterStateType.weeklyLoad
): {
  label: string;
  value: string;
  text: string;
  icon: string;
  disabled?: boolean;
  key: string;
  selectedWeek?: WeekSelectItem;
} => state.comparisonFilter[type];
export default filterSlice;
