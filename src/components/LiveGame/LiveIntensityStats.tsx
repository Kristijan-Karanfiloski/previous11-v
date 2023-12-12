import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { DropdownFilterKeys, GameAny, GameType, Player } from '../../../types';
import { getFilterType } from '../../helpers/filterSliceHelper';
import { selectComparisonFilter } from '../../redux/slices/filterSlice';
import { selectSomePlayers } from '../../redux/slices/playersSlice';
import { useAppSelector } from '../../redux/store';
import { palette } from '../../theme';
import { sortPlayersByConnectionAndTagNumber } from '../../utils';
import { deriveNewStats } from '../../utils/adapter';
import { variables } from '../../utils/mixins';
import OverlayLoader from '../common/OverlayLoader';
import { Icon } from '../icon/icon';
import IntensityZonesLegend from '../IntensityZonesLegend';

import LiveIntensityTile from './LiveIntensityTile';

interface LiveIntensityStatsProps {
  activeEvent: GameAny;
  activeSubSession: string;
}

type SortFilterTypes = 'tags' | 'highest' | 'lowest';

const LiveIntensityStats = (props: LiveIntensityStatsProps) => {
  const { activeEvent, activeSubSession } = props;
  const inPitchPlayers = activeEvent.preparation?.playersInPitch || [];
  const activePlayers = useAppSelector((state) =>
    selectSomePlayers(state, inPitchPlayers)
  );
  const filterType = useMemo(() => {
    return getFilterType(activeEvent || null);
  }, [activeEvent, activeEvent?.type]);
  const comparisonFilter = useAppSelector((store) =>
    selectComparisonFilter(store, filterType)
  );

  const isDontCompare =
    comparisonFilter.key === DropdownFilterKeys.DONT_COMPARE;
  const [sortFilter, setSortFilter] = useState<SortFilterTypes>('tags');
  const navigation = useNavigation();
  const numColumns = useMemo(() => {
    if (!activeEvent) return 0;

    const playersLength = (activeEvent.preparation?.playersInPitch || [])
      .length;
    if (playersLength > 6 && playersLength <= 12) {
      return 5; // 3
    } else if (playersLength > 12 && playersLength <= 20) {
      return 5; // 4
    } else if (playersLength > 20) {
      return 5;
    }

    return 4;
  }, [activeEvent]);

  const sortPlayers = (
    players: Player[],
    sortValue: SortFilterTypes,
    isDontCompare: boolean
  ) => {
    const playersStats = sortPlayersByConnectionAndTagNumber(players).map(
      (player) => {
        return {
          id: player.id,
          isDontCompare,
          ...deriveNewStats({
            currentPlayerId: player.id,
            event: activeEvent,
            isMatch: activeEvent?.type === GameType.Match,
            explicitBestMatch:
              comparisonFilter.key === DropdownFilterKeys.BEST_MATCH,
            dontCompare: isDontCompare,
            activeSubSession
          })
        };
      }
    );

    if (sortValue === 'highest') {
      return playersStats.sort((a, b) => b.teamLoad - a.teamLoad);
    }
    if (sortValue === 'lowest') {
      return playersStats.sort((a, b) => a.teamLoad - b.teamLoad);
    }

    return playersStats;
  };

  if (!activeEvent) return <OverlayLoader isLoading={!activeEvent} />;
  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 20
        }}
      >
        <View style={styles.sortFilterContainer}>
          <Text style={styles.sortFilterLabel}>Sort by</Text>
          <TouchableOpacity
            onPress={() => {
              setSortFilter((prevState) => {
                if (prevState === 'tags') return 'highest';
                if (prevState === 'highest') return 'lowest';
                return 'tags';
              });
            }}
            style={styles.sortFilterButton}
          >
            <Text style={styles.sortFilterText}>Player Load</Text>
            {sortFilter !== 'tags' && (
              <Icon
                icon="arrow_down_black"
                containerStyle={{
                  transform: [
                    {
                      rotate: `${sortFilter === 'highest' ? '0deg' : '180deg'}`
                    }
                  ]
                }}
              />
            )}
          </TouchableOpacity>
        </View>
        <IntensityZonesLegend inLineTitle />
      </View>
      <FlatList
        key={numColumns}
        style={{ flex: 1, paddingHorizontal: 20 }}
        numColumns={numColumns}
        extraData={numColumns}
        keyExtractor={(_item) => {
          return _item.id.toString();
        }}
        data={
          activeEvent
            ? sortPlayers(activePlayers, sortFilter, isDontCompare)
            : []
        }
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                flex: 1 / numColumns
              }}
            >
              <LiveIntensityTile
                containerStyle={{
                  marginBottom: 9,
                  marginRight: (index + 1) % numColumns === 0 ? 0 : 9,
                  height: 255 - (numColumns - 2) * 30
                }}
                playerId={item.id}
                playerStats={item}
                isDontCompare={item.isDontCompare}
                onPress={(playerId) =>
                  navigation.navigate('PlayerLive', {
                    event: activeEvent,
                    playerId
                  })
                }
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default LiveIntensityStats;

const styles = StyleSheet.create({
  container: { backgroundColor: palette.white, flex: 1, paddingTop: 16 },
  sortFilterButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: -2
  },
  sortFilterContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16
  },
  sortFilterLabel: {
    color: palette.tipGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 12,
    marginRight: 25,
    textTransform: 'uppercase'
  },
  sortFilterText: {
    fontFamily: variables.mainFontMedium,
    fontSize: 14,
    marginRight: 10
  }
});
