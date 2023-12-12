import React, { useContext } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { SocketContext } from '../../../hooks/socketContext';
import {
  selectAvailableTags,
  selectConfig
} from '../../../redux/slices/configSlice';
import { selectOnlineTags } from '../../../redux/slices/onlineTagsSlice';
import { updatePlayerAction } from '../../../redux/slices/playersSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import {
  getPlayerAndTagOnlineStatus,
  sortStringsInAscendingOrder
} from '../../../utils';
import { variables } from '../../../utils/mixins';
import Dropdown from '../../common/Dropdown';
import { Icon } from '../../icon/icon';

interface Props {
  player: any;
  selectedPlayers: {
    [key: string]: boolean;
  };
  setSelectedPlayers: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
}

const SinglePlayerList = ({
  player,
  selectedPlayers,
  setSelectedPlayers
}: Props) => {
  const { isReady } = useContext(SocketContext);
  const avaialableTags = useAppSelector(selectAvailableTags);
  const config = useAppSelector(selectConfig);
  const onlineTags = useAppSelector(selectOnlineTags);
  const dispatch = useAppDispatch();

  const onTagChange = (playerId: string, value: string) => {
    dispatch(updatePlayerAction({ id: playerId, tag: value }));
  };

  const options =
    avaialableTags.indexOf(player.tag) > -1
      ? avaialableTags
      : [...avaialableTags, player.tag];

  const { connectionText, connectionIcon, batteryPercentage, batteryIcon } =
    getPlayerAndTagOnlineStatus(config.tags, onlineTags, player.tag, isReady);

  return (
    <View style={styles.row}>
      <View style={styles.column1}>
        <Text numberOfLines={1} style={styles.playerText}>
          {player.name}
        </Text>
      </View>
      <View style={styles.column2}>
        <View style={{ width: 75 }}>
          <Dropdown
            placeholder="-"
            uiType="two"
            options={sortStringsInAscendingOrder(options).map((tag) => ({
              label: tag,
              value: tag
            }))}
            onChange={(val) => onTagChange(player.id, val)}
            value={player.tag}
            containerStyle={{
              backgroundColor: variables.realWhite,
              borderWidth: 1,
              borderColor: !player.tag ? variables.red : variables.grey2,
              borderRadius: 8
            }}
            customDropdownStyle={{
              backgroundColor: variables.lineGrey
            }}
          />
        </View>
      </View>
      <View style={[styles.column, styles.column3]}>
        <Icon style={styles.icon} icon={connectionIcon} />
        <Text style={styles.text}>{connectionText}</Text>
      </View>
      <View style={[styles.column, styles.column4]}>
        {!!batteryPercentage && (
          <>
            <Icon style={styles.icon} icon={batteryIcon} />
            <Text style={styles.text}>{batteryPercentage}%</Text>
          </>
        )}
      </View>
      <View style={styles.column5}>
        <Switch
          value={selectedPlayers[player.id]}
          onValueChange={(value) => {
            setSelectedPlayers((prevState) => ({
              ...prevState,
              [player.id]: value
            }));
          }}
          trackColor={{
            true: variables.batterieGreen,
            false: variables.lightGrey
          }}
          ios_backgroundColor={variables.lightGrey}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
      </View>
    </View>
  );
};

export default SinglePlayerList;

const styles = StyleSheet.create({
  column: {
    alignItems: 'center',
    flexDirection: 'row'
  },
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
  icon: {
    marginRight: 10
  },
  playerText: {
    fontFamily: variables.mainFont,
    fontSize: 12,
    paddingRight: 10
  },
  row: {
    alignItems: 'center',
    borderBottomColor: variables.white,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 65
  },
  text: {
    fontFamily: variables.mainFont,
    fontSize: 12
  }
});
