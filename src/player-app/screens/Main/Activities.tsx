import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import { GameAny } from '../../../../types';
import NotificationModal from '../../../components/common/Modals/NotificationModal';
import { selectAuth } from '../../../redux/slices/authSlice';
import {
  getGamesAction,
  selectFinishedGamesByPlayer,
  selectGamesState
} from '../../../redux/slices/gamesSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store-player';
import { derivePlayerStats } from '../../../utils/adapter';
import { startFcm } from '../../../utils/fcm';
import UpcomingEvent from '../../components/UpcomingEvent';

import GameCard from './GameCard';
import GameCardPlaceholder from './GameCardPlaceholder';

interface ActivitiesProps {
  navigation: any;
}

const Activities = ({ navigation }: ActivitiesProps) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const playerId = auth?.playerId || '';

  const games = useAppSelector((state) =>
    selectFinishedGamesByPlayer(state, playerId)
  );

  const { isFetching } = useAppSelector(selectGamesState);

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  // const [refreshing, setRefreshing] = useState(false);
  const [notificationId, setNotificationId] = useState(null);

  useEffect(() => {
    // Load new games on App start
    dispatch(getGamesAction());
    checkNotificationPermission();
  }, []);

  useEffect(() => {
    if (notificationId) {
      const game = games.find((g: GameAny) => g.id === notificationId);

      if (game && game.report) {
        setNotificationId(null);
        const playerStats = derivePlayerStats(game, playerId, games);
        navigation.navigate('ActivityInfo', {
          game,
          playerStats,
          prevRoute: 'Activities'
        });
      }
    }
  }, [notificationId, games.find((g: GameAny) => g.id === notificationId)]);

  const checkNotificationPermission = async () => {
    const authStatus = await messaging().hasPermission();
    //! added ? for the autStatus
    const shouldShowModal =
      authStatus === messaging.AuthorizationStatus?.NOT_DETERMINED;

    const hasAuthorized =
      authStatus === messaging.AuthorizationStatus?.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus?.PROVISIONAL;

    if (shouldShowModal) {
      setShowNotificationModal(true);
    } else if (hasAuthorized) {
      subscribeNotification();
    }
  };

  const subscribeNotification = async () => {
    const topic =
      `~${auth.teamName}~${auth.customerName}~${auth.playerId}`.replace(
        /[^a-zA-Z0-9-_.~%]+/g,
        ''
      );

    startFcm(topic, (message: any, isRemote: any) => {
      const eventId = message?.data.eventId;
      dispatch(getGamesAction());
      setNotificationId(eventId);
    });
  };

  const renderGameCard = (game: GameAny) => {
    //! added testID
    return (
      <GameCard game={game} playerId={playerId} testID={`game-${game.id}`} />
    );
  };

  const renderLoadingCards = () => {
    return (
      <View style={styles.container}>
        {Array.from({ length: 5 }, (_, i) => {
          return <GameCardPlaceholder key={i} />;
        })}
      </View>
    );
  };

  if (isFetching) {
    return renderLoadingCards();
  }

  return (
    <View style={styles.container}>
      <UpcomingEvent />
      <FlatList
        //! added the testID
        testID="activitiesFlatList-games"
        keyExtractor={(item) => item.id}
        data={[...games].reverse()}
        renderItem={({ item }) => renderGameCard(item)}
        contentContainerStyle={{ paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
        onRefresh={() => {
          dispatch(getGamesAction());
        }}
        refreshing={isFetching}
      />
      <NotificationModal
        isVisible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        onSubmit={() => {
          setShowNotificationModal(false);
          subscribeNotification();
        }}
      />
    </View>
  );
};

export default Activities;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1
  }
});
