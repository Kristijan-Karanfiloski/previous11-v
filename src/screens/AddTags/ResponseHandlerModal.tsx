import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';

import ButtonNew from '../../components/common/ButtonNew';
import { Icon } from '../../components/icon/icon';
import { variables } from '../../utils/mixins';

type Props = {
  success: boolean;
  close: () => void;
};

const ResponseHandlerModal = ({ success, close }: Props) => {
  const navigation = useNavigation();

  const modalText = {
    success: {
      primary: 'Tag(s) Added Succesfully',
      secondary: 'The tag(s) was correctly added to your team kit.'
    },
    fail: {
      primary: 'Something went wrong',
      secondary:
        'Please verify your internet connection and ensure that the correct tag ID has been entered.\n Afterwards, please try adding the tag once more. '
    }
  };

  const closeModal = () => {
    close();
    if (success) {
      navigation.goBack();
    }
  };

  return (
    <Modal
      isVisible={true}
      onBackdropPress={() => null}
      animationIn="fadeIn"
      style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <View style={{ ...styles.container, height: success ? 370 : 300 }}>
        <Icon
          icon="circle_checkmark"
          style={{
            color: variables.matchGreen,
            height: 65,
            width: 65,
            marginBottom: 40,
            alignSelf: 'center'
          }}
        />
        <Text style={styles.textPrimary}>
          {success ? modalText.success.primary : modalText.fail.primary}
        </Text>
        <Text style={styles.textSecondary}>
          {success ? modalText.success.secondary : modalText.fail.secondary}
        </Text>
        <ButtonNew
          style={{ marginTop: 'auto', alignSelf: 'center' }}
          mode="primary"
          onPress={closeModal}
          text="Ok"
        />
      </View>
    </Modal>
  );
};

export default ResponseHandlerModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: variables.white,
    borderRadius: 20,
    height: 370,
    padding: 30,
    width: 470
  },
  textPrimary: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 20,
    marginBottom: 35,
    textAlign: 'center'
  },
  textSecondary: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    textAlign: 'center'
  }
});
