import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../../../utils/mixins';
import { Icon } from '../../icon/icon';

interface OnboardingStepItemProps {
  step: { id: number; text: string; isFinished: boolean; isNext: boolean };
}

const OnboardingStepItem = ({ step }: OnboardingStepItemProps) => {
  return (
    <View key={step.id} style={styles.mainContainer}>
      <View
        style={
          !step.isFinished && !step.isNext
            ? styles.numberContainerGrey
            : styles.numberContainer
        }
      >
        <Text
          style={
            !step.isFinished && !step.isNext ? styles.numberGrey : styles.number
          }
        >
          {step.id}
        </Text>
      </View>
      <View style={[styles.textContainer, step.isNext && styles.shadow]}>
        <Text
          style={[
            styles.text,
            !step.isFinished && !step.isNext && styles.notFinishedText
          ]}
        >
          {step.text}
        </Text>
        {step.isNext && <Icon style={styles.arrow} icon="arrow_next" />}
        {step.isFinished && <Icon style={styles.checkmark} icon="checkmark" />}
      </View>
    </View>
  );
};

export default OnboardingStepItem;

const styles = StyleSheet.create({
  arrow: {
    color: variables.black,
    height: 11,
    marginLeft: 34,
    width: 7
  },
  checkmark: { marginLeft: 34 },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 60
  },
  notFinishedText: {
    opacity: 0.4
  },
  number: {
    color: variables.realWhite,
    fontFamily: variables.mainFontBold,
    fontSize: 14
  },
  numberContainer: {
    alignItems: 'center',
    backgroundColor: variables.red,
    borderRadius: 20,
    height: 20,
    justifyContent: 'center',
    left: -20,
    position: 'absolute',
    width: 20
  },
  numberContainerGrey: {
    alignItems: 'center',
    backgroundColor: variables.chartLightGrey,
    borderRadius: 20,
    height: 20,
    justifyContent: 'center',
    left: -20,
    position: 'absolute',
    width: 20
  },
  numberGrey: {
    color: variables.grey2,
    fontFamily: variables.mainFontBold,
    fontSize: 14
  },
  shadow: {
    backgroundColor: variables.realWhite,
    borderRadius: 12,
    shadowColor: variables.black,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 20
  },
  text: {
    fontFamily: variables.mainFont,
    fontSize: 14
  },
  textContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
    marginLeft: 10,
    padding: 10,
    width: '100%'
  }
});
