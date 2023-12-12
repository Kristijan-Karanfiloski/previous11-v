import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { userProfileFirestoreProps } from '../../converters';
import {
  getUserProfile,
  updateUserProfile
} from '../../helpers/firestoreService';

import { logoutUser, selectAuth } from './authSlice';

export const getUserProfileAction: any = createAsyncThunk(
  'userProfile/getUserProfile',
  async (_, thunkApi) => {
    const state = thunkApi.getState();
    const auth = selectAuth(state);
    const data = await getUserProfile(auth.id, auth.customerName);
    if (!data) {
      return thunkApi.rejectWithValue('No data');
    }

    return data;
  }
);

export const updateUserProfileAction: any = createAsyncThunk(
  'userProfile/updateUserProfile',
  async (userData, thunkApi) => {
    const state = thunkApi.getState();
    const auth = selectAuth(state);
    updateUserProfile(auth.id, auth.customerName, userData);

    thunkApi.dispatch(updateProfile(userData));
  }
);

interface profileStateInterface {
  data: userProfileFirestoreProps | null;
  isFetching: boolean;
  fetched: boolean;
  error: any;
}
const initialState: profileStateInterface = {
  data: null,
  isFetching: false,
  fetched: false,
  error: null
};

export const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    // auth reducer
    setProfile: (state, action: PayloadAction<userProfileFirestoreProps>) => {
      state.data = action.payload;
    },
    // update profile
    updateProfile: (state, action: PayloadAction<any>) => {
      state.data = {
        ...state.data,
        ...action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUserProfileAction.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(getUserProfileAction.fulfilled, (state, action) => {
      state.isFetching = false;
      state.fetched = true;
      state.data = action.payload as userProfileFirestoreProps;
      console.log('Matcher fulfilled', action.payload);
    });
    builder.addCase(getUserProfileAction.rejected, (state, action) => {
      state.isFetching = false;
      state.fetched = true;
      state.error = action.error;
    });

    /// Reset state on logOut
    builder.addCase(logoutUser, () => initialState);
  }
});

export const { setProfile, updateProfile } = userProfileSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectUserProfile = (state: any): userProfileFirestoreProps =>
  state.userProfile.data;

export default userProfileSlice.reducer;
