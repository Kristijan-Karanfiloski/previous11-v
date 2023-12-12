import React, { useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StatusMatch } from '../../types';
import Header from '../components/common/Header';
import TeamLiveView from '../components/LiveGame/TeamLiveView';
import PlayerStatsView from '../components/StatsScreens/PlayerStatsView';
import { EventTopics, SocketContext } from '../hooks/socketContext';
import { updateGameAction } from '../redux/slices/gamesSlice';
import {
  removeTrackingEvent,
  selectTrackingEvent,
  updateTrackingEvent
} from '../redux/slices/trackingEventSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';

const LiveViewStack = createNativeStackNavigator<any>();

const LiveView = () => {
  const { sendEvent } = useContext(SocketContext);
  const navigation = useNavigation() as any;
  const activeEvent = useAppSelector(selectTrackingEvent);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (activeEvent.status && activeEvent.status?.isFinal) {
      const eventStatus = { ...activeEvent.status } as StatusMatch;

      eventStatus.isFullReport = false;
      eventStatus.endTimestamp = Date.now();
      eventStatus.duration = Date.now() - eventStatus.startTimestamp;

      dispatch(
        updateTrackingEvent({
          ...activeEvent,
          status: eventStatus
        })
      );
      sendEvent(EventTopics.RESET);
      const event = { ...activeEvent, ...eventStatus };

      dispatch(updateGameAction(event));
      dispatch(removeTrackingEvent());

      setTimeout(
        () =>
          navigation.replace('Report', {
            eventId: event.id,
            wasPrevRouteLive: true
          }),
        1
      );
    }
  }, []);

  return (
    <LiveViewStack.Navigator
      initialRouteName="TeamLive"
      screenOptions={{
        header: () => <Header />
      }}
    >
      <LiveViewStack.Screen name="TeamLive" component={TeamLiveView} />
      <LiveViewStack.Screen name="PlayerLive" component={PlayerStatsView} />
    </LiveViewStack.Navigator>
  );
};

export default LiveView;
