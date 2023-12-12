import React from 'react';
import { ColorValue, StyleSheet, View, ViewStyle } from 'react-native';
import {
  Defs,
  LinearGradient,
  NumberProp,
  Rect,
  Stop,
  Svg
} from 'react-native-svg';

type Props = {
  children?: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  linearGradient: {
    x1?: NumberProp | undefined;
    x2?: NumberProp | undefined;
    y1?: NumberProp | undefined;
    y2?: NumberProp | undefined;
  };
  colors: {
    offset: NumberProp | undefined;
    color: ColorValue | undefined;
    opacity?: NumberProp;
  }[];
  index?: any;
  rectOpacity?: NumberProp;
};

const LinearGradientView = ({
  children,
  style,
  linearGradient,
  colors,
  contentStyle,
  index,
  rectOpacity = 1
}: Props) => {
  const { x1 = 0, x2 = 0, y1 = 0, y2 = 0 } = linearGradient;

  return (
    <View style={[{ overflow: 'hidden' }, style]}>
      <View style={styles.svg}>
        <Svg height="100%" width="100%" key={index}>
          <Defs>
            <LinearGradient id="grad" x1={x1} y1={y1} x2={x2} y2={y2}>
              {colors.map(({ offset, color, opacity = 1 }, i) => (
                <Stop
                  key={i}
                  offset={offset}
                  stopColor={color}
                  stopOpacity={opacity}
                />
              ))}
            </LinearGradient>
          </Defs>
          <Rect
            width="100%"
            height="100%"
            fill="url(#grad)"
            opacity={rectOpacity}
          />
        </Svg>
      </View>
      <View style={contentStyle}>{children}</View>
    </View>
  );
};

export default LinearGradientView;

const styles = StyleSheet.create({
  svg: {
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%'
  }
});
