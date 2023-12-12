import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

import API from '../helpers/api';
import store from '../redux/store';

const useApiQueue = () => {
  const [isConnected, setIsConnected] = useState(true);
  console.log('isConnected', isConnected);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      processRequestQueue();
    }
  }, [isConnected]);

  const handleConnectivityChange = (state: NetInfoState) => {
    setIsConnected(
      (state.isConnected ?? false) && (state.isInternetReachable ?? false)
    );
  };

  const processRequestQueue = async () => {
    try {
      const queue: any = await AsyncStorage.getItem('apiQueue');
      const parsedQueue = JSON.parse(queue) || [];
      if (parsedQueue.length === 0) {
        return;
      }
      await Promise.all(
        parsedQueue.map((event: string) => {
          return API.bucketTrackingEvent({
            event,
            userId: store.getState().auth.data.email,
            timestamp: Date.now(),
            attributes: {
              eventId: 1123
            }
          });
        })
      )
        .then((response) => {
          console.log('resp', response);
          AsyncStorage.removeItem('apiQueue');
        })
        .catch((error) => {
          // Handle API request failure
          console.log('error', error);
        });
    } catch (error) {
      console.error('Failed to process the queue:', error);
    }
  };
};

export default useApiQueue;
