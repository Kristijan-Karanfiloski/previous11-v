import React, { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { DropdownFilterKeys, FilterStateType } from '../../../../types';
import { converterDataForWeeklyPlayersStats } from '../../../helpers/chartHelpers';
import { selectComparisonFilter } from '../../../redux/slices/filterSlice';
import { selectAllPlayers } from '../../../redux/slices/playersSlice';
import { useAppSelector } from '../../../redux/store';
import { ZoneSelector } from '../../../types';
import {
  CHART_TITLES,
  EXPLANATION_TYPES,
  PLAYER_LIST_CHART_ZONE_SELECTOR,
  TYPE_OF_ZONE_SELECTOR
} from '../../../utils/mixins';
import ChartGrid from '../../charts/ChartGrid';
import ChartsContainer from '../../charts/ChartsContainer';
import PlayerListChart from '../../charts/chartTypes/PlayerListChart';

type WeeklyPlayerDataType = {
  id: string;
  name: string;
  totalLoad: number;
  totalLoadPerMin: number;
  timeInZone: {
    explosive: number;
    veryHigh: number;
    high: number;
    moderate: number;
    low: number;
  };
  weeklyOverview: {
    load: number;
    explosive: number;
    veryHigh: number;
    high: number;
    date: string;
    indicator: number | string | null;
  }[];
}[];
interface Props {
  playersData: WeeklyPlayerDataType;
  compareData: WeeklyPlayerDataType;
}

const WeeklyPlayersStats = ({ playersData, compareData }: Props) => {
  const navigation = useNavigation();
  const players = useAppSelector(selectAllPlayers);

  const [activeSelector, setActiveSelector] = useState<ZoneSelector>({
    ...PLAYER_LIST_CHART_ZONE_SELECTOR[0],
    sort: 1
  });

  const comparisonFilter = useAppSelector((store) =>
    selectComparisonFilter(store, FilterStateType.weeklyLoad)
  );

  const onPlayerSelect = (id: string) => {
    navigation.navigate('PlayerStats', {
      playerId: id
    });
  };
  const onZoneSelectHandler = (zone: ZoneSelector) => {
    setActiveSelector({ ...zone, sort: zone.sort || 1 });
  };

  const convertDataForWeeklyPlayersStats = useMemo(() => {
    return converterDataForWeeklyPlayersStats(
      playersData,
      activeSelector,
      players,
      compareData,
      comparisonFilter.key
    );
  }, [activeSelector.key, activeSelector.sort, playersData]);

  return (
    <ScrollView>
      <ChartsContainer
        title={CHART_TITLES.total_weekly_load}
        modalType={EXPLANATION_TYPES.playerLoad}
        hasZoneSelector
        typeOfZoneSelector={TYPE_OF_ZONE_SELECTOR.playersList}
        activeSelector={activeSelector}
        onSelectHandler={onZoneSelectHandler}
      >
        <ChartGrid customVerticalLines>
          <PlayerListChart
            data={convertDataForWeeklyPlayersStats}
            activeSelector={activeSelector}
            isDontCompare={
              comparisonFilter.key === DropdownFilterKeys.DONT_COMPARE
            }
            onPlayerSelect={onPlayerSelect}
            isBestMatchCompare={false}
          />
        </ChartGrid>
      </ChartsContainer>
    </ScrollView>
  );
};

export default WeeklyPlayersStats;
