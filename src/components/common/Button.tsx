import React from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { color } from '../../theme/color';
import { variables } from '../../utils/mixins';

interface ButtonProps {
  onPressed: (cb: any) => void;
  mode?: 'primary' | 'white' | 'outline' | null;
  customStyle?: any;
  disabled?: boolean;
  content: string;
  id?: string;
  marginStyle?: any;
}

const Button = (props: ButtonProps) => {
  const { mode, content, id, onPressed, customStyle, marginStyle, disabled } =
    props;
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.8}
      onPress={() => {
        Keyboard.dismiss();
        onPressed && onPressed(id);
      }}
    >
      <Text
        style={[
          styles.textStyle,
          marginStyle,
          mode === 'white'
            ? styles.whiteMode
            : mode === 'outline'
              ? styles.outlineMode
              : styles.primaryMode,
          customStyle,
          disabled
            ? mode === 'white'
              ? styles.whiteDisabled
              : styles.blueDisabled
            : {}
        ]}
      >
        {content}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  blueDisabled: {
    backgroundColor: variables.darkGrey,
    color: variables.white
  },
  outlineMode: {
    backgroundColor: variables.transparent,
    borderColor: color.primary,
    borderRadius: 4,
    borderWidth: 1,
    color: color.primary,
    minWidth: 146
  },
  primaryMode: {
    backgroundColor: color.primary,
    borderRadius: 4,
    color: variables.white,
    minWidth: 146,
    overflow: 'hidden',
    paddingHorizontal: 26
  },
  textStyle: {
    fontFamily: variables.mainFont,
    fontSize: 16,
    justifyContent: 'center',
    paddingVertical: 14,
    textAlign: 'center'
  },
  whiteDisabled: {
    borderColor: variables.lighterGrey,
    color: variables.lighterGrey
  },
  whiteMode: {
    backgroundColor: variables.transparent,
    color: color.primary
  }
});
