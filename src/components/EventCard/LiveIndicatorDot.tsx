import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

type Props = {
  customStyle: ViewStyle;
};
const LiveIndicatorDot = ({ customStyle }: Props) => {
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animate().start();

    return () => {
      animate().stop();
    };
  }, []);

  const animate = () => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          delay: 600
        })
      ])
    );
  };

  return <Animated.View style={[customStyle, { opacity: animatedOpacity }]} />;
};

export default LiveIndicatorDot;
