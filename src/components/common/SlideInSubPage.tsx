import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from 'react';
import { Animated } from 'react-native';

import { SlideInSubPageRef } from '../../types';
import { variables } from '../../utils/mixins';

interface SlideInSubPageProps {
  onClose?: () => void;
  children: any;
}

const SlideInSubPage = (
  props: SlideInSubPageProps,
  ref: React.Ref<SlideInSubPageRef | null>
) => {
  const { onClose } = props;

  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(variables.deviceWidth)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const pageClose = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: variables.deviceWidth,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => {
      onClose && onClose();
    });
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        pageClose
      };
    },
    []
  );

  return (
    // {/* <Animated.View style={[styles.bgView, { opacity: opacity }]} /> */}
    <Animated.View
      style={{
        flex: 1,
        transform: [{ translateX }],
        opacity
      }}
    >
      {props.children}
    </Animated.View>
  );
};

export default forwardRef(SlideInSubPage);

// const styles = StyleSheet.create({
//   bgView: {
//     backgroundColor: variables.backgroundColor,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//     top: 0,
//     width: variables.deviceWidth
//   }
// });
