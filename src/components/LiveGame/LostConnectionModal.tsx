import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { GameAny, StatusMatch } from '../../../types';
import { SocketContext } from '../../hooks/socketContext';
import { updateTrackingEvent } from '../../redux/slices/trackingEventSlice';
import { useAppDispatch } from '../../redux/store';
import { DrawerStackParamList } from '../../types';
import { variables } from '../../utils/mixins';
import ButtonNew from '../common/ButtonNew';
import Card from '../common/Card';
import ModalContainer from '../common/Modals/ModalContainer';
import OverlayLoader from '../common/OverlayLoader';
import { Icon } from '../icon/icon';

import EndLiveEventStepThree from './EndLiveEventModal/EndLiveEventStepThree';

interface LostConnectionModalProps {
  activeEvent?: GameAny;
  btnPressWhenDisconnected?: boolean;
  handleBtnPressWhenDisconnected?: () => void;
}

const LostConnectionModal = ({
  activeEvent,
  btnPressWhenDisconnected,
  handleBtnPressWhenDisconnected
}: LostConnectionModalProps) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { params } = useRoute() as RouteProp<
    DrawerStackParamList,
    'LostConnectionModal'
  >;

  const { isReady, edgeConnected } = useContext(SocketContext);
  const [showNav, setShowNav] = useState(false);
  const [showLostConnectionModal, setShowLostConnectionModal] = useState(false);
  const showModalTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isDisconnected = useMemo(() => {
    return !isReady || !edgeConnected;
  }, [isReady, edgeConnected]);

  // if 10 seconds passed after disconnect, show modal
  useEffect(() => {
    if (isDisconnected) {
      showModalTimeoutRef.current = setTimeout(() => {
        setShowLostConnectionModal(true);
      }, 10000);
    } else {
      showModalTimeoutRef.current && clearTimeout(showModalTimeoutRef.current);
      setShowLostConnectionModal(false);
      if (params?.isStartingEvent) {
        navigation.goBack();
      }
    }
  }, [isDisconnected]);

  useEffect(() => {
    if (btnPressWhenDisconnected && !showLostConnectionModal) {
      setShowLostConnectionModal(true);
    }
  }, [btnPressWhenDisconnected]);

  const onEndWithoutFullReport = () => {
    if (!activeEvent) return null;

    const eventStatus = { ...activeEvent.status } as StatusMatch;
    eventStatus.isFinal = true;
    eventStatus.isFullReport = false;
    eventStatus.endTimestamp = Date.now();
    eventStatus.duration = Date.now() - eventStatus.startTimestamp;

    dispatch(
      updateTrackingEvent({
        ...activeEvent,
        status: eventStatus
      })
    );

    setShowNav(true);
  };

  const closeModal = () => {
    if (handleBtnPressWhenDisconnected) handleBtnPressWhenDisconnected();
    setShowLostConnectionModal(false);
  };

  const renderOfflineNotice = () => {
    return (
      <React.Fragment>
        <View>
          <Pressable style={styles.closeBtn} onPress={closeModal}>
            <Icon icon="close_circle" />
          </Pressable>
          <Text style={styles.modalTitle}>
            Connection to the Edge device was lost
          </Text>

          <OverlayLoader
            isLoading
            color={variables.red}
            isOverlay={false}
            size="large"
          />
          <View style={styles.sepparator} />
          <Text style={styles.modalSubtitle}>
            Connection will automatically restore when:
          </Text>
          <Text style={styles.modalSubtitle}>
            <Icon icon="arrow_next" style={styles.arrow} /> The iPad is
            connected to Edge WiFi
          </Text>

          <Text style={styles.modalSubtitle}>
            <Icon icon="arrow_next" style={styles.arrow} /> The iPad and Edge
            are in range (max 15 meters)
          </Text>
          <Text style={styles.modalSubtitle}>
            <Icon icon="arrow_next" style={styles.arrow} /> The iPad needs 3
            minutes to start up
          </Text>
          <View style={styles.sepparator} />
          <Text
            style={StyleSheet.flatten([
              styles.modalSubtitle,
              { fontFamily: variables.mainFontBold }
            ])}
          >
            <Icon icon="arrow_next" style={styles.arrow} /> Is your Edge turned
            off?
          </Text>
          <Text style={styles.modalSubtitle}>
            1. End the current tracking session without all data
          </Text>

          <Text style={styles.modalSubtitle}>
            2. Turn on the Edge and make sure it’s connected to the iPad
          </Text>

          <Text style={styles.modalSubtitle}>
            3. Start a new tracking session
          </Text>
        </View>
        <View style={styles.sepparator} />
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => {
              Alert.alert(
                'Are you sure?',
                "You might miss some data in your report, and we can't guarantee the validity of the dataset.",
                [
                  {
                    text: 'Cancel',
                    style: 'cancel'
                  },
                  {
                    text: 'End',
                    style: 'destructive',
                    onPress: onEndWithoutFullReport
                  }
                ],
                { cancelable: true }
              );
            }}
          >
            <Text style={styles.buttonText}>End tracking without all data</Text>
          </Pressable>
          <Text style={styles.buttonDescription}>
            You might miss some data in your report
          </Text>
        </View>
      </React.Fragment>
    );
  };

  const renderStartEventModal = () => {
    const presentational = params?.presentational;

    return (
      <React.Fragment>
        <View>
          <OverlayLoader
            isLoading
            color={variables.red}
            isOverlay={false}
            size="large"
          />
          <View style={styles.sepparator} />
          <Text style={styles.modalSubtitle}>
            {presentational
              ? 'Make sure that:'
              : 'In order to start a tracking session, make sure that:'}
          </Text>
          <Text style={styles.modalSubtitle}>
            <Icon icon="arrow_next" style={styles.arrow} /> The Edge is turned
            on
          </Text>

          <Text style={styles.modalSubtitle}>
            <Icon icon="arrow_next" style={styles.arrow} /> The iPad is
            connected to Edge WiFi
          </Text>

          <Text style={styles.modalSubtitle}>
            <Icon icon="arrow_next" style={styles.arrow} /> The iPad and Edge
            are in range (max 15 meters)
          </Text>
        </View>
        <View style={styles.sepparator} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          {presentational
            ? (
            <ButtonNew text="OK" onPress={navigation.goBack} />
              )
            : (
            <React.Fragment>
              <ButtonNew
                text="Cancel"
                mode="secondary"
                onPress={() => {
                  navigation.goBack();
                  navigation.goBack();
                }}
              />
              <ButtonNew text="Try Again" onPress={navigation.goBack} />
            </React.Fragment>
              )}
        </View>
      </React.Fragment>
    );
  };

  if (params?.isStartingEvent) {
    return (
      <ModalContainer
        title="It seems like your iPad and Edge are not connected"
        subtitle=""
        close={navigation.goBack}
        containerStyle={{ width: 485 }}
        hideCloseButton
        hasTitleBorder={false}
      >
        {renderStartEventModal()}
      </ModalContainer>
    );
  }

  return (
    <Modal
      style={styles.modal}
      // isVisible={!edgeConnected && !isReady}
      isVisible={showLostConnectionModal}
      animationIn="fadeIn"
      animationOut="fadeOut"
    >
      <Card style={styles.modalContainer}>
        {!showNav
          ? (
              renderOfflineNotice()
            )
          : (
          <EndLiveEventStepThree isDisconnected />
            )}
      </Card>
    </Modal>
  );
};

export default LostConnectionModal;

const styles = StyleSheet.create({
  arrow: {
    color: variables.red,
    height: 10,
    width: 7
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%'
  },
  buttonDescription: {
    color: variables.grey,
    fontFamily: variables.mainFont,
    fontSize: 12
  },
  buttonText: {
    color: variables.red,
    fontFamily: variables.mainFontBold,
    fontSize: 16,
    marginBottom: 6
  },
  closeBtn: {
    position: 'absolute',
    right: -45,
    top: -45
  },
  modal: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContainer: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 30,
    width: 485
  },
  modalSubtitle: {
    color: variables.grey,
    fontFamily: variables.mainFont,
    fontSize: 16,
    marginBottom: 15,
    paddingHorizontal: 20,
    textAlign: 'left'
  },
  modalTitle: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    marginBottom: 15,
    textAlign: 'center'
  },
  sepparator: {
    backgroundColor: variables.lineGrey,
    height: 1,
    marginVertical: 18
  }
});
