import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { variables } from '../../../utils/mixins';

type Props = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
  inputProps?: TextInput['props'];
};

const ScoreInputCell = ({
  label,
  value,
  onChange,
  maxLength,
  inputProps
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={styles.scoreWrapper}>
      <TextInput
        value={value}
        style={styles.input}
        placeholder="-"
        keyboardType="number-pad"
        selectionColor={variables.red}
        onChangeText={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={isFocused ? variables.red : variables.lighterGrey}
        maxLength={maxLength}
        {...inputProps}
      />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

export default ScoreInputCell;

const styles = StyleSheet.create({
  input: {
    color: variables.red,
    fontFamily: variables.mainFontMedium,
    fontSize: 64,
    marginBottom: 10
  },
  scoreWrapper: {
    alignItems: 'center',
    width: 80
  },
  text: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 16,
    marginBottom: 9,
    textAlign: 'center'
  }
});
