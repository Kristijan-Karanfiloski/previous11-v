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

  const IconComp = icons[icon]?.default;

  console.log('IconComp ', IconComp);

  return (
    <View style={containerStyle}>{IconComp && <IconComp style={style} />}</View>
  );
}
