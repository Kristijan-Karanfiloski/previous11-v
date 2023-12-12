import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { DropdownFilterKeys, FilterStateType } from '../../../../types';
import {
  emptyTimeInzone,
  emptyWeeklyOverview,
  emptyWeeklyPlayersData,
  generateCustomLegendWeeklyOverview,
  generateWeeklyLoadTimeInZoneData,
  generateWeeklyOverviewHorizontalLines,
  generateWeeklyOverviewVerticalLines,
  generateWeeklyTotalLoadData,
  weeklyLoadData
} from '../../../helpers/chartHelpers';
import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { getCurrentWeek } from '../../../redux/slices/currentWeek';
import { selectComparisonFilter } from '../../../redux/slices/filterSlice';
import { selectAllGames } from '../../../redux/slices/gamesSlice';
import { selectAllPlayers } from '../../../redux/slices/playersSlice';
import { useAppSelector } from '../../../redux/store';
import { RootStackParamList, ZoneSelector } from '../../../types';
import { filterGamesByDateAndStatus } from '../../../utils';
import {
  CHART_TITLES,
  EXPLANATION_TYPES,
  TYPE_OF_ZONE_SELECTOR,
  WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR
} from '../../../utils/mixins';
import ChartGrid from '../../charts/ChartGrid';
import ChartsContainer from '../../charts/ChartsContainer';
import TimeInZoneChart from '../../charts/chartTypes/TimeInZoneChart';
import TotalLoadChart from '../../charts/chartTypes/TotalLoadChart';
import WeeklyOverviewChart from '../../charts/chartTypes/WeeklyOverviewChart';
import WeeklyLoadHeader from '../Header/WeeklyLoadHeader';
import WeeklyLoadInfoHeader from '../Header/WeeklyLoadInfoHeader';
import WeeklyLoadPlayerHeader from '../Header/WeeklyLoadPlayerHeader';

import TwelveWeekOverview from './TwelveWeekOverview';

const WeeklySinglePlayerStats = () => {
  const navigation = useNavigation();
  const route = useRoute() as RouteProp<RootStackParamList, 'PlayerStats'>;
  const games = useAppSelector(selectAllGames);
  const allPlayers = useAppSelector(selectAllPlayers);
  const currentWeek = useAppSelector((store) => getCurrentWeek(store));
  const id = route.params.playerId;
  const activeClub = useAppSelector(selectActiveClub);
  const isLowIntensityDisabled = activeClub.lowIntensityDisabled;
  const isModerateIntensityDisabled = activeClub.moderateIntensityDisabled;

  const comparisonFilter = useAppSelector((store) =>
    selectComparisonFilter(store, FilterStateType.weeklyLoad)
  );

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
        return comparisonFilter?.selectedWeek?.weekEvents || [];
      default:
        return [];
    }
  };

  const weekData = useMemo(() => {
    const weekEvents = filterGamesByDateAndStatus(
      games,
      currentWeek.start,
      currentWeek.end
    );
    const { playersData, headerData } = weeklyLoadData(weekEvents, allPlayers);
    return { playersData, headerData };
  }, [currentWeek.start, currentWeek.end, allPlayers]);

  const compareData = useMemo(() => {
    const compareEvents = getCompareEvents();
    if (!compareEvents.length) {
      return {
        playersData: emptyWeeklyPlayersData
      };
    }

    const { playersData } = weeklyLoadData(compareEvents, allPlayers);
    return { playersData };
  }, [comparisonFilter.key, allPlayers]);

  const currentPlayer = weekData.playersData.find((player) => player.id === id);

  const currentPlayerCompare = compareData.playersData.find(
    (player) => player.id === id
  );

  const playerInfo = useMemo(() => {
    return allPlayers.find((player) => player.id === currentPlayer?.id);
  }, [id]);

  const [activeSelector, setActiveSelector] = useState<ZoneSelector>({
    ...WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR[0]
  });

  const onZoneSelectHandler = (zone: ZoneSelector) => {
    setActiveSelector(zone);
  };

  useEffect(() => {
    if (!playerInfo) {
      navigation.goBack();
    }
  }, [playerInfo]);

  if (!playerInfo) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <View>
        <WeeklyLoadHeader />
        <WeeklyLoadInfoHeader headerData={weekData.headerData} />
        <WeeklyLoadPlayerHeader playerInfo={playerInfo} />
      </View>
      <ScrollView>
        <ChartsContainer
          hasTwoCharts
          title={CHART_TITLES.total_weekly_load}
          modalType={EXPLANATION_TYPES.playerLoad}
          secondTitle={CHART_TITLES.time_in_zone}
          secondModalType={EXPLANATION_TYPES.timeInZone}
        >
          <ChartGrid>
            <TotalLoadChart
              data={generateWeeklyTotalLoadData(
                currentPlayer?.totalLoad || 0,
                currentPlayerCompare?.totalLoad || 0,
                comparisonFilter.key
              )}
              isDontCompare={
                comparisonFilter.key === DropdownFilterKeys.DONT_COMPARE
              }
            />
          </ChartGrid>
          <ChartGrid isLastChart>
            <TimeInZoneChart
              data={generateWeeklyLoadTimeInZoneData(
                currentPlayer?.timeInZone || emptyTimeInzone,
                currentPlayerCompare?.timeInZone || emptyTimeInzone,
                comparisonFilter.key,
                isLowIntensityDisabled,
                isModerateIntensityDisabled
              )}
              isDontCompare={
                comparisonFilter.key === DropdownFilterKeys.DONT_COMPARE
              }
            />
          </ChartGrid>
        </ChartsContainer>
        <ChartsContainer
          hasZoneSelector
          onSelectHandler={onZoneSelectHandler}
          activeSelector={activeSelector}
          title={CHART_TITLES.weekly_overview}
          typeOfZoneSelector={TYPE_OF_ZONE_SELECTOR.weeklyOverview}
        >
          <ChartGrid
            hasYAxisValues
            hasBottomLegend
            hasHorizontalLines
            hasWeeklyOverviewLegend
            lineValueText="LOAD"
            horizontalLines={generateWeeklyOverviewHorizontalLines(
              currentPlayer?.weeklyOverview || emptyWeeklyOverview,
              activeSelector
            )}
            verticalLines={generateWeeklyOverviewVerticalLines()}
            customBottomLegend={generateCustomLegendWeeklyOverview(
              currentPlayer?.weeklyOverview || emptyWeeklyOverview,
              currentWeek.start,
              currentWeek.end
            )}
          >
            <WeeklyOverviewChart
              data={currentPlayer?.weeklyOverview || emptyWeeklyOverview}
              activeSelector={activeSelector}
            />
          </ChartGrid>
        </ChartsContainer>
        <ChartsContainer title={CHART_TITLES.twelve_week_overview}>
          <TwelveWeekOverview playerId={id} />
        </ChartsContainer>
      </ScrollView>
    </View>
  );
};

export default WeeklySinglePlayerStats;
