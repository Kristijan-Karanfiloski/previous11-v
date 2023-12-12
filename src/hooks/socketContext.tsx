import React, { createContext, useEffect, useRef, useState } from 'react';
import _ from 'lodash';

import { StatsDataNew } from '../../types';
import API_ENDPOINTS from '../helpers/api_endpoints';
import { selectConfig } from '../redux/slices/configSlice';
import { OnlineTag, updateOnlineTags } from '../redux/slices/onlineTagsSlice';
import { selectAllPlayers } from '../redux/slices/playersSlice';
import { updateTrackingEvent } from '../redux/slices/trackingEventSlice';
import store, { useAppDispatch, useAppSelector } from '../redux/store';
import { replaceMacIds } from '../utils';

import useNetwork from './useNetwork';

export enum EventTopics {
  TRAINING_START = 'training_start',
  TRAINING_END = 'training_end',
  DRILL_START = 'drill_start',
  DRILL_END = 'drill_end',
  FIRST_HALF_START = 'first_half_start',
  FIRST_HALF_END = 'first_half_end',
  SECOND_HALF_START = 'second_half_start',
  SECOND_HALF_END = 'second_half_end',
  REPORT_REQUEST = 'report_request',
  CONNECTED_PLAYERS = 'connectedPlayers',
  HEARTBEAT = 'heartbeat',

  /// HOCKEY ///
  FIRST_PERIOD_START = 'first_period_start',
  FIRST_PERIOD_END = 'first_period_end',
  SECOND_PERIOD_START = 'second_period_start',
  SECOND_PERIOD_END = 'second_period_end',
  THIRD_PERIOD_START = 'third_period_start',
  THIRD_PERIOD_END = 'third_period_end',

  // GENERAL
  CONNECTED_TAGS = 'connected_tags',
  LIVE = 'live',
  REPORT = 'report',
  RESET = 'reset_middleware'
}

type SocketData = {
  method?: EventTopics;
  stats?: StatsDataNew;
  timeStamp?: number;
  timestamp?: number;
  tags?: Record<string, OnlineTag>;
};

type SocketProviderData = {
  isReady: boolean;
  val?: SocketData | null;
  socket: WebSocket | null;
  sendEvent: (method: EventTopics, data?: Record<string, any>) => void;
  connect: () => void;
  disconnect: () => void;
  edgeConnected: boolean;
};

export const SocketProvider = (props: any) => {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);
  const [val, setVal] = useState<SocketData | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { connected: edgeConnected, setIsConnectedToEdge } = useNetwork();
  const socketTimeoutRef = useRef<any>(null);
  const isReadyRef = useRef(isReady);
  const config = useAppSelector(selectConfig);
  const players = useAppSelector(selectAllPlayers);

  isReadyRef.current = isReady;
  useEffect(() => {
    // connectSocket();
    return () => {
      console.log('unmount');
      socketTimeoutRef.current && clearTimeout(socketTimeoutRef.current);
      socket && socket.close();
      setSocket(null);
    };
  }, []);

  useEffect(() => {
    console.log(
      '[EDGE CONNECTION]',
      edgeConnected ? 'Connected' : 'Disconnected'
    );
    if (edgeConnected && !isReady) {
      connectSocket();
    } else if (!edgeConnected && isReady) {
      socket && socket.close();
    }
  }, [edgeConnected, isReady]);

  // when value is received from socket, process it
  useEffect(() => {
    onProcessMessage();
  }, [val]);

  const connectSocket = () => {
    if (isReadyRef.current) return;
    console.log('[Socket Connecting]');
    const socket: WebSocket = new WebSocket(API_ENDPOINTS.SOCKET_URL);

    socket.onopen = () => {
      console.log('[Socket Connected]');
      setIsReady(true);
    };
    socket.onclose = (ev) => {
      console.log('[Socket Closed]', ev.reason);
      setIsReady(false);
      setSocket(null);
      setIsConnectedToEdge(false);
      // socketTimeoutRef.current = setTimeout(connectSocket, 3000);
    };

    // socket.onerror = (error) => {
    //   console.log('[Socket Error]', error);
    //   setIsReady(false);
    //   setSocket(null);
    //   return connectSocket();
    // };
    socket.onmessage = (event) => {
      const data: SocketData = JSON.parse(event.data);
      console.log('[Socket message]', JSON.parse(event.data));
      setVal(data);
    };

    setSocket(socket);
  };

  const onProcessMessage = () => {
    const data = val;
    if (!data) return;

    if (
      (data.method === EventTopics.REPORT ||
        data.method === EventTopics.LIVE) &&
      data.stats
    ) {
      const jsonData = JSON.stringify(data.stats);

      const statsDataString = replaceMacIds(jsonData, config.tags, players);

      dispatch(
        updateTrackingEvent({
          report: {
            timeStamp: data.timeStamp ? data.timeStamp : 0,
            stats: statsDataString
          }
        })
      );

      if (data?.tags) {
        setOnlineTags(data?.tags);
      }
    } else if (data.method === EventTopics.CONNECTED_TAGS) {
      setOnlineTags(data?.tags);
    }
  };

  const disconnect = () => {
    console.log('[Socket Disconnecting]');
    if (!socket || !isReady) return;
    socket.close();
    setSocket(null);
  };
  // throttle reconnect socket function to prevent multiple reconnects

  const sendEvent = (method: EventTopics, data = {}) => {
    if (!socket) return;
    try {
      const params: any = {
        method,
        params: {
          timeStamp: Date.now(),
          ...data
        }
      };
      console.log('[SOCKET SEND EVENT]', params);
      socket.send(JSON.stringify(params));
    } catch (error) {
      console.log(error);
    }
  };

  const setOnlineTags = (tags?: Record<string, OnlineTag>) => {
    const tagsObject = tags || {};
    const tagIds = Object.keys(tagsObject);
    const onlineTagsData = tagIds
      .map((tagId) => {
        return {
          ...tagsObject[tagId],
          id: tagId
        };
      })
      .filter((tag) => tag.connected);
    const onlineTags = onlineTagsData.map((tag: OnlineTag) => {
      return {
        ..._.omit(tag, 'last_seen', 'timestamp', 'connected')
      };
    });

    // console.log('onlineTags', onlineTags);
    const state = store.getState().onlineTags.data;

    if (JSON.stringify(onlineTags) !== JSON.stringify(state)) {
      dispatch(updateOnlineTags(onlineTags));
    }
  };

  const ret: SocketProviderData = {
    isReady,
    val,
    socket,
    sendEvent,
    connect: connectSocket,
    disconnect,
    edgeConnected
  };

  return (
    <SocketContext.Provider value={ret}>
      {props.children}
    </SocketContext.Provider>
  );
};
export const SocketContext = createContext<SocketProviderData>({
  isReady: false,
  val: null,
  socket: null,
  sendEvent: () => undefined,
  connect: () => undefined,
  disconnect: () => undefined,
  edgeConnected: false
});
