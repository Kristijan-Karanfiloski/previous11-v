import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import { variables } from '../../../utils/mixins';
import ButtonNew from '../../common/ButtonNew';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onDelete: () => void;
};

const DeleteDrillModal = ({ visible, onCancel, onDelete }: Props) => {
  return (
    <Modal
      animationIn="fadeIn"
      isVisible={visible}
      style={{ justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Delete drill?</Text>
        <Text style={styles.text}>
          Are you sure you want to delete this drill?
        </Text>
        <View style={styles.buttons}>
          <ButtonNew
            style={styles.button}
            mode="secondary"
            text="Cancel"
            onPress={onCancel}
          />
          <ButtonNew text="Delete" onPress={onDelete} />
        </View>
      </View>
    </Modal>
  );
};

export default DeleteDrillModal;

const styles = StyleSheet.create({
  button: { marginRight: 20 },
  buttons: { flexDirection: 'row', marginTop: 80 },
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: 470
  },
  text: { color: variables.textBlack, fontFamily: variables.mainFontMedium },
  title: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 20,
    marginBottom: 40
  }
});
