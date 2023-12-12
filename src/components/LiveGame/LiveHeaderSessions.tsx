import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import _ from 'lodash';

import {
  EVENT_SUBSESSIONS,
  MATCH_PERIODS_CONCAT,
  utils,
  variables
} from '../../utils/mixins';

interface Props {
  sessions: {
    sessionName: string;
    sessionId: string;
    active?: boolean;
    time: number;
    startTime: number;
  }[];
  handleActiveSubsession: (session: string) => void;
  activeSubSession: string;
}

const LiveHeaderSessions = ({
  sessions,
  handleActiveSubsession,
  activeSubSession
}: Props) => {
  const [isLongPressed, setIsLongPressed] = useState<string>('');
  const [liveDotOpacity] = useState<Animated.Value>(new Animated.Value(1));
  const handleLongPress = (sessionId: string) => {
    if (sessionId === isLongPressed) {
      return setIsLongPressed('');
    }
    return setIsLongPressed(sessionId);
  };
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(liveDotOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(liveDotOpacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(liveDotOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    ).start();
  }, [sessions.length]);

  const scrollViewRef = useRef<ScrollView>(null);

  const scrollViewSizeChanged = (width: number) => {
    scrollViewRef.current?.scrollTo({ x: width, animated: true });
  };

  const generateSessionName = (name: string) => {
    const tagTitle = MATCH_PERIODS_CONCAT.find(
      (item) => item.drillName === name
    )?.tagTitle;

    return tagTitle || name;
  };

  const getSubSessionTagStyle = (sessionId: string) => {
    if (activeSubSession === EVENT_SUBSESSIONS.fullSession) {
      return styles.sessionsBarContainer;
    }

    if (
      activeSubSession === EVENT_SUBSESSIONS.fullGame &&
      _.omit(EVENT_SUBSESSIONS as any, [
        EVENT_SUBSESSIONS.overtime,
        EVENT_SUBSESSIONS.fullSession,
        EVENT_SUBSESSIONS.halftime,
        EVENT_SUBSESSIONS.intermission,
        EVENT_SUBSESSIONS.preMatch
      ])[sessionId as any]
    ) {
      return styles.sessionsBarContainer;
    }

    return [
      styles.sessionsBarContainer,
      activeSubSession !== sessionId && {
        backgroundColor: variables.chartGrey
      }
    ];
  };

  const renderSessionBars = () => {
    if (!sessions.length) return null;
    return sessions.map((session) => {
      const { sessionName, sessionId, active, time } = session;

      return (
        <TouchableOpacity
          onLongPress={() => handleLongPress(sessionId)}
          onPress={() => handleActiveSubsession(sessionId)}
          key={sessionId}
          style={getSubSessionTagStyle(sessionId)}
        >
          {active && sessionId !== 'fullGame' && (
            <Animated.View
              style={[styles.redDot, { opacity: liveDotOpacity }]}
            />
          )}

          <View style={isLongPressed === sessionId ? {} : { maxWidth: 100 }}>
            <Text style={styles.sessionName} numberOfLines={1}>
              {generateSessionName(sessionName)}
            </Text>
          </View>
          <Text style={styles.sessionName}>
            {' '}
            {!active && time !== 0 && utils.convertMilisecondsToTime(time)}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      onContentSizeChange={(width) => {
        scrollViewSizeChanged(width);
      }}
      showsHorizontalScrollIndicator={false}
      horizontal
      style={styles.scrollViewContainer}
    >
      {renderSessionBars()}
    </ScrollView>
  );
};

export default LiveHeaderSessions;

const styles = StyleSheet.create({
  redDot: {
    backgroundColor: variables.red,
    borderRadius: 10,
    height: 7,
    marginRight: 10,
    width: 7
  },
  scrollViewContainer: {
    flexDirection: 'row',
    marginTop: 15
  },
  sessionName: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 12,
    textTransform: 'capitalize'
  },
  sessionsBarContainer: {
    alignItems: 'center',
    backgroundColor: variables.realWhite,
    borderRadius: 8,
    flexDirection: 'row',
    height: 33,
    justifyContent: 'center',
    marginRight: 10,
    paddingHorizontal: 28,
    paddingVertical: 10
  }
});
