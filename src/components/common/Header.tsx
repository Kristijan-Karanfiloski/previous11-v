import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import moment from 'moment';

import { GameAny, GameType } from '../../../types';
import { selectAuth } from '../../redux/slices/authSlice';
import { selectActiveClub } from '../../redux/slices/clubsSlice';
import { selectAllGames, selectGameById } from '../../redux/slices/gamesSlice';
import { selectTrackingEvent } from '../../redux/slices/trackingEventSlice';
import { useAppSelector } from '../../redux/store';
import { color, commonStyles, palette } from '../../theme';
import { ReportStackParamList, RootStackParamList } from '../../types';
import { getTodayUpcomingEvent } from '../../utils';
import { utils, variables } from '../../utils/mixins';
import LiveIndicatorDot from '../EventCard/LiveIndicatorDot';
import { Icon } from '../icon/icon';

import ConnectionButton from './ConnectionButton';
import CountDown from './Countdown';
import Stopwatch from './Stopwatch';
import SyncButton from './SyncButton';

interface HeaderProps {
  children?: React.ReactNode;
  onRequestFullReport?: () => void;
  isWaitingFullReport?: boolean;
  onBackPressOverride?: () => void;
  backButtonTitle?: string;
}

const Header = (props: HeaderProps) => {
  const navigation = useNavigation() as any;
  const route = useRoute() as RouteProp<
    RootStackParamList,
    'TeamReport' | 'PlayerReport' | 'TeamLive' | 'PlayerLive' | 'Settings'
  >;
  const games = useAppSelector(selectAllGames);
  const activeClub = useAppSelector(selectActiveClub);
  const { customerName } = useAppSelector(selectAuth);

  const isHockey = activeClub.gameType === 'hockey';

  const activeGame = useAppSelector(selectTrackingEvent);
  const reportRoute = route as RouteProp<
    ReportStackParamList,
    'TeamReport' | 'PlayerReport'
  >;
  const reportEvent = useAppSelector((state) =>
    selectGameById(state, reportRoute.params?.eventId)
  ) as GameAny;
  const isMatch = activeGame?.type === GameType.Match;
  const [upcomingEvent, setUpcomingEvent] = useState<GameAny | null>(null);
  const [retrievingData, setRetrievingData] = useState(false);
  const isCurrentRouteReport =
    route.name === 'TeamReport' || route.name === 'PlayerReport';
  const isCurrentRouteLive =
    route.name === 'TeamLive' || route.name === 'PlayerLive';

  const pulseAnimationValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (props.isWaitingFullReport) {
      setRetrievingData(true);
    } else {
      setRetrievingData(false);
    }
  }, [props.isWaitingFullReport]);

  useEffect(() => {
    setUpcomingEvent(getTodayUpcomingEvent(games));
  }, [games]);

  useEffect(() => {
    if (retrievingData) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [retrievingData]);

  const pulseAnimationHandler = () => {
    return Animated.loop(
      // runs given animations in a sequence
      Animated.sequence([
        // increase size
        Animated.timing(pulseAnimationValue, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true
        }),
        // decrease size
        Animated.timing(pulseAnimationValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    );
  };

  const startAnimation = pulseAnimationHandler().start;

  const stopAnimation = pulseAnimationHandler().stop;

  const renderCounter = () => {
    if (!upcomingEvent) return null;

    const { date, dateFormat } = utils.checkAndFormatUtcDate(
      upcomingEvent.UTCdate,
      upcomingEvent.date,
      upcomingEvent.startTime
    );
    const timeLeft = moment(date, dateFormat).valueOf();

    return (
      <Pressable
        onPress={() =>
          navigation.navigate('EventDetailsModal', { event: upcomingEvent })
        }
        style={styles.timerContainer}
      >
        <Text style={styles.timerText}>{`Upcoming ${upcomingEvent.type}`}</Text>
        <View style={styles.divider} />
        <View style={styles.timerWrapper}>
          <CountDown
            onFinish={() => setUpcomingEvent(getTodayUpcomingEvent(games))}
            timeLeft={timeLeft}
            customStyle={{
              fontSize: 27
            }}
          />
        </View>
        <View style={styles.divider} />
        <Icon icon="expand" />
      </Pressable>
    );
  };

  const renderStopwatch = () => {
    if (!activeGame || route.name.toLowerCase().indexOf('live') > -1) {
      return null;
    }
    const drills = activeGame.report?.stats.team.drills || {};
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
  };

  const renderEventInfo = (event: GameAny) => {
    if (isMatch) {
      return (
        <Text
          numberOfLines={1}
          style={styles.reportTextDescription}
        >{`${customerName} vs ${event.versus}`}</Text>
      );
    }

    return (
      <Text style={styles.reportTextDescription}>
        {utils.getTrainingDescription(event?.benchmark?.indicator || null)}
      </Text>
    );
  };

  const renderIncompleteDatasetText = () => {
    if (isCurrentRouteReport) {
      if (reportEvent.status?.isFullReport) return null;
      return (
        <Pressable onPress={() => props.onRequestFullReport?.()}>
          <Animated.View
            style={[
              styles.incompleteDatasetContainer,
              { transform: [{ scale: pulseAnimationValue }] }
            ]}
          >
            <Text style={styles.status}>
              {retrievingData ? 'Retrieving Data' : 'Incomplete dataset'}
            </Text>
            <Icon
              icon="error_icon"
              style={{
                width: 19,
                height: 19
              }}
            />
          </Animated.View>
        </Pressable>
      );
    }

    return null;
  };

  const renderContent = () => {
    if (isCurrentRouteLive && activeGame) {
      return renderEventInfo(activeGame);
    }

    if (isCurrentRouteReport) {
      return null;
    }

    if (activeGame) return renderStopwatch();
    return renderCounter();
  };

  const isLiveMatch = isCurrentRouteLive && activeGame && isMatch;

  return (
    <View>
      <SafeAreaView style={styles.container}>
        <View style={[styles.leftView, !isLiveMatch && { flex: 1 }]}>
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={
              props.onBackPressOverride
                ? props.onBackPressOverride
                : navigation.goBack
            }
            hitSlop={{
              top: 20,
              bottom: 20,
              left: 20,
              right: 20
            }}
          >
            <Ionicons
              name="caret-back-sharp"
              size={17}
              color={palette.orange}
            />
            {props.backButtonTitle && (
              <Text style={styles.backButtonTitle}>
                {props.backButtonTitle}
              </Text>
            )}
          </Pressable>
        </View>

        <View
          style={[
            styles.centerView,
            !isLiveMatch && {
              justifyContent: 'center',
              marginLeft: 0
            }
          ]}
        >
          {renderContent()}
        </View>
        <View style={[styles.rightView, !isLiveMatch && { flex: 1 }]}>
          {renderIncompleteDatasetText()}
          {route.name === 'Settings' && <SyncButton />}
          <View style={styles.connectionContainer}>
            <ConnectionButton />
          </View>
        </View>
      </SafeAreaView>

      <View style={{ flex: 1 }}>{props.children}</View>
      <StatusBar style="light" />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  backButtonTitle: {
    color: variables.realWhite,
    fontFamily: variables.mainFontMedium,
    fontSize: 10,
    marginLeft: 10,
    textTransform: 'uppercase'
  },
  centerView: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginLeft: 40,
    textAlign: 'center'
  },
  connectionContainer: { alignItems: 'center', width: 110 },
  container: {
    alignItems: 'center',
    backgroundColor: palette.black2,
    flexDirection: 'row',
    height: 88,
    paddingHorizontal: 30
  },
  divider: {
    backgroundColor: variables.grey2,
    height: 28,
    marginHorizontal: 8,
    width: 1
  },
  incompleteDatasetContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 10
  },
  leftView: {
    justifyContent: 'flex-end'
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
  reportTextDescription: {
    color: variables.realWhite,
    fontFamily: variables.mainFontSemiBold,
    fontSize: 20
  },
  rightView: {
    alignItems: 'center',

    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  status: {
    color: color.palette.realWhite,
    fontFamily: variables.mainFontBold,
    fontSize: 10,
    marginRight: 7,
    marginTop: 3,
    textTransform: 'uppercase'
  },
  stopwatchWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    minWidth: 115,
    paddingHorizontal: 5
  },
  timerContainer: {
    alignItems: 'center',
    backgroundColor: variables.grey,
    borderColor: variables.grey2,
    borderRadius: 2,
    borderWidth: 1,
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 8
  },
  timerText: {
    color: variables.realWhite,
    fontFamily: variables.mainFontBold,
    lineHeight: 14,
    marginTop: 4,
    width: 70
  },
  timerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    width: 120
  }
});
