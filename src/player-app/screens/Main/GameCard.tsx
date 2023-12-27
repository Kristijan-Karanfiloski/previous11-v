import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { GameAny, IntensityZones } from '../../../../types';
import { Icon } from '../../../components/icon/icon';
import ApiQueue from '../../../helpers/apiQueue';
import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { selectFinishedGamesByPlayer } from '../../../redux/slices/gamesSlice';
import { useAppSelector } from '../../../redux/store';
import { color, commonStyles } from '../../../theme';
import { derivePlayerStats } from '../../../utils/adapter';
import { INTENSITY_ZONES, utils, variables } from '../../../utils/mixins';
import ActivityDescription from '../../components/ActivityDescription';
import PlayerFeedback from '../../components/PlayerFeedback';
import TotalLoadPlayer from '../../components/TotalLoadPlayer';
import { getTrainingTitle, getZonesData } from '../../heleprs';

interface GameCardProps {
  game: GameAny;
  playerId: string;
  testID: string;
}

const GameCard = ({ game, playerId, testID }: GameCardProps) => {
  console.log('GAME FROM GAME CARD :', game);

  const navigation = useNavigation() as any;
  const isMatch = game.type === 'match';
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  const [showThanksMessage, setShowThanksMessage] = useState(false);

  const games = useAppSelector((state) =>
    selectFinishedGamesByPlayer(state, playerId)
  );

  const { trySendQueueRequest } = ApiQueue();

  useEffect(() => {
    if (showThanksMessage) {
      setTimeout(() => setShowThanksMessage(false), 3000);
    }
  }, [showThanksMessage]);

  const showPlayerFeedback = () => {
    const { date: utcDate, isUtcDate } = utils.checkAndFormatUtcDate(
      game.UTCdate,
      game.date,
      game.startTime
    );
    const gameDate = isUtcDate
      ? moment(utcDate)
      : moment(`${game.date} ${game.startTime}`, 'YYYY/MM/DD HH:mm');
    const isToday =
      moment(gameDate).format('YYYY/MM/DD') === moment().format('YYYY/MM/DD');
    const hasPlayerFeedback = game.rpe && !!game.rpe[playerId];
    return isToday && !hasPlayerFeedback;
  };

  const zones = getZonesData(
    (playerId &&
      game.report?.stats?.players[playerId] &&
      game.report?.stats?.players[playerId]?.fullSession &&
      (game.report?.stats?.players[playerId]?.fullSession
        .intensityZones as IntensityZones)) || {
      explosive: 0,
      high: 0,
      low: 0,
      veryHigh: 0,
      moderate: 0
    },
    true
  );

  const timeOnIceData = (playerId &&
    game.report?.stats?.players[playerId] &&
    game.report?.stats?.players[playerId]?.fullSession &&
    game.report?.stats?.players[playerId]?.fullSession?.timeOnIce) || {
    avg: 0,
    max: 0,
    min: 0,
    total: 0,
    series: []
  };

  const playerStats = derivePlayerStats(game, playerId, games);

  const renderGameTitle = () => {
    const isDateYesterday = moment(game.date).isSame(
      moment().clone().subtract(1, 'days').startOf('day'),
      'd'
    );

    const date = isDateYesterday
      ? `Yesterday at ${game.startTime}`
      : `${moment(game.date).format('MMMM DD')} at ${game.startTime}`;

    const trainingTitle = getTrainingTitle(game.benchmark?.indicator);

    const score =
      game.status?.scoreUs && game.status?.scoreThem
        ? `${game.status?.scoreUs}-${game.status?.scoreThem}`
        : null;

    let totalTime = zones.totalTime
      .split(' ')
      .filter((string) => !string.includes('s'))
      .join(' ');

    if (!totalTime) {
      totalTime = zones.totalTime;
    }
    return (
      <View style={styles.gameTitleContainer}>
        {isMatch ? (
          <View>
            <Text style={styles.gameTitle}>
              vs.{' '}
              {game.versus && game.versus?.length > 12
                ? `${game.versus.slice(0, 12)}.`
                : game.versus}
            </Text>
            <Text style={styles.gameTitle}>{score}</Text>
          </View>
        ) : (
          <Text
            style={StyleSheet.flatten([styles.gameTitle, { marginBottom: 11 }])}
          >
            {trainingTitle} training
          </Text>
        )}
        <Text style={styles.gameSubtitle}>
          {date}
          {isMatch && ', ' + game.location}
        </Text>

        <Text style={styles.gameSubtitle}>Activity time: {totalTime}</Text>
      </View>
    );
  };

  const renderTimeOnIceValues = () => {
    if (!timeOnIceData) return null;
    return (
      <>
        <View
          style={{
            flex: 1,
            marginRight: 20
          }}
        >
          <Text style={styles.intensityZoneTitle}>Total</Text>
          <Text style={styles.intensityZoneValue}>
            {utils.convertMilisecondsToTime(timeOnIceData.total * 1000)}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            marginRight: 20
          }}
        >
          <Text style={styles.intensityZoneTitle}>Avg. Ice Time</Text>
          <Text style={styles.intensityZoneValue}>
            {utils.convertMilisecondsToTime(timeOnIceData.avg * 1000)}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            marginRight: 0
          }}
        >
          <Text style={styles.intensityZoneTitle}>Shifts</Text>
          <Text style={styles.intensityZoneValue}>
            {timeOnIceData.series.length}
          </Text>
        </View>
      </>
    );
  };

  const renderZoneValues = () => {
    return INTENSITY_ZONES.slice(0, 3).map((zone, index) => {
      const key = zone.key as
        | 'explosive'
        | 'veryHigh'
        | 'high'
        | 'moderate'
        | 'low';
      return (
        <View
          style={{
            flex: 1,
            marginRight: index !== 2 ? 20 : 0
          }}
          key={index}
        >
          <Text style={styles.intensityZoneTitle}>{zone.label}</Text>
          <Text style={styles.intensityZoneValue}>
            {zones[key as keyof IntensityZones].time}
          </Text>
        </View>
      );
    });
  };

  const renderTimeOnIce = () => {
    if (!timeOnIceData) return null;

    return (
      <View style={{ marginBottom: 28, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', marginTop: 26 }}>
          <Icon icon="hockey_puck" />
          <Text style={styles.intensityTitle}>Time on Ice</Text>
          <View
            style={StyleSheet.flatten([
              commonStyles.line,
              {
                backgroundColor: '#DADADA',
                marginBottom: 0
              }
            ])}
          />
        </View>
        <View
          style={{
            marginTop: 23,
            flexDirection: 'row'
          }}
        >
          {renderTimeOnIceValues()}
        </View>
      </View>
    );
  };

  const renderTimeInZone = () => {
    return (
      <View style={{ marginBottom: 28, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row' }}>
          <MaterialIcons
            name="av-timer"
            size={17}
            color={color.palette.realBlack}
          />
          <Text style={styles.intensityTitle}>Time in Intensity Zones</Text>
          <View
            style={StyleSheet.flatten([
              commonStyles.line,
              {
                backgroundColor: '#DADADA',
                marginBottom: 0
              }
            ])}
          />
        </View>
        <View
          style={{
            marginTop: 23,
            flexDirection: 'row'
          }}
        >
          {renderZoneValues()}
        </View>
      </View>
    );
  };

  const renderDescription = () => {
    if (game.readerList && game.readerList.includes(playerId)) return null;
    const indicator =
      game.benchmark?.indicator === undefined
        ? null
        : game.benchmark?.indicator;
    return (
      <ActivityDescription
        playerStats={playerStats}
        isMatch={isMatch}
        indicator={indicator}
      />
    );
  };

  const showFeedback = showPlayerFeedback();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ marginRight: 'auto' }}>
            {isMatch ? (
              <Icon
                style={{ height: 59, width: 59 }}
                icon={isHockey ? 'match_icehockey' : 'ball_circle'}
              />
            ) : (
              <Icon
                style={{ height: 59, width: 59 }}
                icon={isHockey ? 'training_icehockey' : 'foot_circle'}
              />
            )}
          </View>
          {renderGameTitle()}
        </View>
        <View style={{ alignSelf: 'flex-end' }}>
          <TotalLoadPlayer isMatch={isMatch} playerStats={playerStats} />
        </View>
      </View>
      {isMatch && isHockey && renderTimeOnIce()}
      {!showFeedback && !showThanksMessage && renderDescription()}
      {!showFeedback && !showThanksMessage && renderTimeInZone()}
      {(showFeedback || showThanksMessage) && (
        <PlayerFeedback
          game={game}
          setShowThanksMessage={setShowThanksMessage}
          showThanksMessage={showThanksMessage}
          playerId={playerId}
        />
      )}
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'flex-end'
        }}
      >
        <Pressable
          disabled={showFeedback || showThanksMessage}
          onPress={() => {
            trySendQueueRequest('event_click');
            navigation.navigate('ActivityInfo', {
              game,
              playerStats,
              prevRoute: 'Activities'
            });
          }}
        >
          <Text
            style={[
              styles.viewBtn,
              (showFeedback || showThanksMessage) && {
                color: variables.lighterGrey
              }
            ]}
          >
            View analysis
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default GameCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 13,
    paddingVertical: 23,
    shadowColor: color.palette.realBlack,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  gameSubtitle: {
    color: color.palette.realBlack,
    fontFamily: variables.mainFont,
    fontSize: 10,
    lineHeight: 12.76
  },
  gameTitle: {
    fontFamily: variables.mainFontBold,
    fontSize: 18
  },
  gameTitleContainer: {
    flexDirection: 'column',
    marginLeft: 11
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22
  },
  intensityTitle: {
    color: color.palette.black2,
    fontFamily: variables.mainFontBold,
    fontSize: 14,
    marginLeft: 5,
    marginRight: 12
  },
  intensityZoneTitle: {
    color: color.palette.realBlack,
    fontFamily: variables.mainFont,
    fontSize: 10
  },
  intensityZoneValue: {
    color: color.palette.black2,
    fontFamily: variables.mainFont,
    fontSize: 18,
    marginTop: 8
  },

  viewBtn: {
    color: color.palette.orange,
    fontFamily: variables.mainFontBold,
    fontSize: 14
  }
});
