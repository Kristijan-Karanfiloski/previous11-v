import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { useAppSelector } from '../../../redux/store';
import { variables } from '../../../utils/mixins';
import { Icon } from '../../icon/icon';
import ButtonNew from '../ButtonNew';

interface NotificationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const NotificationModal = ({
  isVisible,
  onClose,
  onSubmit
}: NotificationModalProps) => {
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub?.gameType === 'hockey';
  //! added ? after activeClub for problem with testing

  // added testID to test the modal and best practice is adding testID to the most outer view inside the modal and not on the modal

  return (
    <Modal isVisible={isVisible} animationIn="fadeIn" animationOut="fadeOut">
      /
      <View testID="NotificationModal" style={styles.modalContainer}>
        <Icon
          icon={isHockey ? 'boot_and_puck' : 'boot_and_ball'}
          style={{ marginBottom: 30 }}
        />

        <Text
          style={{
            fontSize: 22,
            fontFamily: variables.mainFontBold,
            textAlign: 'center',
            marginBottom: 20
          }}
        >
          Stay on top of new tracking data - get notified!
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontFamily: variables.mainFont,
            textAlign: 'center',
            color: variables.grey2,
            marginBottom: 50
          }}
        >
          Please allow us to send notifications when new tracking data is
          available
        </Text>

        <View style={{ width: '100%', marginTop: 'auto' }}>
          <ButtonNew
            testID="NotificationModalAllowButton"
            text="Allow"
            onPress={onSubmit}
            style={{
              width: '100%',
              marginBottom: 20
            }}
          />

          <ButtonNew
            testID="NotificationModalSkipForNowButton"
            text="Skip for now"
            onPress={onClose}
            mode="secondary"
            style={{
              width: '100%'
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default NotificationModal;

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 40,
    width: variables.deviceWidth * 0.89
  }
});
