import React, { useContext, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';

import { EventGender, GameAny, GameType, GenderType } from '../../../types';
import ModalContainer from '../../components/common/Modals/ModalContainer';
import OverlayLoader from '../../components/common/OverlayLoader';
import CreateEvent from '../../components/Events/CreateEvent';
import { EventTopics, SocketContext } from '../../hooks/socketContext';
import { selectActiveClub } from '../../redux/slices/clubsSlice';
import { selectConfig } from '../../redux/slices/configSlice';
import {
  createBatchTrainingGamesAction,
  createGameAction,
  selectAllGames
} from '../../redux/slices/gamesSlice';
import { selectAllPlayers } from '../../redux/slices/playersSlice';
import { setTrackingEvent } from '../../redux/slices/trackingEventSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { RootStackParamList } from '../../types';
import { formatDateTime, getPlayersMacIds } from '../../utils';
import { utils } from '../../utils/mixins';

const CreateEventModal = () => {
  const { sendEvent } = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const navigation = useNavigation() as any;
  const route = useRoute() as RouteProp<RootStackParamList, 'CreateEventModal'>;
  const players = useAppSelector(selectAllPlayers);
  const allGames = useAppSelector(selectAllGames);
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  const closePrevRoute = route.params?.closePrevRoute;
  const { tags = {} } = useAppSelector(selectConfig);
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    if (navigation.getState().routeNames.includes('OnboardingEvents')) {
      return navigation.pop(1);
    }
    navigation.pop(2);
  };

  const onSaveHandler = (
    data: any,
    startEvent = false,
    endDate: Date | null = null
  ) => {
    setIsLoading(true);

    const isRecurringEvent = !!data.recurringEventId;
    if (isRecurringEvent && endDate) {
      setTimeout(() => {
        const endOfSeasonDate = moment(endDate);
        const dates: string[] = [];
        const { date: formatedDate, dateFormat } = utils.checkAndFormatUtcDate(
          data.UTCdate,
          data.date,
          data.startTime
        );
        let date = formatedDate;
        let isDateBeforeSeasonEnd = moment(date, dateFormat).isSameOrBefore(
          endOfSeasonDate
        );

        while (isDateBeforeSeasonEnd) {
          dates.push(date);

          date = moment(dates[dates.length - 1], 'YYYY/MM/DD HH:mm')
            .add(7, 'd')
            .format('YYYY/MM/DD HH:mm');

          isDateBeforeSeasonEnd = moment(
            dates[dates.length - 1],
            'YYYY/MM/DD HH:mm'
          )
            .add(7, 'd')
            .isSameOrBefore(endOfSeasonDate);
        }

        const eventsPromiseArr = dates
          .filter((date) => {
            const gamesOnSelectedDate = allGames.filter((game) => {
              return game.date === formatDateTime(date);
            });

            if (gamesOnSelectedDate.length > 1) return false;

            if (gamesOnSelectedDate.length === 1) {
              const startTimeOnExistingEvent = moment(
                gamesOnSelectedDate[0].date,
                'YYYY/MM/DD HH:mm'
              ).format('HH:mm');
              if (
                moment(data.date, 'YYYY/MM/DD HH:mm').format('HH:mm') ===
                startTimeOnExistingEvent
              ) {
                return false;
              }
            }

            return true;
          })
          .map((date) => ({ ...data, date, UTCdate: date }));

        dispatch(createBatchTrainingGamesAction(eventsPromiseArr))
          .unwrap()
          .finally(() => {
            setIsLoading(false);
            closeModal();
          });
      }, 10);
    } else {
      dispatch(createGameAction(data))
        .unwrap()
        .then((game) => {
          if (!game) return;

          if (game.type === GameType.Match && startEvent) {
            return setTimeout(
              () => navigation.navigate('MatchTypeSelector', { event: game }),
              1
            );
          }
          return startEvent && onStartTracking(game);
        })
        .finally(() => {
          setIsLoading(false);
          closeModal();
        });
    }
  };

  const onStartTracking = (event: GameAny) => {
    dispatch(setTrackingEvent(event));
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

    setTimeout(() => navigation.navigate('LiveView'), closePrevRoute ? 600 : 1);
  };

  const onChoosePlayers = (data: any) => {
    navigation.navigate('PlayersOverviewModal', {
      event: data,
      onSave: onSaveHandler
    });
  };

  if (isLoading) {
    return <OverlayLoader isLoading />;
  }

  return (
    <ModalContainer title="Create New Event" close={closeModal}>
      <CreateEvent
        onSave={onSaveHandler}
        onChoosePlayers={onChoosePlayers}
        createDate={route.params?.date}
      />
    </ModalContainer>
  );
};

export default CreateEventModal;
