import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import moment from 'moment';

import { DropdownFilterKeys, GameAny, GameType } from '../../../types';
import {
  collectPastSessions,
  divideNumberInSlices,
  generateContinuousMovementsData,
  generateContinuousMovementsHorizontalLines,
  generateCustomChartLegend,
  generatePastSessionsData,
  generatePastSessionsHorizontalLines,
  generateSessions,
  generateSubtitleTotalLoad,
  generateTimeInZoneData,
  getModalTypeFromFilter
} from '../../helpers/chartHelpers';
import { getFilterType } from '../../helpers/filterSliceHelper';
import AcuteChronic from '../../navigation/AcuteChronic';
import { selectActiveClub } from '../../redux/slices/clubsSlice';
import { selectComparisonFilter } from '../../redux/slices/filterSlice';
import { selectAllGames } from '../../redux/slices/gamesSlice';
import { useAppSelector } from '../../redux/store';
import { deriveNewStats } from '../../utils/adapter';
import {
  ACTIVITY_GRAPH_TITLE_LEGEND,
  CHART_TITLES,
  EXPLANATION_TYPES,
  MOVEMENTS_GRAPH_TITLE_LEGEND,
  utils
} from '../../utils/mixins';
import ChartGrid from '../charts/ChartGrid';
import ChartsContainer from '../charts/ChartsContainer';
import Actions from '../charts/chartTypes/Actions';
import ActivityGraph from '../charts/chartTypes/ActivityGraph';
import MovementsChart from '../charts/chartTypes/MovementsChart';
import PastSessions from '../charts/chartTypes/PastSessions';
import TimeInZoneChart from '../charts/chartTypes/TimeInZoneChart';
import TotalLoadChart from '../charts/chartTypes/TotalLoadChart';
import TotalTimeOnIce from '../charts/chartTypes/TotalTimeOnIce';
import TotalTimeOnIceData from '../charts/chartTypes/TotalTimeOnIceData';
import TwelveWeekOverview from '../WeeklyLoad/StatsScreens/TwelveWeekOverview';

interface SinglePlayerStatsProps {
  event: GameAny | undefined;
  playerId: string | undefined;
  activeSubSession: string;
}

const SinglePlayerStats = ({
  event,
  playerId,
  activeSubSession
}: SinglePlayerStatsProps) => {
  const games = useAppSelector(selectAllGames);
  const route = useRoute();
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  const isLowIntensityDisabled = activeClub.lowIntensityDisabled;
  const isModerateIntensityDisabled = activeClub.moderateIntensityDisabled;
  const startOfWeek = event
    ? moment(event.date, 'YYYY/MM/DD').startOf('week').format('YYYY/MM/DD')
    : '';

  const filterType = useMemo(() => {
    return getFilterType(event || null);
  }, [event, event?.type]);

  const comparisonFilter = useAppSelector((store) =>
    selectComparisonFilter(store, filterType)
  );

  const isDontCompare =
    comparisonFilter.key === DropdownFilterKeys.DONT_COMPARE;

  const deriveData = useMemo(() => {
    if (event) {
      return deriveNewStats({
        event,
        currentPlayerId: playerId,
        isMatch: event.type === GameType.Match,
        explicitBestMatch:
          comparisonFilter.key === DropdownFilterKeys.BEST_MATCH,
        dontCompare: isDontCompare,
        activeSubSession
      });
    }
  }, [event?.report, isDontCompare, comparisonFilter.key, activeSubSession]);

  const pastSessions = useMemo(() => {
    return collectPastSessions(games, event?.id || 'null');
  }, [event?.id]);
  if (!event) return null;

  if (!playerId) return null;

  const duration = utils.getEventDuration(event);

  return (
    <View style={styles.container}>
      <ScrollView>
        <ChartsContainer
          hasTwoCharts
          title={CHART_TITLES.total_load}
          subTitle={generateSubtitleTotalLoad(
            event,
            deriveData,
            isDontCompare,
            comparisonFilter.key,
            playerId
          )}
          modalType={getModalTypeFromFilter(comparisonFilter.key)}
          secondTitle={CHART_TITLES.time_in_zone}
          secondSubTitle={generateSubtitleTotalLoad(
            event,
            deriveData,
            isDontCompare,
            comparisonFilter.key,
            playerId
          )}
          secondModalType={EXPLANATION_TYPES.timeInZone}
        >
          <ChartGrid customVerticalLines>
            <TotalLoadChart
              data={{
                percentageValue: deriveData?.percentageLoad || 0,
                totalLoad: Math.round(deriveData?.teamLoad || 0),
                benchmarkLoad: Math.round(deriveData?.comparisonLoad || 0)
              }}
              isDontCompare={isDontCompare || event?.benchmark?.intensity === 0}
            />
          </ChartGrid>
          <ChartGrid>
            <TimeInZoneChart
              data={generateTimeInZoneData(
                deriveData,
                isDontCompare,
                isLowIntensityDisabled,
                isModerateIntensityDisabled,
                event?.type === GameType.Match
              )}
              isDontCompare={isDontCompare}
            />
          </ChartGrid>
        </ChartsContainer>
        <ChartsContainer title="load pr. minute">
          <ChartGrid customVerticalLines>
            <TotalLoadChart
              data={{
                percentageValue: deriveData?.percentageLoadPerMin || 0,
                totalLoad: deriveData?.loadPerMinute || 0,
                benchmarkLoad: deriveData?.comparisonLoadPerMin || 0
              }}
              isDontCompare={isDontCompare}
              isLoadPerMinute
            />
          </ChartGrid>
        </ChartsContainer>
        {isHockey && deriveData?.timeOnIce && (
          <ChartsContainer
            hasTwoCharts
            title={CHART_TITLES.total_time_on_ice}
            subTitle={generateSubtitleTotalLoad(
              event,
              deriveData,
              isDontCompare,
              comparisonFilter.key,
              playerId
            )}
            modalType={getModalTypeFromFilter(comparisonFilter.key)}
          >
            <ChartGrid customVerticalLines>
              <TotalTimeOnIce
                isDontCompare={isDontCompare}
                data={deriveData?.timeOnIce}
                bestMatchData={deriveData?.timeOnIceBestLoad}
              />
            </ChartGrid>
            <ChartGrid hasNoBorders>
              <TotalTimeOnIceData data={deriveData?.timeOnIce} />
            </ChartGrid>
          </ChartsContainer>
        )}
        <ChartsContainer title={CHART_TITLES.high_intensity_actions}>
          <Actions
            data={deriveData?.actions}
            compareData={deriveData?.benchmarkActions}
            isDontCompare={isDontCompare}
          />
        </ChartsContainer>
        <ChartsContainer
          hasTitleLegend
          title={CHART_TITLES.activity_graph}
          modalType={EXPLANATION_TYPES.intensityZones}
          titleLegend={ACTIVITY_GRAPH_TITLE_LEGEND}
          hasAdditionalLegend
        >
          <ChartGrid
            customVerticalLines
            hasBottomLegend
            hasYAxisValues
            hasHorizontalLines
            verticalLines={divideNumberInSlices(
              Math.ceil((duration || 1) / 1000 / 60),
              15
            )}
          >
            <ActivityGraph
              isMatch={event.type === GameType.Match}
              data={deriveData?.activitySeries || []}
              matchDuration={(duration || 1) / 1000 / 60}
              drills={generateSessions(event, duration).sort((a, b) => {
                return a.startTime - b.startTime;
              })}
            />
          </ChartGrid>
        </ChartsContainer>

        <ChartsContainer
          hasTitleLegend
          title={CHART_TITLES.continuous_movements}
          modalType={EXPLANATION_TYPES.movements}
          titleLegend={MOVEMENTS_GRAPH_TITLE_LEGEND}
        >
          <ChartGrid
            customVerticalLines
            hasBottomLegend
            hasYAxisValues
            hasHorizontalLines
            lineValueText="SEC"
            isMovementsChart
            verticalLines={divideNumberInSlices(
              Math.ceil((duration || 1) / 1000 / 60),
              15
            )}
            horizontalLines={generateContinuousMovementsHorizontalLines(
              deriveData
            )}
          >
            <MovementsChart
              data={generateContinuousMovementsData(deriveData)}
              matchDuration={(duration || 1) / 1000 / 60}
            />
          </ChartGrid>
        </ChartsContainer>
        {pastSessions && route.name === 'PlayerReport' && (
          <ChartsContainer title={CHART_TITLES.previous_events}>
            <ChartGrid
              customVerticalLines
              hasBottomLegend
              hasPrevSessionLegend
              hasYAxisValues
              lineValueText="LOAD"
              verticalLines={
                pastSessions.length === 1
                  ? []
                  : divideNumberInSlices(pastSessions.length, 1)
              }
              customVerticalLinesData={generateCustomChartLegend(
                divideNumberInSlices(pastSessions.length, 1),
                pastSessions
              )}
              horizontalLines={generatePastSessionsHorizontalLines(
                pastSessions,
                playerId
              )}
              isPastSession={pastSessions.length !== 1}
            >
              <PastSessions
                data={generatePastSessionsData(pastSessions, playerId)}
              />
            </ChartGrid>
          </ChartsContainer>
        )}
        <AcuteChronic playerId={playerId} date={event.date} />
        <ChartsContainer title={CHART_TITLES.twelve_week_overview}>
          <TwelveWeekOverview
            playerId={playerId}
            startOfCurrentWeek={startOfWeek}
          />
        </ChartsContainer>
      </ScrollView>
    </View>
  );
};

export default SinglePlayerStats;

const styles = StyleSheet.create({
  container: { flex: 1 }
});
