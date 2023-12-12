import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { GameAny } from '../../../types';
import { selectAuth } from '../../redux/slices/authSlice';
import { selectScheduledGames } from '../../redux/slices/gamesSlice';
import { useAppSelector } from '../../redux/store';
import { utils } from '../../utils/mixins';

import EventDetailsHeader from './EventDetailsHeader';
import PlayerFeedback from './PlayerFeedback';

const UpcomingEvent = () => {
  const auth = useAppSelector(selectAuth);
  const playerId = auth?.playerId || '';
  const allGames = useAppSelector(selectScheduledGames);
  const [showThanksMessage, setShowThanksMessage] = useState(false);
  const [todayStartedGameWithoutReport, setTodayStartedGameWithoutReport] =
    useState<GameAny | undefined>(undefined);

  useEffect(() => {
    if (!showThanksMessage) {
      setTodayStartedGameWithoutReport(getTodayStartedGameWithoutReport());
    }
  }, [showThanksMessage]);

  useEffect(() => {
    if (showThanksMessage) {
      setTimeout(() => setShowThanksMessage(false), 3000);
    }
  }, [showThanksMessage]);

  const getTodayStartedGameWithoutReport = () =>
    allGames.find(({ date, startTime, UTCdate, report, rpe }) => {
      const { date: utcDate, isUtcDate } = utils.checkAndFormatUtcDate(
        UTCdate,
        date,
        startTime
      );

      const gameDate = isUtcDate
        ? moment(utcDate)
        : moment(`${date} ${startTime}`, 'YYYY/MM/DD HH:mm');

      const isToday =
        moment(gameDate).format('YYYY/MM/DD') === moment().format('YYYY/MM/DD');

      const hasPlayerFeedback = rpe && !!rpe[playerId];

      const isBeforeCurrnetTime = moment(gameDate).isBefore(moment());
      return isToday && isBeforeCurrnetTime && !report && !hasPlayerFeedback;
    });

  const getUpcomingGame = () =>
    allGames.find(({ date, startTime, UTCdate }) => {
      const { date: utcDate, isUtcDate } = utils.checkAndFormatUtcDate(
        UTCdate,
        date,
        startTime
      );

      const gameDate = isUtcDate
        ? moment(utcDate)
        : moment(`${date} ${startTime}`, 'YYYY/MM/DD HH:mm');

      return gameDate.isAfter(moment());
    });

  if (todayStartedGameWithoutReport) {
    return (
      <>
        <EventDetailsHeader game={todayStartedGameWithoutReport} isUpcoming />
        <PlayerFeedback
          game={todayStartedGameWithoutReport}
          playerId={playerId}
          showThanksMessage={showThanksMessage}
          setShowThanksMessage={setShowThanksMessage}
        />
      </>
    );
  }

  const upcomingGame = getUpcomingGame();

  if (upcomingGame) {
    return <EventDetailsHeader game={upcomingGame} isUpcoming />;
  }

  return null;
};

export default UpcomingEvent;
