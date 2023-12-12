import { createSlice } from '@reduxjs/toolkit';

export type OnlineTag = {
  connected: boolean;
  battery_percent: number;
  battery_voltage: number;
  bootloader_version: string;
  device_type: string;
  firmware_version: string;
  hardware_version: number;
  id: string;
  last_seen: number;
  operation_mode: string;
};

type InitialState = {
  data: OnlineTag[] | null;
};

export const onlineTagsSlice = createSlice({
  name: 'onlineTags',
  initialState: {
    data: null
  } as InitialState,
  reducers: {
    updateOnlineTags: (state, action) => {
      state.data = action.payload;
    }
  }
});

export const { updateOnlineTags } = onlineTagsSlice.actions;

export const selectOnlineTags = (state: any) =>
  (state.onlineTags.data || []) as OnlineTag[];

export default onlineTagsSlice.reducer;
