import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { variables } from '../../utils/mixins';
import { Icon } from '../icon/icon';

type Props = {
  label: string;
  value: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
};

const CheckBox = ({ label, value, onChange, disabled }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={0.6}
        style={styles.checkbox}
        onPress={() => onChange(!value)}
      >
        <Icon
          style={{ color: disabled ? variables.grey2 : variables.red }}
          icon={value ? 'checkbox_checked' : 'checkbox_unchecked'}
        />
      </TouchableOpacity>
      <Text
        style={{
          ...styles.label,
          color: disabled ? variables.grey2 : variables.textBlack
        }}
      >
        {label}
      </Text>
    </View>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  checkbox: {
    marginRight: 9
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  label: {
    fontFamily: variables.mainFontMedium,
    fontSize: 16
  }
});
