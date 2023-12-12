import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import { color } from '../../theme';
import { variables } from '../../utils/mixins';

interface ToggleButtonProps {
  onClick: () => void;
  isActive?: boolean;
  position?: 'left' | 'right';
  content: string;
}

const ToggleButton = (props: ToggleButtonProps) => {
  const { position, isActive, onClick = () => {}, content } = props;
  let buttonPosition = {};
  if (position === 'left') {
    buttonPosition = styles.toggleButtonLeft;
  } else if (position === 'right') {
    buttonPosition = styles.toggleButtonRight;
  }
  const activeClass = styles.toggleButtonActive;
  const activeTextClass = styles.toggleButtonTextActive;
  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View
        style={[
          styles.toggleButton,
          buttonPosition,
          isActive ? activeClass : {}
        ]}
      >
        <Text
          style={[styles.toggleButtonText, isActive ? activeTextClass : {}]}
        >
          {content}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ToggleButton;

const styles = StyleSheet.create({
  toggleButton: {
    alignItems: 'center',
    backgroundColor: color.transparent,
    borderBottomWidth: 1,
    borderColor: color.palette.realWhite,
    borderTopWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 152
  },
  toggleButtonActive: {
    backgroundColor: color.palette.realWhite,
    borderRadius: 2,
    borderWidth: 1
  },
  toggleButtonLeft: {
    borderBottomLeftRadius: 2,
    borderLeftWidth: 1,
    borderTopLeftRadius: 2
  },
  toggleButtonRight: {
    borderBottomRightRadius: 2,
    borderRightWidth: 1,
    borderTopRightRadius: 2
  },
  toggleButtonText: {
    color: color.palette.tipGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 14
  },
  toggleButtonTextActive: {
    color: color.palette.black2
  }
});
