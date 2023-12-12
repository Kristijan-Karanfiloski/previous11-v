import * as React from 'react';
import { ImageStyle, View } from 'react-native';

import { IconProps } from './icon.props';
import { icons } from './icons';

const ROOT: ImageStyle = {
  resizeMode: 'contain',
  width: 20,
  height: 20
};

export function Icon(props: IconProps) {
  const { style: styleOverride, icon = 'back', containerStyle } = props;
  const style: ImageStyle = { ...ROOT, ...styleOverride };

  const IconComp = icons[icon].default;

  return (
    <View style={containerStyle}>
      <IconComp style={style} />
    </View>
  );
}
