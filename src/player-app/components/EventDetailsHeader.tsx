import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import { GameAny, GameType } from '../../../types';
import { Icon } from '../../components/icon/icon';
import { selectAuth } from '../../redux/slices/authSlice';
import { selectActiveClub } from '../../redux/slices/clubsSlice';
import { useAppSelector } from '../../redux/store';
import { utils, variables } from '../../utils/mixins';
import { getTrainingTitle, getZonesData } from '../heleprs';
import CardContainer from '../screens/Main/ActivityInfo/components/CardContainer';

type Props = {
  game: GameAny;
  isUpcoming?: boolean;
};

const EventDetailsHeader = ({ game, isUpcoming }: Props) => {
  const activeClub = useAppSelector(selectActiveClub);
  const auth = useAppSelector(selectAuth);
  const isMatch = game.type === GameType.Match;
  const playerId = auth?.playerId || '';
  const isHockey = activeClub.gameType === 'hockey';
  const icon = isMatch
    ? isHockey
      ? 'match_icehockey'
      : 'ball_circle'
    : isHockey
      ? 'training_icehockey'
      : 'foot_circle';

  const renderEventTitle = () => {
    if (isMatch) {
      return (
        <View>
          <Text style={styles.eventTitle}>
            vs.{' '}
            {game.versus && game.versus?.length > 12
              ? `${game.versus.slice(0, 12)}.`
              : game.versus}
          </Text>
          {!isUpcoming && (
            <Text style={styles.eventTitle}>
              {game.status?.scoreUs}-{game.status?.scoreThem}
            </Text>
          )}
        </View>
      );
    }
    const trainingTitle = getTrainingTitle(game.benchmark?.indicator);

    return <Text style={styles.eventTitle}>{trainingTitle} training</Text>;
  };

  const renderEventDetails = () => {
    const zones = getZonesData(
      game.report?.stats.players[playerId].fullSession.intensityZones,
      true
    );
    const { date: formatedDate } = utils.checkAndFormatUtcDate(
      game.UTCdate,
      game.date,
      game.startTime
    );
    const date = moment(formatedDate);
    let dateText = `${date.format('MMMM DD')} at ${date.format('HH:mm')}`;
    const isDateYesterday = moment(game.date).isSame(
      moment().clone().subtract(1, 'days').startOf('day'),
      'd'
    );
    const isDateTomorrow = moment(game.date).isSame(
      moment().clone().add(1, 'days').startOf('day'),
      'd'
    );
    const isToday = moment(game.date).isSame(
      moment().clone().startOf('day'),
      'd'
    );

    if (isDateYesterday) {
      dateText = `Yesterday at ${date.format('HH:mm')}`;
    } else if (isDateTomorrow) {
      dateText = `Tomorrow at ${date.format('HH:mm')}`;
    } else if (isToday) {
      dateText = `Today at ${date.format('HH:mm')}`;
    }

    let totalTime = zones.totalTime
      .split(' ')
      .filter((string) => !string.includes('s'))
      .join(' ');

    if (!totalTime) {
      totalTime = zones.totalTime;
    }

    const primaryText = isUpcoming
      ? 'Upcoming activity'
      : `${dateText}${isMatch ? ', ' + game.location : ''}`;
    const secondaryText = isUpcoming
      ? `${dateText}${isMatch ? ', ' + game.location : ''}`
      : `Activity time: ${totalTime}`;
    return (
      <View>
        <Text
          style={StyleSheet.flatten([
            styles.eventDetailsText,
            { marginBottom: 6 }
          ])}
        >
          {primaryText}
        </Text>
        <Text style={styles.eventDetailsText}>{secondaryText}</Text>
      </View>
    );
  };

  return (
    <CardContainer style={styles.eventDetailsCard}>
      <View style={styles.eventDetailsContent}>
        <View style={styles.eventHeader}>
          <Icon style={styles.eventTypeIcon} icon={icon} />
          {renderEventTitle()}
        </View>
        {renderEventDetails()}
      </View>
    </CardContainer>
  );
};

export default EventDetailsHeader;

const styles = StyleSheet.create({
  eventDetailsCard: {
    marginBottom: 0,
    paddingVertical: 12
  },
  eventDetailsContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  eventDetailsText: {
    color: variables.black,
    fontFamily: variables.mainFontLight,
    fontSize: 12
  },
  eventHeader: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  eventTitle: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 18
  },
  eventTypeIcon: {
    height: 40,
    marginRight: 16,
    width: 40
  }
});
