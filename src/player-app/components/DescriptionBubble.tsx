import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '../../components/icon/icon';
import { IconTypes } from '../../components/icon/icons';
import { variables } from '../../utils/mixins';

type Props = {
  text: string;
  icon: IconTypes;
};

const DescriptionBubble = ({ text, icon }: Props) => {
  const renderIcon = () => {
    const iconColor = icon === 'info_icon' ? '#606060' : '';
    return (
      <Icon
        style={{ height: 12, width: 12, color: iconColor }}
        containerStyle={{ height: 12, width: 12, marginRight: 7 }}
        icon={icon}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderIcon()}
      <Text style={styles.description}>{text}</Text>
    </View>
  );
};

export default DescriptionBubble;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: variables.white,
    borderRadius: 8,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  description: {
    color: variables.black,
    flex: 1,
    fontFamily: variables.mainFontLight,
    fontSize: 10
  }
});
