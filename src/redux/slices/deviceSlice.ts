import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit';
import * as Device from 'expo-device';

export const setDeviceType: any = createAsyncThunk(
  'device/getDeviceType',
  async () => {
    const device = await Device.getDeviceTypeAsync();

    if (Device.DeviceType.TABLET === device) {
      return true;
    }

    return false;
  }
);

export const deviceSlice = createSlice({
  name: 'device',
  initialState: {
    isTablet: false
  },
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(setDeviceType.fulfilled, (state, action) => {
      // Add user to the state array
      state.isTablet = action.payload;
    });
  }
});

// export const { increment, decrement, incrementByAmount } = deviceSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const setDeviceTypeAction = () => (dispatch: Dispatch) => {
  console.log('calling action');
  dispatch(setDeviceType());
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectDeviceType = (state: any) => state.device.isTablet;

export default deviceSlice.reducer;
