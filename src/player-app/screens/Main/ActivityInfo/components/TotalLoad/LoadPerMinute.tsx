import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../../../../../../utils/mixins';

type Props = {
  load: string;
};

const LoadPerMinute = ({ load }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textPrimary}>{load}</Text>
      <Text style={styles.textSecondary}>Load / minute</Text>
    </View>
  );
};

export default LoadPerMinute;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginBottom: 22
  },
  textPrimary: {
    fontFamily: variables.mainFont,
    fontSize: 18,
    marginRight: 8
  },
  textSecondary: {
    fontFamily: variables.mainFontLight,
    fontSize: 10,
    marginBottom: 3.5
  }
});
