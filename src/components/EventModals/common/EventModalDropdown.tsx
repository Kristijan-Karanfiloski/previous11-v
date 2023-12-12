import React from 'react';
import { ViewStyle } from 'react-native';

import Dropdown from '../../common/Dropdown';

interface Props {
  value: string;
  options: { label: string; value: string | number }[];
  type: string;
  handleEventDetails: (data: string | Date, key: string) => void;
  height: number;
  style: ViewStyle;
}

const EventModalDropdown = ({
  value,
  options,
  type,
  handleEventDetails,
  height,
  style
}: Props) => {
  return (
    <Dropdown
      uiType="two"
      placeholder="Select"
      value={value}
      options={options}
      onChange={(value) => {
        handleEventDetails(value, type);
      }}
      preventUnselect
      dropdownHeight={height}
      containerStyle={style}
    />
  );
};

export default EventModalDropdown;
