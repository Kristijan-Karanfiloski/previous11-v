import React, { useState } from 'react';
import { ScrollView } from 'react-native';

import {
  DropdownFilterKeys,
  FilterStateType,
  GameType
} from '../../../../types';
import {
  generateCustomLegendWeeklyOverview,
  generateWeeklyLoadTimeInZoneData,
  generateWeeklyOverviewHorizontalLines,
  generateWeeklyOverviewVerticalLines,
  generateWeeklyTotalLoadData
} from '../../../helpers/chartHelpers';
import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { getCurrentWeek } from '../../../redux/slices/currentWeek';
import { selectComparisonFilter } from '../../../redux/slices/filterSlice';
import { useAppSelector } from '../../../redux/store';
import { ZoneSelector } from '../../../types';
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

import TwelveWeekOverview from './TwelveWeekOverview';

type WeeklyTeamTotalLoadAndZoneType = {
  totalLoad: number;
  timeInZone: {
    explosive: number;
    veryHigh: number;
    high: number;
    moderate: number;
    low: number;
  };
};

type WeeklyTeamDataType = WeeklyTeamTotalLoadAndZoneType & {
  weeklyOverview: {
    id: string;
    load: number;
    explosive: number;
    veryHigh: number;
    high: number;
    date: any;
    indicator: string | number | null;
    type: GameType.Training | GameType.Match;
  }[];
};

interface Props {
  weekData: WeeklyTeamDataType;
  compareData: WeeklyTeamTotalLoadAndZoneType;
}

const WeeklyTeamStats = ({ weekData, compareData }: Props) => {
  const currentWeek = useAppSelector((store) => getCurrentWeek(store));
  const [activeSelector, setActiveSelector] = useState<ZoneSelector>({
    ...WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR[0]
  });
  const activeClub = useAppSelector(selectActiveClub);
  const isLowIntensityDisabled = activeClub.lowIntensityDisabled;
  const isModerateIntensityDisabled = activeClub.moderateIntensityDisabled;

  const onZoneSelectHandler = (zone: ZoneSelector) => {
    setActiveSelector(zone);
  };

  const comparisonFilter = useAppSelector((store) =>
    selectComparisonFilter(store, FilterStateType.weeklyLoad)
  );

  const { totalLoad, timeInZone, weeklyOverview } = weekData;

  const { totalLoad: totalLoadLastWeek, timeInZone: timeInZoneLastWeek } =
    compareData;

  return (
    <ScrollView scrollIndicatorInsets={{ right: 1 }}>
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
              totalLoad,
              totalLoadLastWeek,
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
              timeInZone,
              timeInZoneLastWeek,
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
            weeklyOverview,
            activeSelector
          )}
          verticalLines={generateWeeklyOverviewVerticalLines()}
          customBottomLegend={generateCustomLegendWeeklyOverview(
            weeklyOverview,
            currentWeek.start,
            currentWeek.end
          )}
        >
          <WeeklyOverviewChart
            data={weeklyOverview}
            activeSelector={activeSelector}
          />
        </ChartGrid>
      </ChartsContainer>
      <ChartsContainer title={CHART_TITLES.twelve_week_overview}>
        <TwelveWeekOverview />
      </ChartsContainer>
    </ScrollView>
  );
};

export default WeeklyTeamStats;
