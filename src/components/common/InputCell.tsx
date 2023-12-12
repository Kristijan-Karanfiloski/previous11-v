import React from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import _ from 'lodash';

import { palette } from '../../theme';
import { variables } from '../../utils/mixins';
import { Icon } from '../icon/icon';

interface InputCellProps {
  style?: ViewStyle;
  title?: string;
  onTextInput?: (text: string) => void;
  onBlur?: () => void;
  value?: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  disabled?: boolean;
  child?: React.ReactNode;
  inputStyle?: ViewStyle;
  secureTextEntry?: boolean;
  onToggleSecureText?: () => void;
  isPassword?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  autoCapitalize?: 'characters' | 'words' | 'sentences' | 'none';
}

const InputCell = ({
  style,
  title,
  onTextInput,
  onBlur,
  value,
  placeholder,
  keyboardType,
  disabled,
  child,
  inputStyle,
  isPassword,
  secureTextEntry = false,
  onToggleSecureText,
  maxLength,
  autoFocus,
  autoCapitalize = 'sentences'
}: InputCellProps) => {
  return (
    <View style={[{ marginTop: 16 }, style]}>
      {title && <Text style={styles.subTitle}>{title}</Text>}
      <View style={[styles.cellContent, inputStyle]}>
        <TextInput
          autoCapitalize={autoCapitalize}
          autoFocus={autoFocus}
          value={value}
          editable={!disabled}
          onChangeText={_.throttle((text) => {
            onTextInput && onTextInput(text);
          }, 200)}
          keyboardType={keyboardType || 'default'}
          style={[
            styles.inputContent,
            isPassword && styles.inputContentPassword
          ]}
          onBlur={_.throttle(() => {
            onBlur && onBlur();
          })}
          placeholderTextColor={variables.lightGrey}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          autoCorrect={false}
          maxLength={maxLength}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.icon}
            onPress={() => onToggleSecureText && onToggleSecureText()}
          >
            <Icon icon={!secureTextEntry ? 'eye_open' : 'eye_close'} />
          </TouchableOpacity>
        )}
      </View>
      {child}
    </View>
  );
};

export default InputCell;

const styles = StyleSheet.create({
  cellContent: {
    borderColor: palette.lighterGrey,
    borderRadius: 4,
    borderWidth: 1,
    paddingLeft: 16,
    paddingVertical: 12
  },
  icon: {
    position: 'absolute',
    right: 16,
    top: 0,
    transform: [{ translateY: 12 }]
  },
  inputContent: {
    color: palette.black2,
    fontFamily: variables.mainFont,
    fontSize: 16,
    width: '100%'
  },
  inputContentPassword: {
    width: '95%'
  },
  subTitle: {
    color: variables.grey,
    fontFamily: variables.mainFontSemiBold,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10
  }
});
