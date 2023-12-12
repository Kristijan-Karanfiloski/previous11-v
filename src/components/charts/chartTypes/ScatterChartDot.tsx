import React from 'react';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';

import DotMatchImage from '../../../assets/images/dot-match.png';
import DotMatchEmptyImage from '../../../assets/images/dot-match-empty.png';
import { color } from '../../../theme';
import { utils, variables } from '../../../utils/mixins';

interface ScatterChartDotProps {
  bottom: number | string;
  left: number;
  active: boolean;
  onPress?: () => void;
  isMatch: boolean;
  gameId: string;
  id: string;
  isViewable: boolean;
  icon: string;
  screenNumber: 0 | 1;
}

const ScatterChartDot = ({
  bottom,
  left,
  active,
  onPress = () => {},
  isMatch,
  isViewable,
  icon,
  screenNumber
}: ScatterChartDotProps) => {
  const size = 8;
  const outerSize = 12;

  const overrideColor =
    screenNumber === 1 && icon === 'spot_on'
      ? '#21F90F'
      : isViewable
        ? color.palette.realBlack
        : undefined;

  return (
    <Pressable
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      onPress={onPress}
      style={StyleSheet.flatten([
        {
          width: outerSize,
          height: outerSize,
          backgroundColor: active
            ? utils.rgba(color.palette.orange, 0.5)
            : 'transparent',
          bottom, // - Math.round(outerSize / 2),
          left: left - Math.round(outerSize / 2),
          borderRadius: outerSize
        },
        styles.container
      ])}
    >
      <View
        style={{
          width: active && !isViewable ? 4 : size,
          height: active && !isViewable ? 4 : size,
          backgroundColor: active
            ? color.palette.orange
            : overrideColor || variables.realWhite,
          borderWidth: isMatch ? 0 : 1,
          borderColor: active
            ? color.palette.orange
            : overrideColor || undefined,
          borderRadius: size
        }}
      >
        {isMatch && !active && screenNumber === 0 && (
          <ImageBackground
            style={{ flex: 1 }}
            source={isViewable ? DotMatchImage : DotMatchEmptyImage}
          />
        )}
      </View>
    </Pressable>
  );
};

export default ScatterChartDot;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  }
});
