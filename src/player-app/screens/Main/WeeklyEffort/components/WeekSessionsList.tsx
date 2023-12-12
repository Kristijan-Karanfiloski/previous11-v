import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import { GameAny, GameType } from '../../../../../../types';
import { Icon } from '../../../../../components/icon/icon';
import { IconTypes } from '../../../../../components/icon/icons';
import { selectAuth } from '../../../../../redux/slices/authSlice';
import { selectActiveClub } from '../../../../../redux/slices/clubsSlice';
import { selectAllGames } from '../../../../../redux/slices/gamesSlice';
import { useAppSelector } from '../../../../../redux/store';
import { variables } from '../../../../../utils/mixins';
import {
  getTime,
  getTrainingTitle,
  WeeklyEffortData
} from '../../../../heleprs';

type Props = {
  data: WeeklyEffortData;
  activeWeek: number;
  playerId: string;
};

const SessionCard = ({
  game,
  upcomming
}: {
  game: GameAny;
  upcomming?: boolean;
}) => {
  const auth = useAppSelector(selectAuth);
  const playerId = auth?.playerId || '';
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  const getTotalTime = (game: GameAny, playerId: string) => {
    const totalSeconds = Math.round(
      (game.report?.stats.players[playerId]?.fullSession.intensityZones
        .explosive || 0) +
        (game.report?.stats.players[playerId]?.fullSession.intensityZones
          .high || 0) +
        (game.report?.stats.players[playerId]?.fullSession.intensityZones.low ||
          0) +
        (game.report?.stats.players[playerId]?.fullSession.intensityZones
          .moderate || 0) +
        (game.report?.stats.players[playerId]?.fullSession.intensityZones
          .veryHigh || 0)
    );

    return getTime(totalSeconds, true);
  };

  const isMatch = game.type === GameType.Match;
  const dateMoment = moment(
    `${game.date} ${game.startTime}`,
    'YYYY/MM/DD HH:mm'
  );
  const date = dateMoment.format('MMMM D');
  const time = dateMoment.format('h:mm a');

  const title = isMatch
    ? `vs. ${game.versus} ${game.status?.scoreUs || '/'}-${
        game.status?.scoreThem || '/'
      }`
    : `${getTrainingTitle(game.benchmark?.indicator)} Training`;

  const teims = getTotalTime(game, playerId);
  let totalTime = teims
    .split(' ')
    .filter((string) => !string.includes('s'))
    .join(' ');

  if (!totalTime) {
    totalTime = teims;
  }
  const load =
    game.report?.stats.players[playerId]?.fullSession?.playerLoad?.total || 0;

  let icon: IconTypes = 'ball_circle';
  let iconUpcoming: IconTypes = 'icehockey_puck';

  if (isHockey) {
    icon = isMatch ? 'match_icehockey' : 'training_icehockey';
    iconUpcoming = isMatch ? 'icehockey_goal' : 'icehockey_skate';
  } else {
    icon = isMatch ? 'ball_circle' : 'foot_circle';
    iconUpcoming = isMatch ? 'football' : 'footballBoot';
  }

  return (
    <View style={styles.sessionCard}>
      <Icon
        style={styles.sessionCardIcon}
        icon={upcomming ? iconUpcoming : icon}
      />
      <View>
        <Text style={styles.textPrimary}>{`${date} at ${time}`}</Text>
        <Text style={styles.textSecondary}>{title}</Text>
        {!upcomming && <Text style={styles.textTertiery}>{totalTime}</Text>}
      </View>
      {!upcomming && <Text style={styles.textLoad}>{Math.round(load)}</Text>}
    </View>
  );
};

const WeekSessionsList = ({ data, activeWeek, playerId }: Props) => {
  const isCurrentWeek = activeWeek === 0;
  const allGames = useAppSelector(selectAllGames);

  const getUpcomingGames = (games: GameAny[]) => {
    const [startDate, endDate] = data.name.split('-');

    return games.filter((item) => {
      const isInCurrentWeek =
        moment(item.date, 'YYYY/MM/DD').isSameOrAfter(
          moment(startDate, 'YYYY/MM/DD')
        ) &&
        moment(item.date, 'YYYY/MM/DD').isSameOrBefore(
          moment(endDate, 'YYYY/MM/DD')
        );

      const isFinal = item.status?.isFinal;
      const playerIsIncluded =
        item.preparation?.playersInPitch.includes(playerId) ||
        item.preparation?.playersInPitch.includes(playerId);

      return !isFinal && isInCurrentWeek && playerIsIncluded;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.section}>Completed activites this week</Text>
      {data.sessions.map((game) => (
        <SessionCard key={game.id} game={game} />
      ))}
      {isCurrentWeek && !!getUpcomingGames(allGames).length && (
        <>
          <Text style={{ ...styles.section, marginTop: 16 }}>
            Upcoming activites this week
          </Text>
          {getUpcomingGames(allGames).map((game, i) => (
            <SessionCard key={i} game={game} upcomming />
          ))}
        </>
      )}
    </View>
  );
};

export default WeekSessionsList;

const styles = StyleSheet.create({
  container: {
    marginVertical: 21
  },
  section: {
    color: variables.grey2,
    fontFamily: variables.mainFontLight,
    fontSize: 10,
    paddingBottom: 6,
    paddingLeft: 16
  },
  sessionCard: {
    alignItems: 'center',
    backgroundColor: variables.realWhite,
    flexDirection: 'row',
    marginBottom: 1,
    padding: 16,
    paddingRight: 20
  },
  sessionCardIcon: { height: 60, marginRight: 16, width: 60 },
  textLoad: {
    fontFamily: variables.mainFontBold,
    fontSize: 18,
    marginLeft: 'auto'
  },
  textPrimary: {
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginBottom: 4
  },
  textSecondary: {
    fontFamily: variables.mainFont,
    fontSize: 16,
    marginBottom: 8
  },
  textTertiery: {
    color: variables.grey2,
    fontFamily: variables.mainFont,
    fontSize: 12
  }
});
