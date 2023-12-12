import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { EventGender, GameAny, GameType, GenderType } from '../../../../types';
import { EventTopics, SocketContext } from '../../../hooks/socketContext';
import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { selectConfig } from '../../../redux/slices/configSlice';
import {
  createBatchTrainingGamesAction,
  createGameAction,
  selectAllGames,
  selectLastFinishedMatch,
  selectLastFinishedTraining
} from '../../../redux/slices/gamesSlice';
import { selectAllPlayers } from '../../../redux/slices/playersSlice';
import { setTrackingEvent } from '../../../redux/slices/trackingEventSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { RootStackParamList } from '../../../types';
import { getNewEventData, getPlayersMacIds } from '../../../utils';
import { variables } from '../../../utils/mixins';
import OverlayLoader from '../../common/OverlayLoader';
import BoxWrapper from '../common/BoxWrapper';
import ButtonsWrapper from '../common/ButtonsWrapper';
import ChoosePlayers from '../common/ChoosePlayers';
import EventDetails from '../common/EventDetails';
import ModalHeader from '../common/ModalHeader';
import { getSelectedPlayers } from '../helpers';
import {
  EventDetailsType,
  MODAL_HEADING,
  MODAL_HEADING_LEGEND,
  REPEAT_EVENT_OPTION
} from '../types';

const CreateEventModal = () => {
  const route = useRoute() as RouteProp<RootStackParamList, 'CreateEventModal'>;
  const date = route.params?.date;
  const { sendEvent } = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const allPlayers = useAppSelector(selectAllPlayers);
  const { tags = {} } = useAppSelector(selectConfig);
  const lastTraining = useAppSelector(selectLastFinishedTraining);
  const lastMatch = useAppSelector(selectLastFinishedMatch);
  const allGames = useAppSelector(selectAllGames);
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';

  const [eventDetails, setEventDetails] = useState<EventDetailsType>({
    type: '',
    date: date ? new Date(date) : new Date(),
    time: date ? new Date(date) : new Date(),
    category: '',
    repeat: REPEAT_EVENT_OPTION.never,
    location: '',
    opponent: '',
    repeatDate: new Date()
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [playersView, setPlayersView] = useState<boolean>(false);
  const [selectedPlayers, setSelectedPlayers] = useState<{
    [key: string]: boolean;
  }>(
    getSelectedPlayers(eventDetails.type, allPlayers, lastTraining, lastMatch)
  );

  const handleEventDetails = (data: string | Date, key: string) => {
    setEventDetails({ ...eventDetails, [key]: data });
  };

  useEffect(() => {
    setSelectedPlayers(
      getSelectedPlayers(eventDetails.type, allPlayers, lastTraining, lastMatch)
    );
  }, [eventDetails.type, allPlayers, lastTraining, lastMatch]);

  const includeExcludePress = (status: boolean) => {
    setSelectedPlayers(
      allPlayers.reduce((acc, cur) => ({ ...acc, [cur.id]: status }), {})
    );
  };

  const onStartTracking = (event: GameAny) => {
    dispatch(setTrackingEvent(event));
    const playerIds = event?.preparation?.playersInPitch || [];

    const macIds = getPlayersMacIds(playerIds, allPlayers, tags);
    sendEvent(EventTopics.CONNECTED_PLAYERS, { players: macIds });

    setTimeout(() => {
      if (event?.type === GameType.Training) {
        return sendEvent(EventTopics.TRAINING_START, {
          gameId: event?.id,
          hockey: isHockey,
          gender:
            activeClub?.gender === GenderType.Men
              ? EventGender.male
              : EventGender.female
        });
      }
    }, 1000);

    setTimeout(() => navigation.navigate('LiveView'), 1);
  };

  const onStartPress = () => {
    const newEventData: any = getNewEventData(
      eventDetails,
      allGames,
      allPlayers,
      selectedPlayers
    );

    setIsLoading(true);

    setTimeout(() => {
      dispatch(createGameAction(newEventData))
        .unwrap()
        .then((game) => {
          return onStartTracking(game);
        })
        .finally(() => {
          setIsLoading(false);
          navigation.goBack();
        });
    }, 100);
  };

  const onSavePress = () => {
    const newEventData: any = getNewEventData(
      eventDetails,
      allGames,
      allPlayers,
      selectedPlayers
    );

    setIsLoading(true);

    setTimeout(() => {
      if (
        eventDetails.type === GameType.Training &&
        eventDetails.repeat !== 'Never'
      ) {
        dispatch(createBatchTrainingGamesAction(newEventData))
          .unwrap()
          .then()
          .finally(() => {
            setIsLoading(false);
            navigation.goBack();
          });
      } else {
        dispatch(createGameAction(newEventData))
          .unwrap()
          .then()
          .finally(() => {
            setIsLoading(false);
            navigation.goBack();
          });
      }
    }, 100);
  };

  const disabledButtons = () => {
    if (eventDetails.type === '') return true;
    if (eventDetails.type === GameType.Match) {
      return !(eventDetails.location && eventDetails.opponent);
    } else {
      return !(eventDetails.category && eventDetails.repeat);
    }
  };

  const headingLegend = playersView
    ? MODAL_HEADING_LEGEND.include_exclude
    : MODAL_HEADING_LEGEND.number_of_players;

  return (
    <>
      <OverlayLoader isLoading={isLoading} />
      <View style={styles.mainContainer}>
        <View style={styles.cardContainer}>
          <ModalHeader heading={MODAL_HEADING.new_event} />
          <ScrollView style={styles.scrollContainer}>
            <BoxWrapper heading={MODAL_HEADING.event_details}>
              <EventDetails
                eventDetails={eventDetails}
                handleEventDetails={handleEventDetails}
              />
            </BoxWrapper>
            <BoxWrapper
              heading={MODAL_HEADING.choose_players}
              headingLegend={headingLegend}
              selectedPlayers={selectedPlayers}
              includeExcludePress={includeExcludePress}
            >
              <ChoosePlayers
                playersView={playersView}
                setPlayersView={() => setPlayersView(!playersView)}
                selectedPlayers={selectedPlayers}
                setSelectedPlayers={setSelectedPlayers}
              />
            </BoxWrapper>
            <View style={styles.spacer} />
          </ScrollView>
          <ButtonsWrapper
            onPrimaryClick={onStartPress}
            onSecondaryClick={onSavePress}
            disabledButtons={disabledButtons()}
            isRepeatActivated={eventDetails.repeat !== 'Never'}
          />
        </View>
      </View>
    </>
  );
};

export default CreateEventModal;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: variables.backgroundColor,
    height: '100%'
  },
  mainContainer: {
    flex: 1,
    marginTop: '10%'
  },
  scrollContainer: {
    padding: 15
  },
  spacer: {
    marginBottom: 50
  }
});
