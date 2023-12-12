import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { selectAllGames } from '../../../redux/slices/gamesSlice';
import { useAppSelector } from '../../../redux/store';
import { utils, variables } from '../../../utils/mixins';

const DATE_FORMAT = 'YYYY/MM/DD';
interface Props {
  totalLoadData: number;
  totalTimeData: number;
}

const WeeklyHeaderInfo = ({ totalLoadData, totalTimeData }: Props) => {
  const navigation = useNavigation();
  const games = useAppSelector(selectAllGames);

  const generateWeekEvents = useMemo(() => {
    let totalLoad = 0;
    let totalTime = 0;

    const todayWeek = moment(
      moment(new Date()).format(DATE_FORMAT),
      DATE_FORMAT
    )
      .clone()
      .startOf('isoWeek')
      .format(DATE_FORMAT);

    const weekNumber = games[0]
      ? moment(todayWeek, DATE_FORMAT).diff(
        moment(games[0].date, DATE_FORMAT)
          .clone()
          .startOf('isoWeek')
          .format(DATE_FORMAT),
        'weeks'
      )
      : 0;

    games.forEach((game) => {
      if (
        game.status?.isFinal &&
        moment(game.date, DATE_FORMAT).isBefore(todayWeek)
      ) {
        const gameLoad =
          game.report?.stats?.team?.fullSession?.playerLoad?.total || 0;
        const gameTime = game.report?.stats.team.fullSession.duration || 0;
        totalLoad += gameLoad;
        totalTime += gameTime;
      }
    });

    if (weekNumber === 0) {
      return { weekBenchmarkLoad: 0, weekBenchmarkTime: 0, noBenchmark: true };
    }

    const weekBenchmarkLoad = totalLoad / weekNumber;
    const weekBenchmarkTime = totalTime / weekNumber;

    const noBenchmark = totalLoad === 0;

    return { weekBenchmarkLoad, weekBenchmarkTime, noBenchmark };
  }, [games]);

  const { weekBenchmarkLoad, weekBenchmarkTime, noBenchmark } =
    generateWeekEvents;

  const navigate = () => {
    navigation.navigate('WeeklyLoad');
  };

  const renderTotalLoadPoints = () => {
    if (noBenchmark) {
      return (
        <Text style={styles.mainTextNumber}>
          {totalLoadData ? Math.round(totalLoadData) : '-'}
        </Text>
      );
    } else {
      return (
        <View style={styles.benchmarkContainer}>
          <Text style={styles.mainTextNumber}>
            {totalLoadData ? Math.round(totalLoadData) : '-'}
          </Text>
          <View style={styles.lineBreak} />
          <Text
            style={[styles.mainTextNumber, { color: variables.chartLightGrey }]}
          >
            {totalLoadData === 0
              ? 0
              : Math.round((totalLoadData / weekBenchmarkLoad) * 100)}
            %
          </Text>
        </View>
      );
    }
  };

  const renderTotalActivityTime = () => {
    if (noBenchmark) {
      return (
        <Text style={styles.mainTextNumber}>
          {totalTimeData
            ? utils.convertMilisecondsToWeeklyLoadTime(totalTimeData)
            : '-'}
        </Text>
      );
    } else {
      return (
        <View style={styles.benchmarkContainer}>
          <Text style={styles.mainTextNumber}>
            {totalTimeData
              ? utils.convertMilisecondsToWeeklyLoadTime(totalTimeData)
              : '-'}
          </Text>
          <View style={styles.lineBreak} />
          <Text
            style={[styles.mainTextNumber, { color: variables.chartLightGrey }]}
          >
            {totalTimeData === 0
              ? 0
              : Math.round((totalTimeData / weekBenchmarkTime) * 100)}
            %
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.infoContainer}>
      <Pressable onPress={navigate} style={styles.mainContainer}>
        <View>
          <Text style={styles.mainText}>Weekly Team Summary</Text>
        </View>
        <View style={styles.textContainer}>
          {renderTotalLoadPoints()}
          <Text style={styles.subText}>Total Load Points</Text>
        </View>
        <View style={styles.textContainer}>
          {renderTotalActivityTime()}
          <Text style={styles.subText}>Total activity time</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default WeeklyHeaderInfo;

const styles = StyleSheet.create({
  benchmarkContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  infoContainer: {
    backgroundColor: variables.realWhite,
    borderRadius: 20,
    height: 100,
    marginHorizontal: 15,
    marginVertical: 7
  },
  lineBreak: {
    backgroundColor: variables.textBlack,
    height: 14,
    marginHorizontal: 8,
    width: 1
  },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 100,
    justifyContent: 'space-around'
  },
  mainText: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 16
  },
  mainTextNumber: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 24
  },
  subText: {
    color: variables.grey,
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginTop: 5
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
