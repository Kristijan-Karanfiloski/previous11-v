import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as Svg from 'react-native-svg';

import { variables } from '../../../utils/mixins';
import { Icon } from '../../icon/icon';

interface OnboardingProgressCircleProps {
  percentage: number;
  checkmark?: boolean;
}

const OnboardingProgressCircle = ({
  percentage,
  checkmark = false
}: OnboardingProgressCircleProps) => {
  const strokeWidth = 4;
  const size = 70;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 2;
  const dash = (percentage * circumference) / 100;

  return (
    <View style={styles.mainContainer}>
      {checkmark
        ? (
        <View style={styles.checkmarkContainer}>
          <Icon icon="check" style={styles.icon} />
        </View>
          )
        : (
        <View style={styles.iconContainer}>
          <Icon icon="arrow_next" style={styles.icon} />
        </View>
          )}
      <Svg.Svg height={size} width={size}>
        <Svg.Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={variables.lightestGrey}
          strokeWidth={strokeWidth}
        />
        <Svg.Circle
          cx={size / 2}
          cy={size / 2}
          r={radius - 12}
          fill={variables.red}
          stroke="none"
        />
        <Svg.Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={variables.red}
          strokeWidth={strokeWidth}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeDasharray={[dash, circumference - dash]}
          strokeLinecap="round"
        />
      </Svg.Svg>
    </View>
  );
};

export default OnboardingProgressCircle;

const styles = StyleSheet.create({
  checkmarkContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 2
  },
  icon: {
    color: 'white',
    height: 15,
    width: 15
  },
  iconContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 2
  },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  }
});
