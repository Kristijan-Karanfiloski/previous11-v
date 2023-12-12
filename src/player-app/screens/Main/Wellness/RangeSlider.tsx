import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  AnimateProps,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';

import LinearGradientView from '../../../../components/LinearGradientView';
import { variables } from '../../../../utils/mixins';

import { WellnessData } from './helpers';

const THUMB_WIDTH = 32;

type Props = {
  name: string;
  sliderWidth: number;
  onValueChange: (key: string, value: string | number) => void;
  data: WellnessData;
};

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedNumber = Animated.createAnimatedComponent(TextInput);
const AnimatedText = Animated.createAnimatedComponent(TextInput);

const RangeSlider = ({ name, sliderWidth, onValueChange, data }: Props) => {
  const position = useSharedValue(0);
  const { title, gradesNumber, subTitle, startFromZero } = data;
  const calculateSnappingPoints = () => {
    return Array.from(
      { length: gradesNumber },
      (_, i) => ((sliderWidth - THUMB_WIDTH) / (gradesNumber - 1)) * i
    );
  };
  const partsArr = calculateSnappingPoints();
  const part = (sliderWidth - THUMB_WIDTH) / ((gradesNumber - 2) * 2 + 2);

  const snappingRanges = new Array(gradesNumber).fill(null).map((_, i) => {
    if (i === 0) return part;
    if (i === gradesNumber - 1) {
      return sliderWidth - THUMB_WIDTH;
    }
    return (i * 2 + 1) * part;
  });

  const gestureHanlder = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = position.value;
    },
    onActive: (e, ctx) => {
      const currentPosition = ctx.startX + e.translationX;
      const { startX, translationX } = ctx;

      for (let i = 0; i < snappingRanges.length; i++) {
        const snapRange = snappingRanges[i];
        if (currentPosition < snapRange) {
          position.value = partsArr[i];
          return;
        }
      }

      if (startX + translationX < 0) {
        position.value = 0;
      } else if (startX + translationX > sliderWidth - THUMB_WIDTH) {
        position.value = sliderWidth - THUMB_WIDTH;
      }
    },
    onEnd: () => {
      const currentPosition = position.value;
      const index = partsArr.findIndex((element) => {
        return currentPosition === element;
      });

      runOnJS(onValueChange)(name, startFromZero ? index : index + 1);
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
    backgroundColor: position.value > 0 ? 'transparent' : 'black'
  }));

  /// Number

  const AnimatedNumberProps = useAnimatedProps(() => {
    const currentPosition = position.value;
    const index = partsArr.findIndex((element) => {
      return currentPosition === element;
    });

    return {
      text: `${startFromZero ? index : index + 1}`
    } as Partial<AnimateProps<TextInputProps>>;
  });

  /// Text

  const AnimatedTextProps = useAnimatedProps(() => {
    if (!subTitle) return { text: '' } as Partial<AnimateProps<TextInputProps>>;
    const currentPosition = position.value;
    const index = partsArr.findIndex((element) => {
      return currentPosition === element;
    });

    return {
      text: subTitle[startFromZero ? index : index + 1]
    } as Partial<AnimateProps<TextInputProps>>;
  });

  /// Slider Front View

  const AnimatedViewProps = useAnimatedProps(() => {
    const currentPosition = position.value;

    const width = (1 - (currentPosition + 10) / sliderWidth) * 100;

    return {
      width: `${width}%`
    };
  });

  return (
    <View>
      <View style={styles.topContainer}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subTitle && (
            <AnimatedText
              style={styles.text}
              animatedProps={AnimatedTextProps}
            />
          )}
        </View>
        <AnimatedNumber
          style={styles.numberText}
          animatedProps={AnimatedNumberProps}
        />
      </View>
      <View style={[styles.slider, { width: sliderWidth }]}>
        <LinearGradientView
          style={{ ...styles.sliderBack, width: sliderWidth }}
          linearGradient={{ x2: '100%' }}
          colors={[
            { offset: 0, color: '#FFA658' },
            { offset: 1, color: '#E6254F' }
          ]}
        >
          <AnimatedView style={[styles.sliderFront, AnimatedViewProps]} />
        </LinearGradientView>
        <PanGestureHandler onGestureEvent={gestureHanlder}>
          <Animated.View style={[styles.thumb, animatedStyle]} />
        </PanGestureHandler>
      </View>
    </View>
  );
};

export default RangeSlider;

const styles = StyleSheet.create({
  numberText: {
    color: variables.textBlack,
    fontFamily: variables.mainFontSemiBold,
    fontSize: 40
  },
  slider: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  sliderBack: {
    borderRadius: 20,
    height: 12,
    overflow: 'hidden',
    width: '100%'
  },
  sliderFront: {
    backgroundColor: variables.white,
    height: 12,
    position: 'absolute',
    right: 0,
    transform: [{ translateX: 11 }],
    width: '100%'
  },
  text: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 14
  },
  thumb: {
    borderColor: 'white',
    borderRadius: 16,
    borderWidth: 11,
    height: THUMB_WIDTH,
    left: -0,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: THUMB_WIDTH
  },
  title: {
    color: variables.textBlack,
    fontFamily: variables.mainFontSemiBold,
    fontSize: 16,
    marginBottom: 4
  },

  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 35
  }
});
