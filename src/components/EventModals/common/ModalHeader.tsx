import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { variables } from '../../../utils/mixins';
import { Icon } from '../../icon/icon';

interface Props {
  heading: string;
}

const ModalHeader = ({ heading }: Props) => {
  const navigation = useNavigation();

  const iconPress = () => {
    return navigation.goBack();
  };

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={styles.closeContainer} onPress={iconPress}>
        <Icon icon="close" style={styles.closeIcon} />
      </TouchableOpacity>
      <View style={styles.dropdownIconContainer}>
        <View style={styles.dropdownIcon} />
      </View>
      <Text style={styles.headerText}>{heading}</Text>
    </View>
  );
};

export default ModalHeader;

const styles = StyleSheet.create({
  closeContainer: {
    padding: 10,
    position: 'absolute',
    right: 15,
    top: 10,
    zIndex: 1
  },
  closeIcon: {
    fill: variables.red,
    height: 25,
    width: 25
  },
  dropdownIcon: {
    backgroundColor: variables.grey2,
    borderRadius: 25,
    height: 5,
    width: 70
  },
  dropdownIconContainer: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center'
  },
  headerText: {
    fontFamily: variables.mainFont,
    fontSize: 20,
    marginBottom: 25,
    textAlign: 'center'
  },
  mainContainer: {
    backgroundColor: variables.realWhite,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 14,
    marginTop: '-2%',
    width: '100%'
  }
});
