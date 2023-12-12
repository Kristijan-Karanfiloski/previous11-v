import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import moment from 'moment';

import { DropdownFilterKeys, GameAny, GameType } from '../../../types';
import {
  collectPastSessions,
  divideNumberInSlices,
  generateCustomChartLegend,
  generatePastMatchHorizontalLines,
  generatePastSessionsData,
  generatePastSessionsHorizontalLines,
  generateSessions,
  generateSubtitleTotalLoad,
  generateTimeInZoneData,
  getModalTypeFromFilter
} from '../../helpers/chartHelpers';
import { getFilterType } from '../../helpers/filterSliceHelper';
import { selectActiveClub } from '../../redux/slices/clubsSlice';
import { selectComparisonFilter } from '../../redux/slices/filterSlice';
import { selectAllGames } from '../../redux/slices/gamesSlice';
import { useAppSelector } from '../../redux/store';
import { deriveNewStats } from '../../utils/adapter';
import {
  ACTIVITY_GRAPH_TITLE_LEGEND,
  CHART_TITLES,
  EXPLANATION_TYPES,
  TYPE_OF_ZONE_SELECTOR,
  utils
} from '../../utils/mixins';
import ChartGrid from '../charts/ChartGrid';
import ChartsContainer from '../charts/ChartsContainer';
import Actions from '../charts/chartTypes/Actions';
import ActivityGraph from '../charts/chartTypes/ActivityGraph';
import PastSessions from '../charts/chartTypes/PastSessions';
import PreviousMonthMatches from '../charts/chartTypes/PreviousMonthMatches';
import TimeInZoneChart from '../charts/chartTypes/TimeInZoneChart';
import TotalLoadChart from '../charts/chartTypes/TotalLoadChart';

interface TeamStatsProps {
  event: GameAny | undefined;
  activeSubSession: string;
}

const TeamStats = ({ event, activeSubSession }: TeamStatsProps) => {
  const games = useAppSelector(selectAllGames);
  const route = useRoute();

  const activeClub = useAppSelector(selectActiveClub);

  const isLowIntensityDisabled = activeClub.lowIntensityDisabled;
  const isModerateIntensityDisabled = activeClub.moderateIntensityDisabled;
  const filterType = useMemo(() => {
    return getFilterType(event || null);
  }, [event, event?.type]);

  const comparisonFilter = useAppSelector((store) =>
    selectComparisonFilter(store, filterType)
  );

  const [eventDate, setEventDate] = useState<string>(
    moment(event?.date, 'YYYY/MM/DD').format('MM')
  );

  const [isRealTime, setIsRealTime] = useState<boolean>(false);

  const handleRealTime = () => {
    setIsRealTime(!isRealTime);
  };

  const onMonthChangeHandler = (indicator = true) => {
    if (indicator) {
      const addedMonth = moment(eventDate, 'MM').add(1, 'months').format('MM');
      setEventDate(`${addedMonth}`);
    } else {
      const subtractMonth = moment(eventDate, 'MM')
        .subtract(1, 'months')
        .format('MM');
      setEventDate(`${subtractMonth}`);
    }
  };

  const isDontCompare =
    comparisonFilter.key === DropdownFilterKeys.DONT_COMPARE;

  const deriveData = useMemo(() => {
    if (event) {
      return deriveNewStats({
        event,
        isMatch: event.type === GameType.Match,
        explicitBestMatch:
          comparisonFilter.key === DropdownFilterKeys.BEST_MATCH,
        dontCompare: isDontCompare,
        activeSubSession
      });
    }
    return null;
  }, [event, isDontCompare, comparisonFilter.key, activeSubSession]);

  const pastSessions = useMemo(() => {
    return collectPastSessions(games, event?.id || 'null');
  }, [event?.id]);

  const pastMonthMatchEvents = useMemo(() => {
    return games.filter(
      (game) =>
        moment(game.date, 'YYYY/MM/DD').format('MM') === eventDate &&
        game.type === GameType.Match
    );
  }, [eventDate]);

  if (!event) return null;

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
            comparisonFilter.key
          )}
          modalType={getModalTypeFromFilter(comparisonFilter.key)}
          secondTitle={CHART_TITLES.time_in_zone}
          secondSubTitle={generateSubtitleTotalLoad(
            event,
            deriveData,
            isDontCompare,
            comparisonFilter.key
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
          <ChartGrid isLastChart>
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
          hasRealTimeToggle
          isRealTime={isRealTime}
          handleRealTime={handleRealTime}
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
            isRealTime={isRealTime}
            duration={event.status?.startTimestamp || 1}
          >
            <ActivityGraph
              isTeamStats
              isMatch={event.type === GameType.Match}
              data={deriveData?.activitySeries || []}
              matchDuration={(duration || 1) / 1000 / 60}
              drills={generateSessions(event, duration).sort((a, b) => {
                return a.startTime - b.startTime;
              })}
            />
          </ChartGrid>
        </ChartsContainer>
        {pastSessions && route.name === 'TeamReport' && (
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
                pastSessions
              )}
              isPastSession={pastSessions.length !== 1}
            >
              <PastSessions data={generatePastSessionsData(pastSessions)} />
            </ChartGrid>
          </ChartsContainer>
        )}
        {event.type === GameType.Match && route.name === 'TeamReport' && (
          <ChartsContainer
            hasZoneSelector
            title={CHART_TITLES.previous_matches}
            modalType={EXPLANATION_TYPES.playerLoad}
            typeOfZoneSelector={TYPE_OF_ZONE_SELECTOR.pastMatches}
            onMonthChangeHandler={(indicator) =>
              onMonthChangeHandler(indicator)
            }
            eventDate={eventDate}
          >
            <ChartGrid
              hasYAxisValues
              hasHorizontalLines
              lineValueText="LOAD"
              verticalLines={divideNumberInSlices(
                pastMonthMatchEvents.length,
                1
              )}
              horizontalLines={generatePastMatchHorizontalLines(
                pastMonthMatchEvents
              )}
            >
              <PreviousMonthMatches games={pastMonthMatchEvents} />
            </ChartGrid>
          </ChartsContainer>
        )}
      </ScrollView>
    </View>
  );
};

export default TeamStats;

const styles = StyleSheet.create({
  container: { flex: 1 }
});
