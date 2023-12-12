import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import { GameAny, GameType } from '../../../types';
import { utils, variables } from '../../utils/mixins';

import LeftIndicator from './LeftIndicator';

type Props = {
  event: GameAny;
  linGradIndex: number;
};

const EventCardCalendar = ({ event, linGradIndex }: Props) => {
  const description = useMemo(() => utils.getEventDescription(event), [event]);

  const score = useMemo(() => {
    if (event.type === GameType.Match && event.status?.isFinal) {
      return event.status.scoreResult
        ? `${event.status.scoreUs}-${event.status.scoreThem}`
        : '/-/';
    }
    return null;
  }, [event]);

  const eventDurationInMinutes = useMemo(() => {
    const eventDuration = utils.getEventDuration(event) || 1;
    return Math.ceil(eventDuration / 1000 / 60);
  }, [event]);

  const { date, dateFormat } = utils.checkAndFormatUtcDate(
    event.UTCdate,
    event.date,
    event.startTime
  );

  return (
    <View style={styles.container}>
      <LeftIndicator
        event={event}
        customStyle={{
          borderTopLeftRadius: 2,
          borderBottomLeftRadius: 2
        }}
        linGradIndex={linGradIndex}
      />
      <View style={styles.content}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.startTimeText}>
            {moment(date, dateFormat).format('HH:mm')}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.descText,
              {
                fontFamily: description.isBold
                  ? variables.mainFontBold
                  : variables.mainFontMedium
              }
            ]}
          >
            {description.description !== 'No Category'
              ? description.description
              : 'Training'}
          </Text>
        </View>
        <View style={styles.scoreAndTimeContainer}>
          <Text style={styles.scoreText}>{score}</Text>
          {event.status?.isFinal && (
            <Text style={styles.time}>{eventDurationInMinutes} min</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default EventCardCalendar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: variables.realWhite,
    borderRadius: 2,
    flex: 1,
    flexDirection: 'row'
  },
  content: {
    flex: 1,
    paddingBottom: 2,
    paddingHorizontal: 6,
    paddingTop: 7
  },
  descText: {
    flex: 1,
    fontFamily: variables.mainFontMedium,
    fontSize: 11,
    textAlign: 'right'
  },
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  scoreAndTimeContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between'
  },
  scoreText: {
    fontFamily: variables.mainFont,
    fontSize: 12
  },
  startTimeText: {
    fontFamily: variables.mainFontLight,
    fontSize: 11,
    marginRight: 5
  },
  time: {
    fontFamily: variables.mainFontLight,
    fontSize: 11
  }
});
