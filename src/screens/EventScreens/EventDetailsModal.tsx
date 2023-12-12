import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';

import { EventGender, GameAny, GameType, GenderType } from '../../../types';
import ModalContainer from '../../components/common/Modals/ModalContainer';
import OverlayLoader from '../../components/common/OverlayLoader';
import DeleteEvent from '../../components/Events/DeleteEvent';
import EditEvent from '../../components/Events/EditEvent';
import EventDetails from '../../components/Events/EventDetails';
import MatchScore from '../../components/Events/MatchScore';
import { EventTopics, SocketContext } from '../../hooks/socketContext';
import { selectAuth } from '../../redux/slices/authSlice';
import { selectActiveClub } from '../../redux/slices/clubsSlice';
import { selectConfig } from '../../redux/slices/configSlice';
import {
  deleteBatchTrainingGamesAction,
  deleteGameAction,
  selectAllGames,
  selectGameById,
  updateGameAction
} from '../../redux/slices/gamesSlice';
import { selectAllPlayers } from '../../redux/slices/playersSlice';
import { setTrackingEvent } from '../../redux/slices/trackingEventSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { RootStackParamList } from '../../types';
import { formatDateTime, getPlayersMacIds } from '../../utils';
import { utils } from '../../utils/mixins';

import MissingTagsModal from './MissingTagsModal';

enum ModalView {
  EventDetails,
  ChoosePlayers,
  EditEvent,
  DeleteEvent,
  MatchScore
}
type ModalViewState =
  | ModalView.EventDetails
  | ModalView.ChoosePlayers
  | ModalView.EditEvent
  | ModalView.DeleteEvent
  | ModalView.MatchScore;

const EventDetailsModal = () => {
  const dispatch = useAppDispatch();
  const activeClub = useAppSelector(selectActiveClub);
  const allGames = useAppSelector(selectAllGames);
  const players = useAppSelector(selectAllPlayers);
  const { tags = {} } = useAppSelector(selectConfig);
  const { customerName } = useAppSelector(selectAuth);
  const navigation = useNavigation() as any;
  const isHockey = activeClub.gameType === 'hockey';
  const { sendEvent } = useContext(SocketContext);
  const route = useRoute() as RouteProp<
    RootStackParamList,
    'EventDetailsModal'
  >;
  const { event, closePrevRoute } = route.params;

  const routeEvent = useAppSelector((state) =>
    selectGameById(state, event.id)
  ) as GameAny;

  const isOnboarding = navigation
    .getState()
    .routeNames.includes('OnboardingSteps');

  const [modalView, setModalView] = useState<ModalViewState>(
    isOnboarding ? ModalView.EditEvent : ModalView.EventDetails
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showMissingTagsModal, setShowMissingTagsModal] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<{
    [key: string]: boolean;
  }>({});
  const [editResult, setEditResult] = useState<boolean>(false);

  const getPlayersWithoutTag = useCallback(() => {
    const { preparation } = route.params.event;
    const playersInPitch = preparation ? preparation?.playersInPitch : [];

    return players.filter(
      (player) => !player.tag && playersInPitch.includes(player.id)
    );
  }, [players, route.params.event]);

  useEffect(() => {
    const playersWithoutTag = getPlayersWithoutTag();
    setSelectedPlayers(
      playersWithoutTag.reduce(
        (acc, player) => ({ ...acc, [player.id]: true }),
        {}
      )
    );
  }, []);

  const closeModal = () => {
    if (navigation.getState().routeNames.includes('OnboardingEvents')) {
      return navigation.pop(1);
    }
    navigation.pop(2);
  };
  const indicator = routeEvent?.benchmark?.indicator || null;

  const modalTitle = useMemo(() => {
    if (modalView === ModalView.EventDetails) {
      if (routeEvent?.type === GameType.Match) {
        return `${customerName} vs ${routeEvent?.versus}`;
      }
      if (indicator === null) {
        return 'Training';
      }
      if (typeof indicator === 'number') {
        if (!isFinite(indicator)) {
          return 'Training';
        }

        if (indicator === 0) {
          return `Training \n Matchday`;
        }
        const indicatorValue = Math.abs(indicator);
        const trainingMessage = `Training \n ${
          indicator < 0
            ? `${indicatorValue} day${indicatorValue > 1 ? 's' : ''} to match`
            : `${indicatorValue} day${
                indicatorValue > 1 ? 's' : ''
              } after match`
        }`;

        return trainingMessage;
      }
      if (typeof indicator === 'string') {
        return `Training \n ${utils.getTrainingTitleFromString(indicator)}`;
      }
    } else if (modalView === ModalView.DeleteEvent) return 'Delete Event';
    else if (modalView === ModalView.ChoosePlayers) {
      return 'Players Overview';
    } else if (modalView === ModalView.MatchScore) return 'Match Result';
    else if (isOnboarding) return 'Edit Recurring Events';
    return 'Edit Details';
  }, [modalView]);

  const modalSubtitle = useMemo(() => {
    const { date: formatedDate, dateFormat } = utils.checkAndFormatUtcDate(
      routeEvent.UTCdate,
      routeEvent.date,
      routeEvent.startTime
    );

    let memoTitle = `${moment(formatedDate, dateFormat).format(
      'ddd, MMMM D | HH:mm'
    )}`;

    if (routeEvent?.type === GameType.Match) {
      memoTitle = `${memoTitle} | ${routeEvent?.location}`;
    }

    if (modalView === ModalView.DeleteEvent) {
      return 'Are you sure you want to delete this event?';
    }

    return memoTitle;
  }, [modalView]);

  const onSave = (
    newEventData: any,
    startEvent = false,
    updateRecurring = false
  ) => {
    setIsLoading(true);

    if (updateRecurring) {
      setTimeout(() => {
        const dayOfWeek = moment(
          newEventData.UTCdate,
          'YYYY/MM/DD HH:mm'
        ).day();

        const eventsPromiseArr = allGames
          /// GET EVENTS THAT HAS THE SAME RECURRING EVENT ID AND AREN'T FINISHED
          .filter(({ recurringEventId, status }) => {
            const isPartOfRecurringEventsGroup =
              recurringEventId === newEventData.recurringEventId;
            const isFinished = !!status?.isFinal;

            return isPartOfRecurringEventsGroup && !isFinished;
          })
          .map((event) => {
            const newDate = moment(
              `${event.date} ${newEventData.startTime}`,
              'YYYY/MM/DD HH:mm'
            )
              .weekday(dayOfWeek === 0 ? 6 : dayOfWeek - 1)
              .format('YYYY/MM/DD HH:mm');
            const gamesOnSelectedDate = allGames.filter((game) => {
              return (
                game.date === formatDateTime(newDate) ||
                game.UTCdate === formatDateTime(newDate)
              );
            });

            if (gamesOnSelectedDate.length > 1) {
              /// IF THERE ARE TWO EVENTS ON THE DATE, THE EVENT CAN'T BE MOVED TO THAT DATE
              /// (IT'LL BE EXCLUDED FROM THE RECURRING EVENT GROUP)
              return { ...event, recurringEventId: null };
            }

            if (gamesOnSelectedDate.length === 1) {
              const startTimeOnExistingEvent = moment(
                gamesOnSelectedDate[0].UTCdate
                  ? utils.UTCtoLocale(gamesOnSelectedDate[0].UTCdate)
                  : gamesOnSelectedDate[0].date,
                'YYYY/MM/DD HH:mm'
              ).format('HH:mm');
              if (
                moment(newEventData.UTCdate, 'YYYY/MM/DD HH:mm').format(
                  'HH:mm'
                ) === startTimeOnExistingEvent
              ) {
                /// IF THERE IS ONE EVENT ON THE DATE AND HAS THE SAME START TIME AS THE RECURRING EVENT
                /// THE EVENT CAN'T BE MOVED TO THAT DATE
                /// (IT'LL BE EXCLUDED FROM THE RECURRING EVENT GROUP)
                return { ...event, recurringEventId: null };
              }
            }

            return {
              ...newEventData,
              id: event.id,
              date: event.date,
              UTCdate: utils.localeToUTC(
                event.date,
                newEventData.startTime,
                true
              ),
              startTime: newEventData.startTime
            };
          })
          .map((event) => dispatch(updateGameAction(event)));

        Promise.all(eventsPromiseArr)
          .then((values) => {
            console.log({ values });
          })
          .catch((err) => console.log({ err }))
          .finally(() => {
            setIsLoading(false);
            closeModal();
          });
      }, 10);
    } else {
      dispatch(updateGameAction(newEventData))
        .then((action) => {
          const payload = action.payload as GameAny;
          if (payload.type === GameType.Match && startEvent) {
            return setTimeout(
              () =>
                navigation.navigate('MatchTypeSelector', { event: payload }),
              1
            );
          }
          return startEvent && onStartTracking(payload);
        })
        .finally(() => {
          setIsLoading(false);
          closeModal();
        });
    }
  };

  const onDelete = (event: GameAny, recurringEvent = false) => {
    setIsLoading(true);

    if (recurringEvent) {
      setTimeout(() => {
        const eventsPromiseArr = allGames
          /// GET EVENTS THAT HAS THE SAME RECURRING EVENT ID AND AREN'T FINISHED
          .filter(({ id, recurringEventId, status }) => {
            if (id === event.id) {
              return true;
            }

            const isPartOfRecurringEventsGroup =
              recurringEventId === event.recurringEventId;
            const isFinished = !!status?.isFinal;

            return isPartOfRecurringEventsGroup && !isFinished;
          });

        dispatch(deleteBatchTrainingGamesAction(eventsPromiseArr))
          .unwrap()
          .finally(() => {
            closeModal();
            setIsLoading(false);
          });
      }, 10);
    } else {
      dispatch(deleteGameAction(event)).finally(() => {
        closeModal();
        setIsLoading(false);
      });
    }
  };

  const onStartTracking = (overrideEvent?: GameAny) => {
    let event = route.params.event;
    const selectedPlayerIds =
      Object.keys(selectedPlayers).filter(
        (player) => selectedPlayers[player]
      ) || [];

    const unAssignedPlayers = players.filter(
      (player) => !player.tag && selectedPlayerIds.includes(player.id)
    );

    if (!overrideEvent && unAssignedPlayers.length > 0) {
      return setShowMissingTagsModal(true);
    }
    if (
      (event && event?.type === GameType.Match) ||
      (overrideEvent && overrideEvent?.type === GameType.Match)
    ) {
      navigation.goBack();
      return setTimeout(
        () =>
          navigation.navigate('MatchTypeSelector', {
            event: event ? (event as GameAny) : (overrideEvent as GameAny)
          }),
        1
      );
    }

    if (overrideEvent) {
      dispatch(setTrackingEvent(overrideEvent));
      event = overrideEvent;
    } else if (routeEvent) {
      closeModal();
      const updatedEvent = updateEventPreparation(routeEvent);
      dispatch(setTrackingEvent(updatedEvent));
    }

    const playerIds = event?.preparation?.playersInPitch || [];

    const macIds = getPlayersMacIds(playerIds, players, tags);
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
    if (closePrevRoute) {
      navigation.goBack();
    }
    setTimeout(() => navigation.navigate('LiveView'), 1);
  };

  const updateEventPreparation = (event: GameAny) => {
    const playersInPitch = event.preparation
      ? [...event.preparation.playersInPitch]
      : [];
    const playersOnBench = event.preparation
      ? [...event.preparation.playersOnBench]
      : [];

    Object.keys(selectedPlayers).forEach((playerId) => {
      if (selectedPlayers[playerId] && playersOnBench.includes(playerId)) {
        const index = playersOnBench.indexOf(playerId);
        playersOnBench.splice(index, 1);
        playersInPitch.push(playerId);
      }

      if (!selectedPlayers[playerId] && playersInPitch.includes(playerId)) {
        const index = playersInPitch.indexOf(playerId);
        playersInPitch.splice(index, 1);
        playersOnBench.push(playerId);
      }
    });

    const preparation = {
      ...event.preparation,
      playersInPitch,
      playersOnBench
    };

    return { ...event, preparation };
  };

  const onViewReport = () => {
    closeModal();
    if (closePrevRoute) {
      navigation.goBack();
    }
    setTimeout(
      () =>
        routeEvent &&
        navigation.navigate('Report', { eventId: routeEvent?.id }),
      1
    );
  };

  const renderEventScreens = () => {
    switch (modalView) {
      case ModalView.EventDetails:
        return (
          <EventDetails
            event={routeEvent}
            onEditPress={() => setModalView(ModalView.EditEvent)}
            onChoosePlayers={() =>
              navigation.navigate('PlayersOverviewModal', {
                event: routeEvent,
                onSave
              })
            }
            onStartTracking={() => onStartTracking()}
            onViewReport={onViewReport}
            onEnterScore={() => setModalView(ModalView.MatchScore)}
          />
        );

      case ModalView.EditEvent:
        return (
          routeEvent && (
            <EditEvent
              event={routeEvent}
              onSave={onSave}
              onDelete={() => setModalView(ModalView.DeleteEvent)}
              onEnterScore={() => {
                setEditResult(true);
                setModalView(ModalView.MatchScore);
              }}
            />
          )
        );
      case ModalView.DeleteEvent:
        return (
          routeEvent && <DeleteEvent event={routeEvent} onDelete={onDelete} />
        );
      case ModalView.MatchScore:
        return (
          routeEvent && (
            <MatchScore
              event={routeEvent}
              editResult={editResult}
              goBackToEdit={() => setModalView(ModalView.EditEvent)}
            />
          )
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return <OverlayLoader isLoading />;
  }

  return (
    <ModalContainer
      title={modalTitle}
      subtitle={modalSubtitle}
      close={closeModal}
      hasTitleBorder={false}
      containerStyle={{
        width: 470
      }}
    >
      {showMissingTagsModal && (
        <MissingTagsModal
          playersState={selectedPlayers}
          close={() => setShowMissingTagsModal(false)}
          setPlayersState={setSelectedPlayers}
          players={getPlayersWithoutTag()}
          onSave={() => {
            setShowMissingTagsModal(false);
            onStartTracking();
          }}
        />
      )}
      {renderEventScreens()}
    </ModalContainer>
  );
};

export default EventDetailsModal;
