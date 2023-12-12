import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PrgoressFilterType } from '../../types';

interface ProgressFilterProps {
  numberOfFilters: number;
  filterOptions: PrgoressFilterType;
}

const initialState: ProgressFilterProps = {
  numberOfFilters: 0,
  filterOptions: {
    allMatches: false,
    won: false,
    lost: false,
    tied: false,
    allTrainings: false,
    matchday: false,
    plusOne: false,
    plusTwo: false,
    plusThree: false,
    minusOne: false,
    minusTwo: false,
    minusThree: false,
    minusFour: false,
    minusFive: false,
    minusSix: false,
    minusSeven: false,
    minusEight: false,
    noCategory: false,
    individual: false
  }
};

const progressFilterSlice = createSlice({
  name: 'progressFilter',
  initialState,
  reducers: {
    setProgressFilter: (
      state,
      action: PayloadAction<{
        filterOptions: PrgoressFilterType;
      }>
    ) => {
      state.filterOptions = action.payload.filterOptions;
      const newNumberOfFilters = Object.values(state.filterOptions).filter(
        (item) => item === true
      );
      state.numberOfFilters = newNumberOfFilters.length;
    },
    resetProgressFilter: (state: ProgressFilterProps) => {
      state = initialState;
    },
    getProgressFilter: (state: ProgressFilterProps) => {
      return state;
    }
  }
});

export const { setProgressFilter, resetProgressFilter, getProgressFilter } =
  progressFilterSlice.actions;

export const progressFilterState = (state: any) => state.progressFilter;

export default progressFilterSlice;
