import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { GameAny, GameType } from '../../types';
import Stopwatch from '../components/common/Stopwatch';
import { selectActiveClub } from '../redux/slices/clubsSlice';
import { selectAllGames } from '../redux/slices/gamesSlice';
import { selectTrackingEvent } from '../redux/slices/trackingEventSlice';
import { useAppSelector } from '../redux/store';
import { commonStyles } from '../theme';
import { getTodayUpcomingEvent } from '../utils';
import { utils, variables } from '../utils/mixins';

import LiveIndicatorDot from './EventCard/LiveIndicatorDot';
import { Icon } from './icon/icon';
import UpcomingEventCountdown from './UpcomingEventCountdown';

interface Props {
  type?: 'button' | null;
}

export default function UpcomingEvent({ type = null }: Props) {
  const navigation = useNavigation();
  const games = useAppSelector(selectAllGames);
  const activeEvent = useAppSelector(selectTrackingEvent);
  const [upcomingEvent, setUpcomingEvent] = useState<GameAny | null>(null);
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';

  useEffect(() => {
    setUpcomingEvent(getTodayUpcomingEvent(games));
  }, [games]);

  const onTimerPress = () => {
    if (upcomingEvent) {
      navigation.navigate('EventDetailsModal', { event: upcomingEvent });
    }
  };

  const onCounterFinish = (games: GameAny[]) => {
    if (upcomingEvent) {
      navigation.navigate('EventDetailsModal', { event: upcomingEvent });
    }
    setUpcomingEvent(getTodayUpcomingEvent(games));
  };

  if (activeEvent) {
    if (type === 'button') {
      return (
        <Pressable
          onPress={() => navigation.navigate('LiveView')}
          style={[styles.container, styles.btnContainerLive]}
        >
          <View style={styles.liveTextWrapper}>
            <View style={styles.stopwatchWrapper}>
              <Stopwatch
                customStyle={{ fontSize: 27, backgroundColor: variables.red }}
              />
            </View>
          </View>
        </Pressable>
      );
    }
    const drills = activeEvent.report?.stats.team.drills || {};
    const isFirstPeriodEnded = drills?.firstPeriod?.duration || false;
    const isSecondPeriodStarted = drills?.secondPeriod?.startTimestamp || false;
    const isSecondPeriodEnded = drills?.secondPeriod?.duration || false;
    const isThirdPeriodStarted = drills?.thirdPeriod?.startTimestamp || false;

    const isIntermission =
      (isFirstPeriodEnded && !isSecondPeriodStarted) ||
      (isSecondPeriodEnded && !isThirdPeriodStarted);
    return (
      <Pressable
        onPress={() => navigation.navigate('LiveView')}
        style={styles.timerContainer}
      >
        <View style={styles.liveTextWrapper}>
          <Text style={styles.liveText}>LIVE</Text>
          <LiveIndicatorDot customStyle={commonStyles.dot} />
        </View>

        {isHockey && !isIntermission
          ? null
          : (
          <>
            <View style={styles.divider} />
            <View style={styles.stopwatchWrapper}>
              <Stopwatch customStyle={{ fontSize: 27 }} />
            </View>
          </>
            )}
        <View style={styles.divider} />
        <Icon icon="expand" />
      </Pressable>
    );
  }

  if (upcomingEvent) {
    if (type === 'button') {
      return (
        <Pressable
          onPress={onTimerPress}
          style={[styles.container, styles.btnContainer]}
        >
          <Text style={[styles.text, styles.btnText]}>Start Tracking</Text>
        </Pressable>
      );
    }
    const { date, dateFormat } = utils.checkAndFormatUtcDate(
      upcomingEvent.UTCdate,
      upcomingEvent.date,
      upcomingEvent.startTime
    );
    const timeLeft = moment(date, dateFormat).valueOf();
    return (
      <Pressable onPress={onTimerPress}>
        <UpcomingEventCountdown
          timeLeft={timeLeft}
          onFinish={() => onCounterFinish(games)}
          isMatch={upcomingEvent.type === GameType.Match}
        />
      </Pressable>
    );
  }

  if (!type) {
    return (
      <Pressable
        onPress={() => navigation.navigate('CreateEventModal', {})}
        style={[styles.container, styles.btnTracking]}
      >
        <Text
          style={[
            styles.text,
            {
              paddingVertical: 13
            }
          ]}
        >
          Start Tracking
        </Text>
        <Icon icon="record_red" />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => navigation.navigate('CreateEventModal', {})}
      style={[styles.container, styles.btnContainer]}
    >
      <Text style={[styles.text, styles.btnText]}>Create New</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: variables.realWhite,
    borderColor: variables.red,
    borderRadius: 18
  },
  btnContainerLive: {
    backgroundColor: variables.red,
    borderColor: variables.red,
    borderRadius: 18
  },
  btnText: {
    color: variables.red,
    marginLeft: 0
  },
  btnTracking: {
    backgroundColor: variables.grey,
    borderRadius: 20,
    height: 77,
    justifyContent: 'space-evenly',
    marginBottom: 11,
    width: 253
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(38, 39, 42, 0.5)',
    borderColor: variables.grey,
    borderRadius: 2,
    borderWidth: 1,
    flexDirection: 'row',
    height: 50,
    paddingHorizontal: 14
  },
  divider: {
    backgroundColor: variables.grey2,
    height: 28,
    marginHorizontal: 8,
    width: 1
  },
  liveText: {
    color: variables.realWhite,
    fontFamily: variables.mainFontMedium,
    fontSize: 20,
    marginRight: 9
  },
  liveTextWrapper: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  stopwatchWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    minWidth: 110,
    paddingHorizontal: 5
  },
  text: {
    color: variables.realWhite,
    fontFamily: variables.mainFontMedium,
    fontSize: 20,
    marginLeft: 10
  },
  timerContainer: {
    alignItems: 'center',
    backgroundColor: variables.grey,
    borderRadius: 20,
    flexDirection: 'row',
    height: 77,
    marginBottom: 11,
    paddingHorizontal: 15,
    width: 253
  }
});
