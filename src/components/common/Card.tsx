import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { variables } from '../../utils/mixins';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Card = (props: CardProps) => {
  const { style } = props;
  return <View style={[styles.card, style]}>{props.children}</View>;
};

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: variables.white,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 20
  }
});
