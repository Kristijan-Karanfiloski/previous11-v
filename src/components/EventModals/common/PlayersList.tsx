import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { SocketContext } from '../../../hooks/socketContext';
import { selectConfig } from '../../../redux/slices/configSlice';
import { selectOnlineTags } from '../../../redux/slices/onlineTagsSlice';
import { selectAllPlayers } from '../../../redux/slices/playersSlice';
import { useAppSelector } from '../../../redux/store';
import {
  getPlayersMacIds,
  sortPlayersByConnectionAndTagNumber
} from '../../../utils';
import { variables } from '../../../utils/mixins';
import { Icon } from '../../icon/icon';

import SinglePlayerList from './SinglePlayerList';

interface Props {
  selectedPlayers: {
    [key: string]: boolean;
  };
  setSelectedPlayers: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
}

const PlayersList = ({ selectedPlayers, setSelectedPlayers }: Props) => {
  const { isReady } = useContext(SocketContext);
  const allPlayers = useAppSelector(selectAllPlayers);
  const config = useAppSelector(selectConfig);
  const onlineTags = useAppSelector(selectOnlineTags);
  const tagsConnectedToEdge = onlineTags.map(({ id }) => id);
  const macIds = getPlayersMacIds(
    allPlayers.map(({ id }) => id),
    allPlayers,
    config.tags
  );

  const numberOfTagsConnected = Object.keys(macIds).filter((id) => {
    return tagsConnectedToEdge.includes(id);
  }).length;

  const numberOfSelectedPlayers = Object.keys(selectedPlayers).filter(
    (playerId) => selectedPlayers[playerId]
  ).length;

  return (
    <View>
      <View style={styles.topContainer}>
        <View style={styles.topWrapper}>
          <Icon
            style={styles.icon}
            icon={isReady ? 'icon_connected' : 'icon_disconnected'}
          />
          <Text numberOfLines={1} style={styles.topWrapperText}>
            {isReady && config.edgeDeviceName
              ? `Connected Egde: ${config.edgeDeviceName}`
              : 'Not Connected'}
          </Text>
        </View>
        <View style={styles.topWrapper}>
          <Icon
            style={styles.icon}
            icon={
              isReady && onlineTags && !!numberOfTagsConnected
                ? 'icon_connected'
                : 'icon_disconnected'
            }
          />
          <Text style={styles.topWrapperText}>{`${
            onlineTags && isReady ? numberOfTagsConnected : 0
          } Tags Connected`}</Text>
        </View>
        <View style={styles.topWrapper}>
          <View style={styles.icon}>
            <MaterialCommunityIcons
              name="account-supervisor-circle-outline"
              size={21}
              color="black"
            />
          </View>
          <Text
            style={styles.topWrapperText}
          >{`${numberOfSelectedPlayers} Players Included`}</Text>
        </View>
      </View>
      <View style={styles.headers}>
        <Text style={[styles.header, styles.column1]}>Player</Text>
        <Text style={[styles.header, styles.column2]}>Tag</Text>
        <Text style={[styles.header, styles.column3]}>Status</Text>
        <Text style={[styles.header, styles.column4]}>Battery</Text>
        <Text style={[styles.header, styles.column5]}>Included</Text>
      </View>
      <View style={styles.listContainer}>
        {sortPlayersByConnectionAndTagNumber(allPlayers).map(
          (player, index) => {
            return (
              <SinglePlayerList
                key={index}
                player={player}
                selectedPlayers={selectedPlayers}
                setSelectedPlayers={setSelectedPlayers}
              />
            );
          }
        )}
      </View>
    </View>
  );
};

export default PlayersList;

const styles = StyleSheet.create({
  column1: {
    flex: 27
  },
  column2: {
    flex: 17.5
  },
  column3: {
    flex: 27.5
  },
  column4: {
    flex: 16
  },
  column5: {
    flex: 12
  },
  header: {
    fontFamily: variables.mainFontMedium,
    fontSize: 14
  },
  headers: {
    flexDirection: 'row',
    paddingBottom: 20,
    paddingHorizontal: 30
  },
  icon: {
    marginRight: 10
  },
  listContainer: {
    flex: 1
  },
  topContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20
  },
  topWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 25
  },
  topWrapperText: {
    fontFamily: variables.mainFont,
    fontSize: 12
  }
});
