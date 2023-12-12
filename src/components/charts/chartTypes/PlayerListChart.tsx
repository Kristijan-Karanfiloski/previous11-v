import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ZoneSelector } from '../../../types';
import { PLAYER_LIST_CHART_ZONE_SELECTOR } from '../../../utils/mixins';
import PlayerHorizontalBars from '../common/PlayerHorizontalBars';

type PlayerListChartProps = {
  data:
    | {
        playerName: string;
        playerPercentage: number;
        playerLoad: number;
        playerBestMatchLoad: number;
        maxPercentageValue: number | undefined;
        id: string;
        isNoBenchmark: boolean;
        wasSubbed: string | null;
      }[]
    | undefined;
  isDontCompare?: boolean;
  activeSelector: ZoneSelector;
  onPlayerSelect: (id: string) => void;
  isBestMatchCompare: boolean;
};

const PlayerListChart = ({
  data,
  isDontCompare = false,
  activeSelector,
  onPlayerSelect,
  isBestMatchCompare
}: PlayerListChartProps) => {
  const isPlayerLoadSelected =
    activeSelector.key === PLAYER_LIST_CHART_ZONE_SELECTOR[0].key ||
    activeSelector.key === PLAYER_LIST_CHART_ZONE_SELECTOR[1].key;

  return (
    <View style={styles.mainContainer}>
      {data &&
        data.map((player, index) => {
          const {
            id,
            playerPercentage,
            playerLoad,
            maxPercentageValue,
            isNoBenchmark
          } = player;
          const isNoCompare = isNoBenchmark ? true : isDontCompare;
          const width = isNoCompare
            ? 100 / (maxPercentageValue || 1)
            : playerPercentage;
          let widthPercentage = isNoCompare ? width * playerLoad : width;
          if (isNoBenchmark && !isDontCompare) {
            widthPercentage = 0;
          }

          return (
            <Pressable
              onPress={() => onPlayerSelect(id)}
              style={{ width: '100%' }}
              key={index}
            >
              <PlayerHorizontalBars
                zoneSelector={activeSelector}
                player={player}
                isDontCompare={isDontCompare}
                widthPercentage={widthPercentage}
                isPlayerLoadSelected={isPlayerLoadSelected}
                isNoBenchmark={isNoBenchmark}
                isBestMatchCompare={isBestMatchCompare}
              />
            </Pressable>
          );
        })}
    </View>
  );
};

export default PlayerListChart;

const styles = StyleSheet.create({
  mainContainer: {
    rowGap: 5,
    zIndex: 10
  }
});
