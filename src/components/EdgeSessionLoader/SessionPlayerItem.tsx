import React, { useMemo } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { Player } from '../../../types';
import { selectAllPlayers } from '../../redux/slices/playersSlice';
import { useAppSelector } from '../../redux/store';
import { variables } from '../../utils/mixins';
import Dropdown from '../common/Dropdown';

interface Tag {
  tagId: string;
}

interface SessionPlayerItemProps {
  item: {
    tagId: string;
    duration: number;
    endTimestamp: number;
    load: number;
    load_accum: number;
    startTimestamp: number;
  };
  index: number;
  tagData: Tag[];
  includedPlayers: Record<string, { id: string; included: boolean }>;
  setIncludedPlayers: (
    players: Record<string, { id: string; included: boolean }>
  ) => void;
}

const SessionPlayerItem: React.FC<SessionPlayerItemProps> = ({
  item,
  index,
  tagData,
  includedPlayers,
  setIncludedPlayers
}) => {
  const allPlayers = useAppSelector(selectAllPlayers);

  const unAssignedPlayers = useMemo(() => {
    const assignedPlayers = Object.values(includedPlayers).map(
      (pl) => pl.id
    ) as string[];
    return allPlayers.filter(
      (pl) =>
        !tagData.some((tag) => tag.tagId === pl.tag) &&
        !assignedPlayers.includes(pl.id)
    );
  }, [allPlayers, tagData, includedPlayers]);

  const isEven = (index + 1) % 2 === 0;
  const player = allPlayers.find(
    (pl) => pl.id === includedPlayers[item.tagId]?.id
  );

  const playerItems: Player[] = player
    ? [player, ...unAssignedPlayers]
    : unAssignedPlayers;

  const handleDropdownChange = (value: string) => {
    setIncludedPlayers({
      ...includedPlayers,
      [item.tagId]: {
        id: value,
        included: true
      }
    });
  };

  const handleSwitchChange = (value: boolean) => {
    setIncludedPlayers({
      ...includedPlayers,
      [item.tagId]: {
        ...includedPlayers[item.tagId],
        included: value
      }
    });
  };

  return (
    <View
      style={[styles.playerItemRow, isEven ? styles.evenRow : styles.oddRow]}
    >
      <Text style={styles.playerTitle}>{item.tagId}</Text>

      <Dropdown
        uiType="two"
        placeholder="-"
        value={includedPlayers[item.tagId]?.id}
        options={playerItems.map((pl) => ({ label: pl.name, value: pl.id }))}
        onChange={handleDropdownChange}
        preventUnselect
        dropdownHeight={180}
        containerStyle={styles.dropdownContainer}
        labelStyle={styles.dropdownLabel}
      />

      <Text style={styles.loadText}>{(item.load_accum || 0).toFixed(2)}</Text>

      <Switch
        value={!!includedPlayers[item.tagId]?.included}
        disabled={!includedPlayers[item.tagId]}
        onValueChange={handleSwitchChange}
        trackColor={{
          true: variables.batterieGreen,
          false: variables.lightGrey
        }}
        ios_backgroundColor={variables.lightGrey}
        style={styles.switchStyle}
      />
    </View>
  );
};

export default SessionPlayerItem;

const styles = StyleSheet.create({
  dropdownContainer: {
    borderRadius: 8,
    height: 32,
    width: 140
  },
  dropdownLabel: {
    fontFamily: variables.mainFont,
    fontSize: 12
  },
  evenRow: {
    paddingLeft: 20,
    paddingRight: 0
  },
  loadText: {
    color: variables.grey,
    fontFamily: variables.mainFont,
    fontSize: 14,
    textAlign: 'center'
  },
  oddRow: {
    borderRightWidth: 1,
    paddingLeft: 10,
    paddingRight: 10
  },
  playerItemRow: {
    alignItems: 'center',
    borderColor: variables.lineGrey,
    flexDirection: 'row',
    height: 58,
    justifyContent: 'space-between',
    paddingVertical: 9,
    width: '50%'
  },
  playerTitle: {
    color: variables.grey,
    fontFamily: variables.mainFont,
    fontSize: 14,
    width: 20
  },
  switchStyle: {
    transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }]
  }
});
