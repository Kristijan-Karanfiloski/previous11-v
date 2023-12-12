import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { clubConverter, clubFirestoreProps } from '../../converters';
import * as firestoreService from '../../helpers/firestoreService';

import { logoutUser, selectAuth } from './authSlice';

interface profileStateInterface {
  data: clubFirestoreProps[] | null;
  activeClub: clubFirestoreProps | null;
  isFetching: boolean;
  fetched: boolean;
  error: any;
}
const initialState: profileStateInterface = {
  data: null,
  activeClub: null,
  isFetching: false,
  fetched: false,
  error: null
};

export const getClubsAction: any = createAsyncThunk(
  'clubs/fetchClubs',
  async (_, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const auth = selectAuth(state);
      const clubRef = await firestoreService.getClub(auth.customerName);
      const clubs = (await clubRef.get()).docs.map((club) =>
        clubConverter.fromFirestore(club)
      );
      return clubs;
    } catch (e) {
      return thunkApi.rejectWithValue(e);
    }
  }
);

export const updateActiveClubAction: any = createAsyncThunk(
  'clubs/updateActiveClub',
  async (activeClubUpdates: Partial<clubFirestoreProps>, thunkApi) => {
    const state = thunkApi.getState();
    const auth = selectAuth(state);

    const activeTeam = selectActiveClub(state);
    const clubRef = (await firestoreService.getClub(auth.customerName)).doc(
      activeTeam.id
    );
    firestoreService.updateClub(clubRef, activeClubUpdates);
    thunkApi.dispatch(updateActiveClub(activeClubUpdates));
  }
);

export const clubSlice = createSlice({
  name: 'clubs',
  initialState,
  reducers: {
    // auth reducer
    setClubs: (state, action: PayloadAction<clubFirestoreProps[]>) => {
      state.data = action.payload;
    },
    setActiveClub: (state, action: PayloadAction<clubFirestoreProps>) => {
      state.activeClub = action.payload;
    },
    updateClub: (state) => {
      state.data = null;
    },
    updateActiveClub: (
      state,
      action: PayloadAction<Partial<clubFirestoreProps>>
    ) => {
      if (action.payload && state.activeClub) {
        state.activeClub = {
          ...state.activeClub,
          ...action.payload
        };
        // update club in clubs
        if (state.data) {
          state.data = state.data.map((club) => {
            if (club.id === state.activeClub?.id) {
              return {
                ...club,
                ...action.payload
              };
            }
            return club;
          });
        }
      }
    },
    removeActiveClub: (state) => {
      state.activeClub = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getClubsAction.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(getClubsAction.fulfilled, (state, action) => {
      state.isFetching = false;
      state.fetched = true;
      state.data = action.payload as clubFirestoreProps[];
    });
    builder.addCase(getClubsAction.rejected, (state, action) => {
      state.isFetching = false;
      state.fetched = true;
      state.error = action.error;
    });

    /// Reset state on logOut
    builder.addCase(logoutUser, () => initialState);
  }
});

export const { setActiveClub, updateActiveClub, setClubs, removeActiveClub } =
  clubSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectClubs = (state: any): clubFirestoreProps[] =>
  state.clubs.data;
export const selectActiveClub = (state: any): clubFirestoreProps =>
  state.clubs.activeClub;
export const selectClubState = (state: any): clubFirestoreProps => state.clubs;

export default clubSlice.reducer;
