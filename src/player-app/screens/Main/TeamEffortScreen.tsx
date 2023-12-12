import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import moment from 'moment';

import { BasicPlayerStatsNew, GameType } from '../../../../types';
import { Icon } from '../../../components/icon/icon';
import { selectAuth } from '../../../redux/slices/authSlice';
import { selectAllGames } from '../../../redux/slices/gamesSlice';
import { selectAllPlayers } from '../../../redux/slices/playersSlice';
import { useAppSelector } from '../../../redux/store';
import { ActivitiesStackParamList } from '../../../types';
import { variables } from '../../../utils/mixins';
import EventDetailsHeader from '../../components/EventDetailsHeader';
import { getTime } from '../../heleprs';

import {
  getIcon,
  getTotalAndPercentageLoad
} from './ActivityInfo/components/TeamEffort/helpers';

type PlayerData = {
  name: string;
  shirtNumber: number | null;
  percentageOfAverage: number;
  activityTime: string;
  id: string;
};

const TeamEffortScreen = () => {
  const { params } = useRoute() as RouteProp<
    ActivitiesStackParamList,
    'TeamEffort'
  >;
  const event = params.game;
  const isMatch = event.type === GameType.Match;
  const players = params.game.report?.stats.players as Record<
    string,
    BasicPlayerStatsNew
  >;
  const allGames = useAppSelector(selectAllGames);
  const auth = useAppSelector(selectAuth);
  const playerId = auth?.playerId || '';
  const allPlayers = useAppSelector(selectAllPlayers);

  const Row = ({ data }: { data: PlayerData }) => {
    const isCurrentUser = data.id === playerId;
    const { shirtNumber, name, activityTime, percentageOfAverage } = data;
    const icon = getIcon(true, percentageOfAverage);
    const iconStyle = icon === 'spot_on' ? styles.iconSpotOn : styles.iconArrow;
    return (
      <View style={styles.row}>
        {isCurrentUser && <View style={styles.marker} />}
        <Text style={[styles.text, styles.column1]}>
          {shirtNumber && `${shirtNumber}.`}
        </Text>
        <Text style={[styles.text, styles.column2]}>{name}</Text>
        <Text style={[styles.text, styles.column3]}>{activityTime}</Text>
        <View style={[styles.column4, styles.wrapper]}>
          <Text style={styles.text}>{percentageOfAverage}%</Text>
          <Icon
            style={StyleSheet.flatten([styles.icon, iconStyle])}
            icon={icon}
          />
        </View>
      </View>
    );
  };

  const renderPlayers = () => {
    return allPlayers
      .filter(({ id }) => !!players[id])
      .map((player) => {
        const duration = players[player.id].fullSession.duration || 0;
        const playerLoad = players[player.id].fullSession.playerLoad.total;
        const time = getTime(duration / 1000, true);
        const shirtNumber =
          typeof player.tShirtNumber === 'string'
            ? Number(player.tShirtNumber)
            : player.tShirtNumber;
        const activityTime = time
          .split(' ')
          .filter((string) => !string.includes('s'))
          .join(' ');

        const games = allGames.filter((game) => {
          const isPlayerIncluded =
            !!game.report?.stats?.players &&
            !!game.report?.stats?.players[player.id] &&
            game.report?.stats?.players[player.id]?.fullSession.playerLoad
              .total > 5;

          const isDifferentEvent = game.id !== event.id;
          const isBefore = moment(
            `${game.date} ${game.startTime}`,
            'YYYY/MM/DD HH:mm'
          ).isBefore(
            moment(`${event.date} ${event.startTime}`, 'YYYY/MM/DD HH:mm')
          );

          if (isMatch) {
            return isDifferentEvent && isBefore && game.type === GameType.Match;
          }
          const isSameCategory =
            event.benchmark?.indicator === game.benchmark?.indicator;
          return (
            isSameCategory &&
            isPlayerIncluded &&
            isBefore &&
            isDifferentEvent &&
            game.type !== GameType.Match
          );
        });

        const { percentageOfLoad } = getTotalAndPercentageLoad(
          isMatch,
          games,
          event,
          player.id
        );

        const percentageOfAverage = percentageOfLoad;

        return {
          name: player.name,
          shirtNumber,
          percentageOfAverage,
          activityTime,
          id: player.id
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name))
      .sort((a, b) => {
        if (a.shirtNumber === null && b.shirtNumber === null) {
          return 0;
        }
        if (a.shirtNumber === null) {
          return 1;
        }
        if (b.shirtNumber === null) {
          return -1;
        }
        return a.shirtNumber - b.shirtNumber;
      })
      .filter(({ percentageOfAverage }) => !isNaN(percentageOfAverage))
      .map((player) => <Row key={player.id} data={player} />);
  };

  return (
    <View style={{ flex: 1 }}>
      <EventDetailsHeader game={params.game} />
      <View style={styles.headers}>
        <Text style={[styles.header, styles.column1]}>Shirt</Text>
        <Text style={[styles.header, styles.column2]}>Player</Text>
        <Text style={[styles.header, styles.column3]}>Activity time</Text>
        <Text style={[styles.header, styles.column4]}>
          {isMatch ? '% from highest' : '% from avg.'}
        </Text>
      </View>
      <ScrollView>{renderPlayers()}</ScrollView>
    </View>
  );
};

export default TeamEffortScreen;

const styles = StyleSheet.create({
  column1: {
    paddingRight: 18,
    textAlign: 'right',
    width: 46
  },
  column2: {
    flex: 1
  },
  column3: {
    textAlign: 'right',
    width: 70
  },
  column4: {
    textAlign: 'right',
    width: 100
  },
  header: {
    color: variables.grey2,
    fontFamily: variables.mainFont,
    fontSize: 10
  },
  headers: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 44,
    paddingHorizontal: 11,
    paddingTop: 8
  },
  icon: {
    marginLeft: 15
  },
  iconArrow: { height: 12 },
  iconSpotOn: { height: 18 },
  marker: {
    backgroundColor: variables.red,
    borderRadius: 5,
    height: '100%',
    left: 0,
    position: 'absolute',
    width: 5
  },
  row: {
    alignItems: 'center',
    backgroundColor: variables.realWhite,
    borderBottomColor: variables.white,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 44,
    paddingHorizontal: 11
  },
  text: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 12
  },
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});
