import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Config, Tag } from '../../../types/config';
import * as firestoreService from '../../helpers/firestoreService';

import { selectAuth } from './authSlice';
import { selectActiveClub } from './clubsSlice';
import { selectAllPlayers } from './playersSlice';

export const getConfigAction = createAsyncThunk(
  'config/fetchConfig',
  async (_, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const auth = selectAuth(state);
      const activeTeam = selectActiveClub(state);
      const clubRef = (await firestoreService.getClub(auth.customerName)).doc(
        activeTeam.id
      );
      const config = await firestoreService.getConfigData(clubRef);
      console.log({ config, activeTeam });
      return config || { tags: {} };
    } catch (e) {
      return thunkApi.rejectWithValue(e);
    }
  }
);

export const updateConfigTagsAction = createAsyncThunk(
  'config/updateConfigTags',
  async (tags: Tag, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const auth = selectAuth(state);
      const activeTeam = selectActiveClub(state);
      const clubRef = (await firestoreService.getClub(auth.customerName)).doc(
        activeTeam.id
      );

      firestoreService.updateConfigTags(clubRef, tags);

      thunkApi.dispatch(updateTags(tags));

      return tags;
    } catch (e) {
      return thunkApi.rejectWithValue(e);
    }
  }
);

type configState = {
  data: Config | null;
  isFetching: boolean;
  error: null | string;
  fetched: boolean;
};

const initialState: configState = {
  data: {
    tags: {},
    edgeDeviceName: ''
  },
  isFetching: false,
  fetched: false,
  error: null
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setEdgeDeviceName: (state, action) => {
      state.data = { ...state.data, edgeDeviceName: action.payload } as Config;
    },
    updateTags: (state, action) => {
      const tags = state.data?.tags
        ? { ...state.data?.tags, ...action.payload }
        : action.payload;
      console.log({ tags });
      state.data = { ...state.data, tags } as Config;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getConfigAction.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(getConfigAction.fulfilled, (state, action) => {
      state.isFetching = false;
      state.fetched = true;
      state.data = { ...state.data, tags: action.payload.tags } as Config;
    });
    builder.addCase(getConfigAction.rejected, (state, action) => {
      state.isFetching = false;
      state.fetched = true;
      state.error = action.error.message || null;
    });
  }
});

export const { setEdgeDeviceName, updateTags } = configSlice.actions;

export const selectConfig = (state: {
  config: {
    data: Config;
  };
}) => state.config.data;

export const selectAvailableTags = (state: any) => {
  const players = selectAllPlayers(state);
  const tags = selectConfig(state)?.tags || {};
  // return available tags that are not already used by a player in player.tag
  return (Object.values(tags) || []).filter((tag: string) => {
    return !players.some((player) => player.tag === tag);
  });
};

export default configSlice.reducer;
