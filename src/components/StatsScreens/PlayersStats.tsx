import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { DropdownFilterKeys, GameAny, GameType } from '../../../types';
import {
  generatePlayerListData,
  getModalTypeFromFilter
} from '../../helpers/chartHelpers';
import { getFilterType } from '../../helpers/filterSliceHelper';
import { selectActiveClub } from '../../redux/slices/clubsSlice';
import { selectComparisonFilter } from '../../redux/slices/filterSlice';
import { selectAllPlayers } from '../../redux/slices/playersSlice';
import { useAppSelector } from '../../redux/store';
import { ZoneSelector } from '../../types';
import {
  CHART_TITLES,
  PLAYER_LIST_CHART_ZONE_SELECTOR,
  PLAYER_LIST_CHART_ZONE_SELECTOR_HOCKEY,
  TYPE_OF_ZONE_SELECTOR
} from '../../utils/mixins';
import ChartGrid from '../charts/ChartGrid';
import ChartsContainer from '../charts/ChartsContainer';
import PlayerListChart from '../charts/chartTypes/PlayerListChart';

interface PlayerStatsProps {
  event: GameAny | undefined;
  activeSubSession: string;
}

const PlayerStats = ({ event, activeSubSession }: PlayerStatsProps) => {
  const navigation = useNavigation();
  const route = useRoute();
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';

  const filterType = useMemo(() => {
    return getFilterType(event || null);
  }, [event, event?.type]);

  const comparisonFilter = useAppSelector((store) =>
    selectComparisonFilter(store, filterType)
  );

  const isDontCompare =
    comparisonFilter.key === DropdownFilterKeys.DONT_COMPARE;

  const players = useAppSelector(selectAllPlayers);
  const [activeSelector, setActiveSelector] = useState<ZoneSelector>({
    ...(isHockey && event && event.type === GameType.Match
      ? PLAYER_LIST_CHART_ZONE_SELECTOR_HOCKEY[1]
      : PLAYER_LIST_CHART_ZONE_SELECTOR[0]),
    sort: 1
  });

  const onPlayerSelect = (id: string) => {
    // to do navigation to player stats
    if (event) {
      if (route.name === 'TeamLive') {
        return navigation.navigate('PlayerLive', { event, playerId: id });
      }
      return navigation.navigate('PlayerReport', {
        eventId: event.id,
        playerId: id
      });
    }
    return null;
  };

  const onZoneSelectHandler = (zone: ZoneSelector) => {
    setActiveSelector({ ...zone, sort: zone.sort || 1 });
  };

  const playerListData = useMemo(() => {
    if (event) {
      return generatePlayerListData(
        event,
        activeSelector,
        players,
        comparisonFilter,
        isDontCompare,
        activeSubSession
      );
    }
    return [];
  }, [
    activeSelector.key,
    isDontCompare,
    comparisonFilter.key,
    activeSelector.sort,
    event,
    activeSubSession
  ]);

  if (!event) return null;

  return (
    <ScrollView style={styles.container}>
      <ChartsContainer
        title={CHART_TITLES.total_load}
        modalType={getModalTypeFromFilter(comparisonFilter.key)}
        hasZoneSelector
        typeOfZoneSelector={
          isHockey && event.type === GameType.Match
            ? TYPE_OF_ZONE_SELECTOR.playersHockeyList
            : TYPE_OF_ZONE_SELECTOR.playersList
        }
        activeSelector={activeSelector}
        onSelectHandler={onZoneSelectHandler}
      >
        <ChartGrid customVerticalLines>
          <PlayerListChart
            data={playerListData}
            activeSelector={activeSelector}
            isDontCompare={isDontCompare}
            onPlayerSelect={onPlayerSelect}
            isBestMatchCompare={
              comparisonFilter.key === DropdownFilterKeys.BEST_MATCH
            }
          />
        </ChartGrid>
      </ChartsContainer>
    </ScrollView>
  );
};

export default PlayerStats;

const styles = StyleSheet.create({
  container: { flex: 1 }
});
