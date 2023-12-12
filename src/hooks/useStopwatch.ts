// hooks/useStopWatch.ts

import { useEffect, useRef, useState } from 'react';

import { utils } from '../utils/mixins';

interface StopWatchProps {
  offset?: number;
}

export const useStopWatch = ({ offset = 0 }: StopWatchProps) => {
  const [timer, setTimer] = useState(offset);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const increment = useRef<NodeJS.Timer | null>(null);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
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

  const formatTime = () => {
    const totalSeconds = timer;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (!hours) return `${utils.pad(minutes)}:${utils.pad(seconds)}`;
    return `${utils.pad(hours)}:${utils.pad(minutes)}:${utils.pad(seconds)}`;
  };

  useEffect(() => {
    handleStart();

    return () => {
      increment.current && clearInterval(increment.current);
    };
  }, []);

  return {
    timer,
    isActive,
    isPaused,
    start: handleStart,
    pause: handlePause,
    resume: handleResume,
    reset: handleReset,
    formattedTime: formatTime()
  };
};
