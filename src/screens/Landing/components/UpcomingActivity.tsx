import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import { GameAny } from '../../../../types';
import LinearGradientView from '../../../components/LinearGradientView';
import UpcomingEvent from '../../../components/UpcomingEvent';
import { selectAllGames } from '../../../redux/slices/gamesSlice';
import { selectTrackingEvent } from '../../../redux/slices/trackingEventSlice';
import { useAppSelector } from '../../../redux/store';
import { getTodayUpcomingEvent } from '../../../utils';
import { utils, variables } from '../../../utils/mixins';

const UpcomingActivity = () => {
  const games = useAppSelector(selectAllGames);
  const activeEvent = useAppSelector(selectTrackingEvent);
  const [upcomingEvent, setUpcomingEvent] = useState<GameAny | null>(null);

  useEffect(() => {
    setUpcomingEvent(getTodayUpcomingEvent(games));
  }, [games]);

  const colors = [
    { offset: 0, color: activeEvent ? variables.red : '#9899A0' },
    { offset: 1, color: activeEvent ? variables.red : '#9899A0' }
  ];

  const renderData = () => {
    if (!activeEvent && !upcomingEvent) {
      return <Text style={styles.subText}>No planned sessions.</Text>;
    }

    let event;
    if (activeEvent) {
      event = activeEvent;
    } else {
      event = upcomingEvent;
    }
    if (event) {
      const text = utils.getEventDescription(event);

      const { date, dateFormat } = utils.checkAndFormatUtcDate(
        event.UTCdate,
        event.date,
        event.startTime
      );

      return (
        <View style={styles.leftInfoContainer}>
          <LinearGradientView
            colors={colors}
            linearGradient={{ y2: '100%' }}
            style={styles.gradientContainer}
          />
          <View>
            <Text style={styles.subHeadingText}>{text.description}</Text>
            <Text style={styles.subText}>
              Today at {moment(date, dateFormat).format('HH:mm')}
            </Text>
            <Text style={styles.subText}>
              {event.preparation?.playersInPitch?.length || 0} players
            </Text>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headingText}>Upcoming Activity</Text>
      <View style={styles.infoContainer}>
        {renderData()}
        {activeEvent && (
          <View>
            <Text style={styles.dataText}>
              {Math.round(
                activeEvent.report?.stats?.team?.fullSession?.playerLoad
                  ?.total || 0
              ) || 0}
            </Text>
          </View>
        )}
        <View>
          <UpcomingEvent type={'button'} />
        </View>
      </View>
    </View>
  );
};

export default UpcomingActivity;

const styles = StyleSheet.create({
  dataText: {
    fontFamily: variables.mainFont,
    fontSize: 32
  },
  gradientContainer: {
    borderRadius: 15,
    height: 50,
    marginRight: 15,
    width: 7
  },
  headingText: {
    fontFamily: variables.mainFont,
    fontSize: 24,
    marginBottom: 5
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  leftInfoContainer: {
    flexDirection: 'row'
  },
  mainContainer: {
    padding: 25
  },
  subHeadingText: {
    fontFamily: variables.mainFontBold,
    fontSize: 15
  },
  subText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 11
  }
});
