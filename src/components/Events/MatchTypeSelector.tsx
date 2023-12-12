import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { EventGender, GameAny, GenderType } from '../../../types';
import { EventTopics, SocketContext } from '../../hooks/socketContext';
import { selectActiveClub } from '../../redux/slices/clubsSlice';
import { selectConfig } from '../../redux/slices/configSlice';
import { selectAllPlayers } from '../../redux/slices/playersSlice';
import { setTrackingEvent } from '../../redux/slices/trackingEventSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { RootStackParamList } from '../../types';
import { getPlayersMacIds } from '../../utils';
import {
  MATCH_SELECTOR_TEXT,
  MATCH_SELECTOR_TITLE,
  variables
} from '../../utils/mixins';
import ButtonNew from '../common/ButtonNew';
import ModalContainer from '../common/Modals/ModalContainer';

const MatchTypeSelector = () => {
  const { sendEvent } = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute() as RouteProp<
    RootStackParamList,
    'MatchTypeSelector'
  >;
  const players = useAppSelector(selectAllPlayers);
  const activeClub = useAppSelector(selectActiveClub);
  const { tags = {} } = useAppSelector(selectConfig);
  const isHockey = activeClub.gameType === 'hockey';

  const closeModal = () => {
    navigation.goBack();
    navigation.navigate('EventDetailsModal', { event: route.params.event });
  };

  const onStartTracking = (event: GameAny, isPreMatch: boolean) => {
    dispatch(setTrackingEvent(event));
    const playerIds = event?.preparation?.playersInPitch || [];
    const macIds = getPlayersMacIds(playerIds, players, tags);
    sendEvent(EventTopics.CONNECTED_PLAYERS, { players: macIds });

    setTimeout(() => {
      return sendEvent(EventTopics.TRAINING_START, {
        gameId: event?.id,
        hockey: isHockey,
        drillName: isPreMatch
          ? 'preMatch'
          : isHockey
            ? 'firstPeriod'
            : 'firstHalf',
        gender:
          activeClub?.gender === GenderType.Men
            ? EventGender.male
            : EventGender.female
      });
    }, 1000);
    navigation.goBack();
    setTimeout(() => navigation.navigate('LiveView'), 1);
  };

  return (
    <ModalContainer
      title={MATCH_SELECTOR_TITLE}
      close={() => {}}
      hideCloseButton
    >
      <View style={styles.textContainer}>
        <Text style={styles.text}>{MATCH_SELECTOR_TEXT}</Text>
      </View>
      <View style={styles.buttons}>
        <ButtonNew
          text="Pre-match"
          onPress={() => onStartTracking(route.params.event, true)}
          style={styles.saveButton}
        />

        <ButtonNew
          text="Match"
          onPress={() => onStartTracking(route.params.event, false)}
        />
      </View>

      <TouchableOpacity style={styles.buttons} onPress={closeModal}>
        <Text style={styles.backBtnText}>Back</Text>
      </TouchableOpacity>
    </ModalContainer>
  );
};

export default MatchTypeSelector;

const styles = StyleSheet.create({
  backBtnText: {
    color: variables.red,
    fontFamily: variables.mainFont,
    fontSize: 16
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 45
  },
  saveButton: {
    marginRight: 30
  },
  text: {
    fontFamily: variables.mainFont,
    fontSize: 16,
    marginHorizontal: 50,
    textAlign: 'center'
  },
  textContainer: {
    borderBottomColor: variables.lineGrey,
    borderBottomWidth: 1,
    height: 126,
    width: 480
  }
});
