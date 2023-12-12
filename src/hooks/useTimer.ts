import { useEffect, useState } from 'react';
import _ from 'lodash';

import { utils } from '../utils/mixins';

const useCountdownTimer = (duration: number, onFinish: () => void) => {
  const [remaining, setRemaining] = useState(duration - Date.now());

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    const throttledOnFinish = _.throttle(onFinish, 1000);
    if (remaining > 0) {
      intervalId = setInterval(() => {
        setRemaining((prev: number) => {
          if (prev <= 1000) {
            clearInterval(intervalId);
            throttledOnFinish();
            return 0;
          }
          return duration - Date.now();
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [remaining]);

  useEffect(() => {
    setRemaining(duration - Date.now());
  }, [duration]);

  const reset = () => setRemaining(0);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days > 0 ? utils.pad(days) + ':' : ''}${utils.pad(
      hours
    )}:${utils.pad(minutes)}:${utils.pad(seconds)}`;
  };

  const time = () => {
    const time = formatTime(remaining).split(':');
    const includeDays = time.length > 3;

    return {
      days: includeDays ? time[0] : null,
      hours: includeDays ? time[1] : time[0],
      minutes: includeDays ? time[2] : time[1],
      seconds: includeDays ? time[3] : time[2]
    };
  };

  return { formattedTime: formatTime(remaining), time: time(), reset };
};

export default useCountdownTimer;
