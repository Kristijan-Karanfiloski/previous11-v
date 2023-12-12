import React, { useState } from 'react';
import { FlatList, StyleSheet, Switch, Text, View } from 'react-native';

import { Player } from '../../../types';
import ButtonNew from '../../components/common/ButtonNew';
import Dropdown from '../../components/common/Dropdown';
import ModalContainer from '../../components/common/Modals/ModalContainer';
import { selectAvailableTags } from '../../redux/slices/configSlice';
import {
  selectAllPlayers,
  updatePlayerAction
} from '../../redux/slices/playersSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import {
  sortPlayersByConnectionAndTagNumber,
  sortStringsInAscendingOrder
} from '../../utils';
import { variables } from '../../utils/mixins';

type Props = {
  playersState: {
    [key: string]: boolean;
  };
  close: () => void;
  setPlayersState: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
  players: Player[];
  onSave: () => void;
};

const MissingTagsModal = ({
  playersState,
  close,
  setPlayersState,
  players,
  onSave
}: Props) => {
  const dispatch = useAppDispatch();
  const allPlayers = useAppSelector(selectAllPlayers);
  const avaialableTags = useAppSelector(selectAvailableTags);

  const [playersWithoutTags, setPlayersWithNoTag] = useState(players);

  const onTagChange = (playerId: string, value: string) => {
    setPlayersWithNoTag((prevState) =>
      prevState.map((player) => {
        if (player.id === playerId) {
          return { ...player, tag: value };
        }
        return player;
      })
    );
    dispatch(updatePlayerAction({ id: playerId, tag: value }));
  };

  const startTrackingDisabled = (allPlayers: Player[]) => {
    const unAssignedIncludedPlayers = Object.keys(playersState).filter(
      (playerId) => {
        if (playersState[playerId]) {
          const hasTagAssigned = allPlayers.find(
            ({ id }) => playerId === id
          )?.tag;
          return !hasTagAssigned;
        }

        return false;
      }
    );

    return !!unAssignedIncludedPlayers.length;
  };

  const renderPlayer = ({ item }: { item: Player }) => {
    const options =
      avaialableTags.indexOf(item.tag) > -1
        ? avaialableTags
        : [...avaialableTags, item.tag];

    return (
      <View style={styles.row}>
        <Text style={[styles.playerText, styles.column1]}>{item.name}</Text>
        <View style={styles.column4}>
          <View style={{ width: 75 }}>
            <Dropdown
              placeholder="-"
              uiType="two"
              options={sortStringsInAscendingOrder(options).map((tag) => ({
                label: tag,
                value: tag
              }))}
              onChange={(val) => onTagChange(item.id, val)}
              value={item.tag}
              containerStyle={{
                backgroundColor: variables.realWhite,
                borderWidth: 1,
                borderColor: !item.tag ? variables.red : variables.grey2,
                borderRadius: 8
              }}
              customDropdownStyle={{
                backgroundColor: variables.lineGrey
              }}
            />
          </View>
        </View>

        <View style={styles.column2}>
          <Switch
            value={playersState[item.id]}
            onValueChange={(val) =>
              setPlayersState((prevState) => ({
                ...prevState,
                [item.id]: val
              }))
            }
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

  return (
    <ModalContainer title="Tag assignment required" close={close}>
      <View style={styles.warningModalWidth}>
        <View style={[styles.topContainer, styles.warningModalWidthHeader]}>
          <Text>
            One or more players are missing tags. Please asign a tag or remove
            them to start tracking
          </Text>
        </View>
        <View style={styles.headers}>
          <Text style={[styles.header, styles.column1]}>Player</Text>
          <Text style={[styles.header, styles.column4]}>Tag</Text>
          <Text style={[styles.header, styles.column2]}>Included</Text>
        </View>
        <FlatList
          data={sortPlayersByConnectionAndTagNumber(playersWithoutTags)}
          renderItem={renderPlayer}
          // style={{ flex: 1, backgroundColor: 'red' }}
          contentContainerStyle={
            {
              // flex: 1,
              // height: 200,
              // width: 200
            }
          }
        />

        <View style={styles.buttons}>
          <ButtonNew
            text="Cancel"
            onPress={close}
            mode="secondary"
            style={styles.saveButton}
          />

          <ButtonNew
            disabled={startTrackingDisabled(allPlayers)}
            text="Start Tracking"
            onPress={onSave}
          />
        </View>
      </View>
    </ModalContainer>
  );
};

export default MissingTagsModal;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 45
  },

  column1: {
    flex: 27
  },
  column2: {
    flex: 17.5
  },

  column4: {
    flex: 16
  },

  header: {
    fontFamily: variables.mainFontSemiBold,
    fontSize: 16
  },

  headers: {
    flexDirection: 'row',
    paddingBottom: 20
  },

  playerText: {
    fontFamily: variables.mainFontSemiBold
  },
  row: {
    alignItems: 'center',
    borderBottomColor: variables.lighterGrey,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 65
  },
  saveButton: {
    marginRight: 30
  },

  topContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40
  },

  warningModalWidth: {
    backgroundColor: 'white',
    height: 420,
    width: 400
  },
  warningModalWidthHeader: {
    width: 300
  }
});
