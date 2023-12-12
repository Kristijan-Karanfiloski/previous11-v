import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { variables } from '../../utils/mixins';

interface InfoCellProps {
  title: string;
  subTitle: string;
  children?: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subTitleStyle?: TextStyle;
}

const InfoCell = (props: InfoCellProps) => {
  const { title, subTitle, containerStyle, titleStyle, subTitleStyle } = props;
  return (
    <View style={[styles.container, containerStyle]}>
      <View>
        <Text numberOfLines={1} style={[styles.title, titleStyle]}>
          {title}
        </Text>
        <Text style={[styles.subTitle, subTitleStyle]}>{subTitle}</Text>
      </View>
      {props.children}
    </View>
  );
};

export default InfoCell;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  subTitle: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 5
  },
  title: {
    color: variables.grey,
    fontFamily: variables.mainFontSemiBold,
    fontSize: 16,
    lineHeight: 22,
    maxWidth: 250
  }
});
