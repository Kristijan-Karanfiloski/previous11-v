import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle
} from 'react-native';

import { variables } from '../../utils/mixins';

import OverlayLoader from './OverlayLoader';

type Props = {
  text: string;
  onPress: (params?: any) => void;
  disabled?: boolean;
  mode?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
  isLoading?: boolean;
  testID?: string;
};

// Tuka dodadov testID prop bidejki e reusable komponenta za da moze vo activation po toj test id da baram vo testot za detox

export default function ButtonNew({
  text,
  mode = 'primary',
  onPress,
  disabled,
  style,
  textStyle,
  isLoading,
  testID
}: Props) {
  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.8}
      style={[
        styles.container,
        mode === 'primary' ? styles.modePrimary : styles.modeScendary,
        style && style,
        disabled && styles.disabled
      ]}
      disabled={disabled || isLoading}
      onPress={onPress}
    >
      {!isLoading ? (
        <Text
          style={[
            styles.text,
            mode === 'primary' ? styles.textPrimary : styles.textSecondary,
            textStyle && textStyle,
            disabled && styles.textDisabled
          ]}
        >
          {text}
        </Text>
      ) : (
        <OverlayLoader isLoading isOverlay={false} size="small" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    width: 182
  },
  disabled: {
    backgroundColor: variables.lightGrey,
    borderColor: variables.lightGrey
  },
  modePrimary: {
    backgroundColor: variables.red
  },
  modeScendary: {
    backgroundColor: 'transparent',
    borderColor: variables.red,
    borderWidth: 1
  },
  text: {
    fontFamily: variables.mainFontMedium,
    fontSize: 16
  },
  textDisabled: {
    color: variables.realWhite
  },
  textPrimary: {
    color: variables.realWhite,
    fontFamily: variables.mainFontMedium,
    fontSize: 16
  },
  textSecondary: {
    color: variables.red,
    fontFamily: variables.mainFontMedium,
    fontSize: 16
  }
});
