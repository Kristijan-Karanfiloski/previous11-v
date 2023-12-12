import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Icon } from '../../components/icon/icon';
import { variables } from '../../utils/mixins';

type Props = {
  onPress: () => void;
  label: string;
  text: string;
};

const Button = ({ onPress, label, text }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
      <Icon style={{ height: 14 }} icon="arrow_right_grey" />
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: variables.lightestGrey,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    height: 63,
    justifyContent: 'space-between',
    paddingHorizontal: 11,
    paddingVertical: 12
  },
  label: {
    color: variables.grey2,
    fontFamily: variables.mainFontLight,
    fontSize: 10,
    marginBottom: 4,
    textTransform: 'uppercase'
  },
  text: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 14,
    textTransform: 'uppercase'
  }
});
