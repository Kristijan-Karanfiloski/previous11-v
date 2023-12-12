import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

import { Player } from '../../types';
import { ACUTE_CHRONIC_OPTIONS, variables } from '../utils/mixins';

import LinearGradientView from './LinearGradientView';

interface AcuteChronicRowProps {
  player: Player;
  currentLoad: number;
  prevLoad: number;
}

const windowWidth = Dimensions.get('window').width;
const CHART_WIDTH =
  windowWidth -
  (ACUTE_CHRONIC_OPTIONS.CARD_PADDING +
    ACUTE_CHRONIC_OPTIONS.CONTAINER_PADDING) *
    2 -
  ACUTE_CHRONIC_OPTIONS.RATIO_WIDTH;
const CELL_WIDTH = CHART_WIDTH / ACUTE_CHRONIC_OPTIONS.NUM_ITEMS;
const listItems = Array.from({ length: ACUTE_CHRONIC_OPTIONS.NUM_ITEMS });

const AcuteChronicRow = ({
  currentLoad,
  prevLoad,
  player
}: AcuteChronicRowProps) => {
  const widthAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  const calculationLoad = useMemo(() => {
    return {
      acuteLoad: currentLoad,
      chronicLoad: prevLoad,
      acuteChronicRatio:
        currentLoad === 0 || prevLoad === 0 ? 0 : currentLoad / prevLoad
    };
  }, [currentLoad, prevLoad]);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(widthAnimation, {
          toValue:
            (calculationLoad.acuteChronicRatio / 1.79) * 100 > 100
              ? 102
              : (calculationLoad.acuteChronicRatio / 1.79) * 100,
          duration: 1000,
          useNativeDriver: false
        }),
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    ]).start();
  }, [calculationLoad.acuteChronicRatio]);

  const animatedStyle = useMemo(
    () => ({
      width: widthAnimation.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%']
      }),
      opacity: opacityAnimation
    }),
    []
  );

  const renderLinearGradient = useCallback(
    () => (
      <LinearGradientView
        linearGradient={{ x1: '0%', y1: '0%', x2: '100%', y2: '0%' }}
        colors={[
          { offset: 0, color: '#58FFAECC', opacity: 0.8 },
          { offset: 0.33, color: '#21F90F' },
          { offset: 0.66, color: '#2CFA2C' },
          { offset: 1, color: '#58FFAECC', opacity: 0.8 }
        ]}
        style={styles.linearGradient}
        rectOpacity={0.5}
      />
    ),
    []
  );

  if (!player) return null;

  const calculatedAcuteChronic =
    Math.round(calculationLoad.acuteLoad) -
    Math.round(calculationLoad.chronicLoad);

  return (
    <View style={styles.itemContainer}>
      <View style={styles.rowChart}>
        {renderLinearGradient()}
        {listItems.map((_, i) => (
          <View key={i} style={styles.rowChartLine} />
        ))}
        <Animated.View
          style={[
            styles.rect,
            {
              width: animatedStyle.width
            }
          ]}
        >
          <Animated.Text
            style={{
              color: variables.realWhite,
              opacity: animatedStyle.opacity,
              fontSize: 12,
              fontFamily: variables.mainFontMedium
            }}
          >
            {`${player?.tShirtNumber || '/'}. ${player.name}`}
          </Animated.Text>
          <Animated.Text
            style={{
              color: variables.realWhite,
              opacity: animatedStyle.opacity,
              fontSize: 12,
              fontFamily: variables.mainFontMedium
            }}
          >
            {calculationLoad.acuteChronicRatio.toFixed(2)}
          </Animated.Text>
        </Animated.View>
        {/* {renderRatioLine()} */}
      </View>
      <View style={styles.acRatio}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: variables.mainFontMedium
          }}
        >
          A {calculationLoad.acuteLoad.toFixed(0)} :{' '}
          <Text style={{ color: variables.greyC3 }}>
            C {calculationLoad.chronicLoad.toFixed(0)}
          </Text>
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: variables.mainFontMedium
          }}
        >
          {calculatedAcuteChronic < 0 && calculatedAcuteChronic > -0.5
            ? 0
            : calculatedAcuteChronic.toFixed(0)}
        </Text>
      </View>
    </View>
  );
};

export default AcuteChronicRow;

const styles = StyleSheet.create({
  acRatio: {
    alignItems: 'center',
    borderColor: variables.white,
    borderRightWidth: 1,
    justifyContent: 'center',
    width: ACUTE_CHRONIC_OPTIONS.RATIO_WIDTH
  },
  itemContainer: {
    borderColor: variables.white,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 46,
    justifyContent: 'flex-start'
  },
  linearGradient: {
    height: 46,
    left: CELL_WIDTH * 8,
    opacity: 0.5,
    position: 'absolute',
    width: CELL_WIDTH * 5.4
  },
  rect: {
    alignItems: 'center',
    backgroundColor: variables.textBlack,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    height: 24,
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    position: 'absolute',
    top: 11
  },
  rowChart: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative'
  },
  rowChartLine: {
    borderColor: variables.white,
    borderStyle: 'dashed',
    borderWidth: 1,
    height: 46,
    marginRight: CELL_WIDTH,
    width: 1
  }
});
