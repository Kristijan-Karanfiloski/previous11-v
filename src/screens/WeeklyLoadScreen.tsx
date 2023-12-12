import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { DropdownFilterKeys, FilterStateType } from '../../types';
import ToggleButton from '../components/Buttons/ToggleButton';
import WeeklyLoadHeader from '../components/WeeklyLoad/Header/WeeklyLoadHeader';
import WeeklyLoadInfoHeader from '../components/WeeklyLoad/Header/WeeklyLoadInfoHeader';
import WeeklyFeedbackStats from '../components/WeeklyLoad/StatsScreens/WeeklyFeedbackStats';
import WeeklyPlayersStats from '../components/WeeklyLoad/StatsScreens/WeeklyPlayersStats';
import WeeklyTeamStats from '../components/WeeklyLoad/StatsScreens/WeeklyTeamStats';
import {
  emptyTimeInzone,
  emptyWeeklyPlayersData,
  weeklyLoadData
} from '../helpers/chartHelpers';
import { getCurrentWeek } from '../redux/slices/currentWeek';
import { selectComparisonFilter } from '../redux/slices/filterSlice';
import { selectAllGames } from '../redux/slices/gamesSlice';
import { selectAllPlayers } from '../redux/slices/playersSlice';
import { useAppSelector } from '../redux/store';
import { filterGamesByDateAndStatus } from '../utils';
import { variables } from '../utils/mixins';

const WeeklyLoadScreen = () => {
  const games = useAppSelector(selectAllGames);
  const allPlayers = useAppSelector(selectAllPlayers);
  const currentWeek = useAppSelector((store) => getCurrentWeek(store));
  const comparisonFilter = useAppSelector((store) =>
    selectComparisonFilter(store, FilterStateType.weeklyLoad)
  );

  const [currentViewMode, setCurrentViewMode] = React.useState<
    'player_stats' | 'team_stats' | 'feedback'
  >('team_stats');

  const getCompareEvents = () => {
    switch (comparisonFilter.key) {
      case DropdownFilterKeys.LAST_WEEK:
        return filterGamesByDateAndStatus(
          games,
          currentWeek.start,
          currentWeek.end,
          7,
          7
        );
      case DropdownFilterKeys.LAST_4_WEEK:
        return filterGamesByDateAndStatus(
          games,
          currentWeek.start,
          currentWeek.end,
          28,
          7
        );
      case DropdownFilterKeys.SELECTED_WEEK:
        return comparisonFilter.selectedWeek?.weekEvents || [];
      default:
        return [];
    }
  };

  const weekEvents = filterGamesByDateAndStatus(
    games,
    currentWeek.start,
    currentWeek.end
  );

  const weekData = useMemo(() => {
    const { totalLoad, timeInZone, weeklyOverview, headerData, playersData } =
      weeklyLoadData(weekEvents, allPlayers);
    return { totalLoad, timeInZone, weeklyOverview, headerData, playersData };
  }, [currentWeek.start, currentWeek.end, weekEvents, allPlayers]);

  const compareData = useMemo(() => {
    const compareEvents = getCompareEvents();
    if (!compareEvents.length) {
      return {
        totalLoad: 0,
        timeInZone: emptyTimeInzone,
        playersData: emptyWeeklyPlayersData
      };
    }

    const { totalLoad, timeInZone, playersData } = weeklyLoadData(
      compareEvents,
      allPlayers
    );
    return { totalLoad, timeInZone, playersData };
  }, [comparisonFilter.key, allPlayers]);

  const renderStats = () => {
    if (currentViewMode === 'player_stats') {
      return (
        <WeeklyPlayersStats
          playersData={weekData.playersData}
          compareData={compareData.playersData}
        />
      );
    }

    if (currentViewMode === 'team_stats') {
      return <WeeklyTeamStats weekData={weekData} compareData={compareData} />;
    }
    return <WeeklyFeedbackStats weekEvents={weekEvents} />;
  };

  return (
    <View style={{ flex: 1 }}>
      <View>
        <WeeklyLoadHeader />
        <WeeklyLoadInfoHeader headerData={weekData.headerData} />
      </View>
      <View style={styles.viewSwitch}>
        <ToggleButton
          onClick={() => setCurrentViewMode('team_stats')}
          isActive={currentViewMode === 'team_stats'}
          content="Team Stats"
          position="left"
        />

        <ToggleButton
          onClick={() => setCurrentViewMode('player_stats')}
          position="right"
          isActive={currentViewMode === 'player_stats'}
          content="Player Stats"
        />

        <ToggleButton
          onClick={() => setCurrentViewMode('feedback')}
          position="right"
          isActive={currentViewMode === 'feedback'}
          content="Feedback"
        />
      </View>
      {renderStats()}
    </View>
  );
};

export default WeeklyLoadScreen;

const styles = StyleSheet.create({
  viewSwitch: {
    alignItems: 'center',
    backgroundColor: variables.backgroundColor,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'center',
    marginVertical: 15,
    minWidth: 305
  }
});
