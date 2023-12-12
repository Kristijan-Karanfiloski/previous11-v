import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Icon } from '../../components/icon/icon';
import { variables } from '../../utils/mixins';

type Props = {
  text: string;
  onPress: () => undefined;
};

const BackButton = ({ text, onPress }: Props) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Icon style={styles.icon} icon="arrow_left_weekly_load" />
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 14
  },
  icon: {
    color: variables.textBlack,
    height: 11,
    marginBottom: 1,
    marginRight: 5
  },
  text: {
    fontFamily: variables.mainFontBold,
    fontSize: 12,
    textTransform: 'uppercase'
  }
});
