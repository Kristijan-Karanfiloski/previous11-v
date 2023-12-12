import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { authFirestoreProps } from '../../converters';

interface authState {
  data: authFirestoreProps | null;
  isFetching: boolean;
  fetched: boolean;
  error: any;
}
const initialState: authState = {
  data: null,
  isFetching: false,
  fetched: false,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // auth reducer
    authUser: (state, action: PayloadAction<authFirestoreProps>) => {
      state.data = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<authFirestoreProps>>) => {
      state.data = {
        ...state.data,
        ...action.payload
      } as authFirestoreProps;
    },
    logoutUser: (state) => {
      state.data = null;
    }
  }
  // extraReducers: (builder) => {
  //   builder.addMatcher(authApiSlice.endpoints.login.matchPending, (state) => {
  //     state.isFetching = true;
  //   });
  //   builder.addMatcher(
  //     authApiSlice.endpoints.login.matchFulfilled,
  //     (state, action) => {
  //       state.isFetching = false;
  //       state.fetched = true;
  //       state.data = action.payload as authFirestoreProps;
  //       console.log('Matcher fulfilled', action.payload);
  //     }
  //   );
  //   builder.addMatcher(
  //     authApiSlice.endpoints.login.matchRejected,
  //     (state, action) => {
  //       state.isFetching = false;
  //       state.fetched = true;
  //       state.error = action.error;
  //     }
  //   );
  // }
});

export const { authUser, logoutUser, updateUser } = authSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectAuth = (state: any): authFirestoreProps => state.auth.data;

export default authSlice.reducer;
