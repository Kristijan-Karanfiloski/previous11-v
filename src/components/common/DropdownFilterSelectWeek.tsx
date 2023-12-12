import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';

import { FilterStateType, GameAny, GameType } from '../../../types';
import { weeklyLoadData } from '../../helpers/chartHelpers';
import { getCurrentWeek } from '../../redux/slices/currentWeek';
import { selectComparisonFilter } from '../../redux/slices/filterSlice';
import { selectAllGames } from '../../redux/slices/gamesSlice';
import { selectAllPlayers } from '../../redux/slices/playersSlice';
import { useAppSelector } from '../../redux/store';
import { filterGamesByDateAndStatus } from '../../utils';
import {
  DROPDOWN_DATA_WEEKLY_LOAD,
  utils,
  variables
} from '../../utils/mixins';

export type WeekSelectItem = {
  totalLoad: number;
  headerData: {
    trainingTime: number;
    matchTime: number;
  };
  weekNumber: string;
  sessions: string;
  title: string;
  label: string;
  weekEvents: GameAny[];
};

interface Props {
  onItemPress: (item: {
    label: string;
    value: string;
    text: string;
    icon: string;
    key: string;
    disabled?: boolean;
    selectedWeek?: WeekSelectItem;
  }) => void;
}

const DropdownFilterSelectWeek = ({ onItemPress }: Props) => {
  const games = useAppSelector(selectAllGames);
  const allPlayers = useAppSelector(selectAllPlayers);
  const currentWeek = useAppSelector((store) => getCurrentWeek(store));

  const comparisonFilter = useAppSelector((store) =>
    selectComparisonFilter(store, FilterStateType.weeklyLoad)
  );

  const weekData = (weekCount = 0) => {
    const calculateDate = (baseDate: any, days: number) =>
      moment(baseDate)
        .subtract(weekCount * 35 + days, 'days')
        .format('YYYY/MM/DD');

    return Array.from({ length: 5 }, (_, i) => {
      const startDate = weekCount
        ? calculateDate(currentWeek.start, i * 7)
        : currentWeek.start;
      const endDate = weekCount
        ? calculateDate(currentWeek.end, i * 7)
        : currentWeek.end;
      const dayToSubtract = (i + 1) * 7;
      const weeklyFilteredGames = filterGamesByDateAndStatus(
        games,
        startDate,
        endDate,
        dayToSubtract,
        dayToSubtract
      );

      const { totalLoad, headerData } = weeklyLoadData(
        weeklyFilteredGames,
        allPlayers
      );

      const { training: trainingSessions, match: matchSessions } =
        weeklyFilteredGames.reduce(
          (sessions, game) => {
            game.type === GameType.Match
              ? (sessions.match += 1)
              : (sessions.training += 1);
            return sessions;
          },
          { training: 0, match: 0 }
        );

      const sessionsString =
        trainingSessions === 0 && matchSessions === 0
          ? 'No sessions'
          : [
              trainingSessions > 0 &&
                `${trainingSessions} training${
                  trainingSessions > 1 ? 's' : ''
                }`,
              matchSessions > 0 &&
                `${matchSessions} match${matchSessions > 1 ? 'es' : ''}`
            ]
              .filter(Boolean)
              .join(', ');

      const weekNumber = moment(startDate)
        .subtract(dayToSubtract, 'days')
        .week();
      const weekStartMoment = moment(startDate).subtract(dayToSubtract, 'days');
      const weekEndMoment = moment(endDate).subtract(dayToSubtract, 'days');
      const isSameMonth = weekStartMoment.isSame(weekEndMoment, 'month');
      const weekStartDay = weekStartMoment.format(
        isSameMonth ? 'DD.' : 'DD. MMMM'
      );
      const weekEndDay = weekEndMoment.format('DD. MMMM');
      const weekLabel = `${weekStartMoment.format(
        'DD/MM'
      )}-${weekEndMoment.format('DD/MM')}`;

      return {
        totalLoad,
        headerData,
        weekNumber: `week ${weekNumber}`,
        sessions: sessionsString,
        title: `${weekStartDay} - ${weekEndDay}`,
        label: weekLabel,
        weekEvents: weeklyFilteredGames
      };
    });
  };

  const [selectWeekData, setSelectWeekData] = useState(weekData());

  const generateNextData = (weekCount: number) => {
    const newData = weekData(weekCount);
    setSelectWeekData([...selectWeekData, ...newData]);
  };

  const renderItem = ({ item }: { item: WeekSelectItem }) => {
    const isActive =
      comparisonFilter.selectedWeek?.weekNumber === item.weekNumber;
    const totalTime = item.headerData.matchTime + item.headerData.trainingTime;

    const containerStyle = StyleSheet.flatten([
      styles.itemContainer,
      isActive ? { backgroundColor: variables.black } : {}
    ]);
    const headerStyle = StyleSheet.flatten([
      styles.itemHeaderTitle,
      isActive ? { color: variables.realWhite } : {}
    ]);
    const weekNumber = StyleSheet.flatten([
      styles.itemHeaderWeek,
      isActive ? { color: variables.realWhite } : {}
    ]);
    const bodyLeftTextStyle = StyleSheet.flatten([
      styles.itemTitle,
      isActive ? { color: variables.realWhite } : {}
    ]);

    const bodyRightTextStyle = StyleSheet.flatten([
      styles.itemText,
      isActive ? { color: variables.realWhite } : {}
    ]);

    const filterItem = { ...DROPDOWN_DATA_WEEKLY_LOAD[3] };

    return (
      <TouchableOpacity
        onPress={() => onItemPress({ ...filterItem, selectedWeek: item })}
        style={containerStyle}
      >
        <View style={styles.itemHeader}>
          <Text style={headerStyle}>{item.title}</Text>
          <Text style={weekNumber}>{item.weekNumber}</Text>
        </View>
        <View style={styles.itemBody}>
          <View style={styles.itemBodyLeft}>
            <Text style={bodyLeftTextStyle}>Weekly Load:</Text>
            <Text style={bodyLeftTextStyle}>Total Time:</Text>
            <Text style={bodyLeftTextStyle}>Sessions:</Text>
          </View>
          <View>
            <Text style={bodyRightTextStyle}>{item.totalLoad}</Text>
            <Text style={bodyRightTextStyle}>
              {utils.convertMilisecondsToWeeklyLoadTime(totalTime)}
            </Text>
            <Text style={bodyRightTextStyle}>{item.sessions}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={selectWeekData}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      style={styles.flatlistContainer}
      onEndReached={() => {
        generateNextData(selectWeekData.length / 5);
      }}
    />
  );
};

export default DropdownFilterSelectWeek;

const styles = StyleSheet.create({
  flatlistContainer: {
    borderBottomColor: variables.lineGrey,
    borderBottomWidth: 1,
    marginTop: 18,
    maxHeight: 400
  },
  itemBody: {
    flexDirection: 'row',
    marginBottom: 5
  },
  itemBodyLeft: {
    marginRight: 16
  },
  itemContainer: {
    marginBottom: 15,
    padding: 5
  },
  itemHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 7
  },
  itemHeaderTitle: {
    fontFamily: variables.mainFontBold,
    fontSize: 18
  },
  itemHeaderWeek: {
    fontFamily: variables.mainFontMedium,
    fontSize: 12
  },
  itemText: {
    fontFamily: variables.mainFont,
    fontSize: 14
  },
  itemTitle: {
    fontFamily: variables.mainFontBold,
    fontSize: 14
  }
});
