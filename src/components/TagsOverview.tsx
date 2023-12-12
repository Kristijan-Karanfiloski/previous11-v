import React, { useContext } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';

import { Player } from '../../types';
import { SocketContext } from '../hooks/socketContext';
import { selectConfig } from '../redux/slices/configSlice';
import { selectOnlineTags } from '../redux/slices/onlineTagsSlice';
import {
  selectAllPlayers,
  updatePlayerAction
} from '../redux/slices/playersSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import {
  getPlayerAndTagOnlineStatus,
  sortPlayersByConnectionAndTagNumber,
  sortStringsInAscendingOrder
} from '../utils';
import { variables } from '../utils/mixins';

import ButtonNew from './common/ButtonNew';
import Card from './common/Card';
import Dropdown from './common/Dropdown';
import { Icon } from './icon/icon';

const TagsOverview = () => {
  const { isReady } = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const players = useAppSelector(selectAllPlayers);
  const config = useAppSelector(selectConfig);
  const onlineTags = useAppSelector(selectOnlineTags);
  const navigation = useNavigation();
  const configTags = Object.values(config.tags);

  const tagsAvailable = _.difference(
    configTags,
    players.map(({ tag }) => tag)
  );

  const tagsAvailableOptions = tagsAvailable.map((tag) => ({
    label: tag,
    value: tag
  }));

  const onTagChange = (playerId: string, value: string) => {
    dispatch(updatePlayerAction({ id: playerId, tag: value }));
  };

  const renderPlayer = ({ item }: { item: Player }) => {
    const options = [...tagsAvailableOptions];
    if (item.tag) {
      options.push({
        label: item.tag,
        value: item.tag
      });
    }

    const { connectionText, connectionIcon, batteryPercentage, batteryIcon } =
      getPlayerAndTagOnlineStatus(config.tags, onlineTags, item.tag, isReady);

    const renderStatus = (tag: string) => {
      return (
        <Pressable
          onPress={() =>
            connectionText === 'Disconnected' &&
            !!tag &&
            navigation.navigate('TroubleshootingTag', { tagId: tag })
          }
          style={[styles.column, styles.column3]}
        >
          <Icon style={styles.icon} icon={connectionIcon} />
          <Text style={styles.text}>{connectionText}</Text>
          {connectionText === 'Disconnected' && !!tag && (
            <Icon icon="arrow_next" style={styles.arrowIcon} />
          )}
        </Pressable>
      );
    };

    return (
      <View style={styles.row}>
        <Text style={[styles.playerText, styles.column1]}>{item.name}</Text>
        <View style={styles.column2}>
          <Dropdown
            placeholder=""
            uiType="two"
            options={sortStringsInAscendingOrder(
              options.map(({ value }) => value)
            ).map((value) => ({ label: value, value }))}
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
          {!item.tag && <Text style={styles.errorTag}>Assign Tag</Text>}
        </View>
        {renderStatus(item.tag)}
        <View style={[styles.column, styles.column4]}>
          {!!batteryPercentage && (
            <>
              <Icon style={styles.icon} icon={batteryIcon} />
              <Text style={styles.text}>{batteryPercentage}%</Text>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <Card style={styles.cardContainer}>
      <View style={styles.headers}>
        <Text style={[styles.header, styles.column1]}>Player</Text>
        <Text style={[styles.header, styles.column2]}>Tag</Text>
        <Text style={[styles.header, styles.column3]}>Status</Text>
        <Text style={[styles.header, styles.column4]}>Battery</Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={sortPlayersByConnectionAndTagNumber(players)}
          style={styles.flatList}
          renderItem={renderPlayer}
        />
      </View>
      <View style={styles.buttons}>
        <ButtonNew
          text="Cancel"
          onPress={() => navigation.goBack()}
          mode="secondary"
          style={styles.saveButton}
        />
        <ButtonNew text="OK" onPress={() => navigation.goBack()} />
      </View>
    </Card>
  );
};

export default TagsOverview;

const styles = StyleSheet.create({
  arrowIcon: {
    color: variables.lightGrey,
    height: 18,
    marginBottom: 1,
    marginLeft: 5,
    width: 18
  },
  buttons: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 111,
    justifyContent: 'center'
  },
  cardContainer: {
    backgroundColor: variables.realWhite,
    flex: 1,
    marginTop: 15,
    paddingTop: 20,
    shadowColor: variables.realWhite,
    shadowOpacity: 0.05
  },
  column: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  column1: {
    width: 140
  },
  column2: {
    marginRight: 45,
    width: 75
  },
  column3: {
    width: 170
  },
  column4: {
    width: 120
  },
  errorTag: {
    color: variables.red,
    fontFamily: variables.mainFontMedium,
    fontSize: 10,
    marginTop: 5,
    textTransform: 'uppercase'
  },
  flatList: {
    paddingHorizontal: 30
  },
  header: {
    fontFamily: variables.mainFontSemiBold,
    fontSize: 16
  },
  headers: {
    alignItems: 'center',
    borderBottomColor: variables.backgroundColor,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingHorizontal: 30
  },
  icon: {
    marginRight: 10
  },
  listContainer: {
    flex: 1
  },
  playerText: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 13
  },
  row: {
    alignItems: 'center',
    borderBottomColor: variables.backgroundColor,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 65,
    justifyContent: 'space-between'
  },
  saveButton: {
    marginRight: 30
  },
  text: {
    fontFamily: variables.mainFontMedium
  }
});
