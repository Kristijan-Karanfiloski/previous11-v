import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { WellnessData } from './helpers';
import RangeSlider from './RangeSlider';

type Props = {
  name: string;
  onChange: (key: string, value: string | number) => void;
  data: WellnessData;
};

const Slider = ({ name, data, onChange }: Props) => {
  const [width, setWidth] = useState(0);
  return (
    <GestureHandlerRootView
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setWidth(width);
      }}
      style={{ width: '100%' }}
    >
      <RangeSlider
        name={name}
        sliderWidth={width}
        onValueChange={onChange}
        data={data}
      />
    </GestureHandlerRootView>
  );
};

export default Slider;
