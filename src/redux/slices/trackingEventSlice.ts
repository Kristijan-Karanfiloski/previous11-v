import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GameAny, StatusMatch } from '../../../types';

interface ActiveGame extends GameAny {
  activeDrill?: null | string;
}

const trackingEvent = createSlice({
  name: 'trackingEvent',
  initialState: {
    data: null
  } as {
    data: ActiveGame | null;
  },
  reducers: {
    setTrackingEvent: (state, action: PayloadAction<GameAny>) => {
      if (action.payload) {
        // intialize status object
        const status: StatusMatch = {
          drills: [],
          isFinal: false,
          startTimestamp: Date.now()
        };
        state.data = {
          ...action.payload,
          status
        };
      }
    },
    updateTrackingEvent: (
      state,
      action: PayloadAction<Partial<ActiveGame>>
    ) => {
      if (action.payload && state.data) {
        state.data = {
          ...state.data,
          ...action.payload
        };
      }
    },
    removeTrackingEvent: (state) => {
      state.data = null;
    }
  }
});

export const { setTrackingEvent, removeTrackingEvent, updateTrackingEvent } =
  trackingEvent.actions;
export const selectTrackingEvent = (state: any): ActiveGame =>
  state.trackingEvent.data;
export default trackingEvent;
