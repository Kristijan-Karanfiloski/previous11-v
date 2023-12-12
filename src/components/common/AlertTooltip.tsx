import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../../utils/mixins';

interface AlertTooltipProps {
  text: string;
}

const AlertTooltip = ({ text }: AlertTooltipProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.alertText}>{text}</Text>
    </View>
  );
};

export default AlertTooltip;

const styles = StyleSheet.create({
  alertText: {
    color: variables.realWhite,
    fontFamily: variables.mainFontBold,
    fontSize: 18,
    textAlign: 'center'
  },
  container: {
    backgroundColor: variables.grey,
    borderRadius: 4,
    bottom: 20,
    height: 50,
    justifyContent: 'center',
    left: '50%',
    position: 'absolute',
    transform: [{ translateX: -250 }],
    width: 500
  }
});
