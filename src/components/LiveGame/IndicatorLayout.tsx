import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { color } from '../../theme';

import IndicatorTab from './IndicatorTab';

export interface IIndicatorItem {
  number?: number | string;
  label?: string;
  isActive?: boolean;
  onClick?(): void;
  locked?: boolean;
  isSmall?: boolean;
  badge?: string;
}

export interface IndicatorLayoutProps {
  /**
   * An optional style override useful for padding & margin.
   */
  containerStyle?: ViewStyle;

  indicators?: Array<IIndicatorItem>;
}

/**
 * Render indicator layout component
 */
const IndicatorLayout = (props: IndicatorLayoutProps) => {
  const { containerStyle, indicators } = props;

  return (
    <View style={[style.container, containerStyle]}>
      {indicators &&
        indicators.map((item, index) => (
          <React.Fragment key={index}>
            <IndicatorTab style={style.tab} {...item} />
            {index >= 1 && index !== indicators.length - 1 && (
              <View style={style.divider} />
            )}
          </React.Fragment>
        ))}
    </View>
  );
};

export default IndicatorLayout;

const style = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: color.palette.black2,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  },
  divider: {
    borderLeftColor: color.palette.grey,
    borderLeftWidth: 1,
    height: 71,
    width: 0
  },

  tab: {
    flex: 1
  }
});
