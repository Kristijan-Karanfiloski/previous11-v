import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import store from '../redux/store';

import API from './api';

const ApiQueue = () => {
  const trySendQueueRequest = async (event: string) => {
    try {
      const state = await NetInfo.fetch();
      console.log('Connection type', state);

      if (state.isConnected && state.isInternetReachable) {
        await API.bucketTrackingEvent({
          event,
          userId: store.getState().auth.data.email,
          timestamp: Date.now(),
          attributes: {
            email: store.getState().auth.data.email,
            type: store.getState().auth.data.userType,
            eventId: 1123
          }
        });
      } else {
        console.log('add to QUEUE!');
        await addToQueue(event);
      }
    } catch (error) {
      console.error('Error in trySendQueueRequest:', error);
    }
  };

  const addToQueue = async (event: string) => {
    try {
      const queue: any = await AsyncStorage.getItem('apiQueue');
      const parsedQueue: string[] = JSON.parse(queue || '[]');

      parsedQueue.push(event);

      await AsyncStorage.setItem('apiQueue', JSON.stringify(parsedQueue));
    } catch (error) {
      console.error('Failed to add request to the queue:', error);
    }
  };

  const clearQueue = async () => {
    try {
      await AsyncStorage.removeItem('apiQueue');
    } catch (error) {
      console.error('Failed to clear the queue:', error);
    }
  };

  return {
    addToQueue,
    clearQueue,
    trySendQueueRequest
  };
};

export default ApiQueue;
