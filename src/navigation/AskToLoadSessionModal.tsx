import React, { useContext } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';

import { GameType } from '../../types';
import ButtonNew from '../components/common/ButtonNew';
import ModalContainer from '../components/common/Modals/ModalContainer';
import { Icon } from '../components/icon/icon';
import { SocketContext } from '../hooks/socketContext';
import { selectAuth } from '../redux/slices/authSlice';
import { deleteGameAction } from '../redux/slices/gamesSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { DrawerStackParamList } from '../types';
import { variables } from '../utils/mixins';

const AskToLoadSessionModal = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const route = useRoute() as RouteProp<
    DrawerStackParamList,
    'AskToLoadSessionModal'
  >;
  const { customerName } = useAppSelector(selectAuth);
  const { date, event } = route.params;
  const { isReady } = useContext(SocketContext);

  const onCreateEvent = () => {
    const time = moment(new Date()).format('HH:mm');
    navigation.replace('CreateEventModal', {
      date: moment(`${date} ${time}`, 'DD/MM/YYYY HH:mm').toDate()
    });
  };

  const onDeleteEvent = () => {
    Alert.alert(
      'Delete event',
      'Are you sure you want to delete this event?',
      [
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (!event) return;
            dispatch(deleteGameAction(event)).finally(() => {
              navigation.goBack();
            });
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ],
      { cancelable: true }
    );
  };
  const onLoadSession = () => {
    navigation.replace('LoadEdgeSessionsModal', {
      screen: 'EdgeSessionLanding',
      params: { date, event }
    });
  };

  const getTitle = () => {
    if (event) {
      if (event.type === GameType.Training) {
        return 'Training';
      } else {
        return `${customerName} vs ${event.versus}`;
      }
    }
    return 'Create New or Load Session?';
  };

  const getSubTitle = () => {
    if (event) {
      return moment(
        `${event.date} ${event.startTime}`,
        'YYYY/MM/DD HH:mm'
      ).format('ddd, MMMM D | HH:mm');
    }
    return '';
  };

  const getText = () => {
    if (event) {
      return 'Do you want to delete or load this session?\n\nPlease ensure that you are connected to the Edge, if you want to load a session that you tracked without using the app.';
    }
    return "Choose between creating a new event or loading a previously tracked session, if you've recorded a session without using your iPad.\n\nPlease ensure that you are connected to the Edge, if you wish to load a completed session.";
  };

  const buttonText = () => {
    if (event) return 'Delete';
    return 'Create New';
  };

  return (
    <ModalContainer
      containerStyle={{ width: 470 }}
      title={getTitle()}
      close={navigation.goBack}
      subtitle={getSubTitle()}
    >
      <View style={styles.content}>
        <Text style={styles.text}>{getText()}</Text>
      </View>
      <Text style={styles.textSecondary}>Connection status:</Text>
      <View style={styles.wrapper}>
        <Text style={styles.textTeriery}>Edge Device</Text>
        <View style={styles.wrapper}>
          <Icon
            style={styles.icon}
            icon={isReady ? 'icon_connected' : 'icon_disconnected'}
          />
          <Text style={styles.textTeriery}>
            {isReady ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <ButtonNew
          mode={event ? 'secondary' : 'primary'}
          style={styles.btn}
          text={buttonText()}
          onPress={event ? onDeleteEvent : onCreateEvent}
        />
        <ButtonNew
          disabled={!isReady}
          text="Load Session"
          onPress={onLoadSession}
        />
      </View>
    </ModalContainer>
  );
};

export default AskToLoadSessionModal;

const styles = StyleSheet.create({
  btn: {
    marginRight: 20
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30
  },
  content: {
    borderBottomColor: variables.backgroundColor,
    borderBottomWidth: 1,
    marginBottom: 26,
    paddingBottom: 26
  },
  icon: {
    marginBottom: 2,
    marginRight: 12
  },
  text: {
    color: variables.textBlack,
    fontFamily: variables.mainFont
  },
  textSecondary: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    marginBottom: 15
  },
  textTeriery: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginRight: 50
  },
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
