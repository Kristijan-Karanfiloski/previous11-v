import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { color } from '../../../../../theme';
import { variables } from '../../../../../utils/mixins';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const CardContainer = ({ children, style }: Props) => {
  const mainStyle = style
    ? { ...styles.container, ...style }
    : styles.container;
  return <View style={mainStyle}>{children}</View>;
};

export default CardContainer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: variables.realWhite,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 27,
    shadowColor: color.palette.realBlack,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 4
  }
});
