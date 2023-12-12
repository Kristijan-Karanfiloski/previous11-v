import React, { createContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { selectTrackingEvent } from '../redux/slices/trackingEventSlice';
import { useAppSelector } from '../redux/store';
import { utils } from '../utils/mixins';

type LiveTimerProviderData = {
  timer: number;
  isActive: boolean;
  isPaused: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: (num: number) => void;
  formattedTime: string;
};

type Props = {
  children: React.ReactNode;
};

export const LiveTimerProvider = ({ children }: Props) => {
  const appState = useRef(AppState.currentState);
  const currentTimeRef = useRef(0);
  const activeEvent = useAppSelector(selectTrackingEvent);
  const offset = activeEvent?.status?.startTimestamp || 0;
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const increment = useRef<NodeJS.Timer | null>(null);
  const isMatchEnded = activeEvent?.status?.isFinal;

  useEffect(() => {
    if (activeEvent && !isActive && !isMatchEnded) {
      setTimer(offset ? Math.floor((Date.now() - offset) / 1000) : 0);
      return handleStart();
    }

    if (activeEvent && isMatchEnded && isActive) {
      reset();
    }

    if (!activeEvent && isActive) {
      reset();
    }
  }, [activeEvent, isMatchEnded]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const timeDiff = Math.floor(
          (Date.now() - currentTimeRef.current) / 1000
        );

        if (currentTimeRef.current) {
          updateTimer(timeDiff);
        }

        currentTimeRef.current = 0;
      } else {
        currentTimeRef.current = Date.now();
      }
      appState.current = nextAppState;

      // console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const updateTimer = (seconds: number) => {
    if (!seconds) return;
    setTimer((timer) => timer + seconds);
  };

  const handleStart = () => {
    setIsActive(true);
    increment.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  };

  const handlePause = () => {
    increment.current && clearInterval(increment.current);
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    increment.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  };

  const handleReset = (timerStart = 0) => {
    increment.current && clearInterval(increment.current);
    setIsActive(false);
    setIsPaused(true);
    setTimer(timerStart);
  };

  const reset = () => {
    increment.current && clearInterval(increment.current);
    setIsActive(false);
    setIsPaused(false);
    // setTimer(0);
  };

  const formatTime = () => {
    const totalSeconds = timer;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (!hours) return `${utils.pad(minutes)}:${utils.pad(seconds)}`;
    return `${utils.pad(hours)}:${utils.pad(minutes)}:${utils.pad(seconds)}`;
  };

  const ret: LiveTimerProviderData = {
    timer,
    isActive,
    isPaused,
    start: handleStart,
    pause: handlePause,
    resume: handleResume,
    reset: handleReset,
    formattedTime: formatTime()
  };

  return (
    <LiveTimerContext.Provider value={ret}>
      {children}
    </LiveTimerContext.Provider>
  );
};
export const LiveTimerContext = createContext<LiveTimerProviderData>({
  timer: 0,
  isActive: false,
  isPaused: false,
  start: () => undefined,
  pause: () => undefined,
  resume: () => undefined,
  reset: () => undefined,
  formattedTime: ''
});
