import { ImageStyle, ViewStyle } from 'react-native';

import { IconTypes } from './icons';

export interface IconProps {
  /**
   * Style overrides for the icon image
   */
  style?: ImageStyle & { fill?: string; fillColor?: string; color?: string };

  /**
   * Style overrides for the icon container
   */

  containerStyle?: ViewStyle;

  /**
   * The name of the icon
   */

  icon?: IconTypes;
}
