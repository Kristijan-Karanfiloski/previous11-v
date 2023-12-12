import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { variables } from '../../../utils/mixins';
import { Icon } from '../../icon/icon';

type Props = {
  text: string;
  onPress: () => void;
};

export default function ArrowButton({ text, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.continer}>
      <Text style={styles.text}>{text}</Text>
      <Icon icon="next" style={styles.arrowIcon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  arrowIcon: {
    fill: variables.red,
    marginTop: 2
  },
  continer: { alignItems: 'center', flexDirection: 'row' },
  text: {
    color: variables.red,
    fontFamily: variables.mainFontMedium,
    fontSize: 16
  }
});
