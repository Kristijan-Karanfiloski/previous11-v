import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { DrawerStackParamList } from '../../types';
import { variables } from '../../utils/mixins';

import ButtonNew from './ButtonNew';
import Card from './Card';
import FullScreenDialog from './FullScreenDialog';

const NetworkErrorModal = () => {
  const route = useRoute() as RouteProp<
    DrawerStackParamList,
    'NetworkErrorModal'
  >;
  const title = route.params.title;
  const text = route.params.text;
  const navigation = useNavigation();
  const btnPress = () => {
    navigation.goBack();
  };

  return (
    <FullScreenDialog style={styles.modalContainer}>
      <Card>
        <View style={[styles.contnet, styles.borderBottom]}>
          <Text style={styles.text}>{title}</Text>
        </View>
        <View style={[styles.subContnet, styles.borderBottom]}>
          <Text style={[styles.subText, styles.marginBottom]}>
            It looks like you’re not connected to the internet.
          </Text>
          <Text style={styles.subText}>{text}</Text>
        </View>
        <View style={[styles.buttons, styles.marginVertical]}>
          <ButtonNew onPress={btnPress} text="OK" />
        </View>
      </Card>
    </FullScreenDialog>
  );
};

export default NetworkErrorModal;

const styles = StyleSheet.create({
  borderBottom: {
    borderBottomColor: variables.lightestGrey,
    borderBottomWidth: 1
  },
  buttons: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  contnet: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 15,
    width: 440
  },
  marginBottom: { marginBottom: 20 },
  marginVertical: { marginVertical: 20 },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  subContnet: {
    justifyContent: 'center',
    padding: 40,
    width: 440
  },
  subText: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 16,
    textAlign: 'center'
  },
  text: {
    fontFamily: variables.mainFontSemiBold,
    fontSize: 24,
    marginBottom: 9
  }
});
