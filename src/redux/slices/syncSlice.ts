import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { clubConverter } from '../../converters';
import * as firestoreService from '../../helpers/firestoreService';

import { selectAuth } from './authSlice';
import { selectActiveClub, setActiveClub, setClubs } from './clubsSlice';
import { getUserProfileAction } from './userProfileSlice';

type syncStateInterface = {
  timestamp: number | null;
};

export const refreshData: any = createAsyncThunk(
  'sync/refreshData',
  async (_, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const auth = selectAuth(state);
      const activeClub = selectActiveClub(state);

      const clubRef = await firestoreService.getClub(auth.customerName);
      const clubs = (await clubRef.get()).docs.map((club) =>
        clubConverter.fromFirestore(club)
      );
      // refresh userProfileSlice
      thunkApi.dispatch(getUserProfileAction());
      // refresh clubsSlice
      thunkApi.dispatch(setClubs(clubs));

      if (activeClub) {
        const updatedActiveClub = clubs.find(
          (club) => club.id === activeClub.id
        );

        if (updatedActiveClub) {
          thunkApi.dispatch(setActiveClub(updatedActiveClub));
        }
      }
    } catch (e) {
      return thunkApi.rejectWithValue(e);
    }
  }
);

const sync = createSlice({
  name: 'sync',
  initialState: {
    timestamp: null
  } as syncStateInterface,
  reducers: {
    setSyncTime: (state) => {
      state.timestamp = Date.now();
    },
    removeSyncTime: (state) => {
      state.timestamp = null;
    }
  }
});

export const { setSyncTime, removeSyncTime } = sync.actions;
export const selectSyncTime = (state: any): any => state.sync.timestamp;
export const needSync = (state: any): boolean => {
  const syncTime = selectSyncTime(state);
  if (syncTime) {
    const now = Date.now();
    const diff = now - syncTime;
    // 24 hours
    if (diff > 1000 * 60 * 60 * 24) {
      // if (diff > 1000 * 5) {
      return true;
    }
  }
  return false;
};
export default sync.reducer;
