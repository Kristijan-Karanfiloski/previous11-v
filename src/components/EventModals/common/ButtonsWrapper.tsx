import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { variables } from '../../../utils/mixins';

interface Props {
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
  disabledButtons: boolean;
  isRepeatActivated: boolean;
}

const ButtonsWrapper = ({
  onPrimaryClick,
  onSecondaryClick,
  disabledButtons,
  isRepeatActivated
}: Props) => {
  const secondBtnStyles = StyleSheet.flatten([
    styles.button,
    disabledButtons ? styles.secondaryDisabled : styles.secondary
  ]);
  const secondBtnTextStyles = StyleSheet.flatten([
    styles.buttonText,
    disabledButtons
      ? styles.buttonSecondaryTextDisabled
      : styles.buttonSecondaryText
  ]);

  const mainBtnStyles = StyleSheet.flatten([
    styles.button,
    disabledButtons || isRepeatActivated
      ? styles.primaryDisabled
      : styles.primary
  ]);
  const mainBtnTextStyles = StyleSheet.flatten([
    styles.buttonText,
    styles.buttonPrimaryText
  ]);

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={secondBtnStyles}
        onPress={onSecondaryClick}
        disabled={disabledButtons}
      >
        <Text style={secondBtnTextStyles}>Save & Close</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={mainBtnStyles}
        onPress={onPrimaryClick}
        disabled={disabledButtons || isRepeatActivated}
      >
        <Text style={mainBtnTextStyles}>Start Event</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonsWrapper;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 10,
    height: 39,
    justifyContent: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 35
  },
  buttonPrimaryText: {
    color: variables.realWhite
  },
  buttonSecondaryText: {
    color: variables.red
  },
  buttonSecondaryTextDisabled: {
    color: variables.chartLightGrey
  },
  buttonText: {
    fontFamily: variables.mainFontMedium,
    fontSize: 16
  },
  mainContainer: {
    alignItems: 'center',
    backgroundColor: variables.realWhite,
    flexDirection: 'row',
    height: 82,
    justifyContent: 'center',
    width: '100%'
  },
  primary: {
    backgroundColor: variables.red
  },
  primaryDisabled: {
    backgroundColor: variables.chartLightGrey
  },
  secondary: {
    backgroundColor: variables.realWhite,
    borderColor: variables.red,
    borderWidth: 1
  },
  secondaryDisabled: {
    backgroundColor: variables.realWhite,
    borderColor: variables.chartLightGrey,
    borderWidth: 1
  }
});
