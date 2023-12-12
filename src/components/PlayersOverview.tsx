import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';

import { GamePreparation, GameType, Player } from '../../types';
import { LiveTimerContext } from '../hooks/liveTimerContext';
import { SocketContext } from '../hooks/socketContext';
import { selectActiveClub } from '../redux/slices/clubsSlice';
import { selectAvailableTags, selectConfig } from '../redux/slices/configSlice';
import { selectLastFinishedMatch } from '../redux/slices/gamesSlice';
import { selectOnlineTags } from '../redux/slices/onlineTagsSlice';
import {
  selectAllPlayers,
  updatePlayerAction
} from '../redux/slices/playersSlice';
import { selectTrackingEvent } from '../redux/slices/trackingEventSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import MissingTagsModal from '../screens/EventScreens/MissingTagsModal';
import { DrawerStackParamList } from '../types';
import {
  getPlayerAndTagOnlineStatus,
  getPlayersMacIds,
  sortPlayersByConnectionAndTagNumber,
  sortStringsInAscendingOrder,
  updateSubstitutions
} from '../utils';
import { utils, variables } from '../utils/mixins';

import ButtonNew from './common/ButtonNew';
import Card from './common/Card';
import Dropdown from './common/Dropdown';
import { Icon } from './icon/icon';

export default function PlayersOverview() {
  const route = useRoute() as RouteProp<
    DrawerStackParamList,
    'PlayersOverviewModal'
  >;
  const { onSave, isLive } = route.params;
  const navigation = useNavigation();
  const { timer } = useContext(LiveTimerContext);
  const { isReady, edgeConnected } = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const allPlayers = useAppSelector(selectAllPlayers);
  const activeEvent = useAppSelector(selectTrackingEvent);
  const lastFinishedMatch = useAppSelector(selectLastFinishedMatch);
  const avaialableTags = useAppSelector(selectAvailableTags);
  const config = useAppSelector(selectConfig);
  const onlineTags = useAppSelector(selectOnlineTags);
  const tagsConnectedToEdge = onlineTags.map(({ id }) => id);
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  const macIds = getPlayersMacIds(
    allPlayers.map(({ id }) => id),
    allPlayers,
    config.tags
  );
  const numberOfTagsConnected = Object.keys(macIds).filter((id) => {
    return tagsConnectedToEdge.includes(id);
  }).length;
  const [selectedPlayers, setSelectedPlayers] = useState<{
    [key: string]: boolean;
  }>({});

  const [showMissingTagsModal, setShowMissingTagsModal] = useState(false);

  const eventRef = useRef(route.params.event);
  const event = eventRef.current;

  useEffect(() => {
    setSelectedPlayers(getSelectedPlayers());
  }, []);

  const getPlayersWithoutTag = () => {
    const playerIds =
      Object.keys(selectedPlayers).filter(
        (player) => selectedPlayers[player]
      ) || [];

    return allPlayers.filter(
      (player) => !player.tag && playerIds.includes(player.id)
    );
  };

  const onSaveHandler = (startEvent = false) => {
    if (!activeEvent && startEvent) {
      const playersWithoutTag = getPlayersWithoutTag();

      if (playersWithoutTag.length > 0) {
        return setShowMissingTagsModal(true);
      }
    }

    if (startEvent && (!isReady || !edgeConnected)) {
      return navigation.navigate('LostConnectionModal', {
        isStartingEvent: true
      });
    }

    if (activeEvent && startEvent) {
      return Alert.alert(
        'A session is already live',
        'Please end the current session to start tracking a new.',
        [
          {
            text: 'OK, got it.',
            style: 'cancel'
          }
        ],
        { cancelable: false }
      );
    }
    const playerState = Object.keys(selectedPlayers);
    const preparation: GamePreparation = {
      playersInPitch: playerState.filter(
        (playerId) => selectedPlayers[playerId]
      ),
      playersOnBench: allPlayers
        .filter((player) => !selectedPlayers[player.id])
        .map(({ id }) => id)
    };

    if (isLive) {
      const initialPlayersSelectedStatus = getSelectedPlayers() as {
        [key: string]: boolean;
      };

      const subedPlayers = Object.keys(getSelectedPlayers())
        .filter(
          (playerId) =>
            initialPlayersSelectedStatus[playerId] !== selectedPlayers[playerId]
        )
        .map((playerId) => {
          return { playerId, status: selectedPlayers[playerId] };
        });

      preparation.substitutions = updateSubstitutions(
        activeEvent,
        timer,
        subedPlayers,
        isHockey
      );
    }

    const isTraining = event.type === GameType.Training;
    const { date, dateFormat } = utils.checkAndFormatUtcDate(
      event.UTCdate,
      event.date,
      event.startTime
    );
    const isPastTime = moment(`${date}`, `${dateFormat}`).isBefore(
      moment().format(`${dateFormat}`),
      'day'
    );

    if (isTraining && isPastTime && !event.id) {
      return Alert.alert(
        'Error',
        "Can't create training event on past date/time",
        [
          {
            text: 'OK',
            style: 'cancel'
          }
        ],
        { cancelable: true }
      );
    }

    if (!preparation.playersInPitch.length) {
      return Alert.alert(
        "Can't start",
        'Please select at least one player',
        [
          {
            text: 'OK',
            style: 'cancel'
          }
        ],
        { cancelable: true }
      );
    }
    onSave({ ...event, preparation }, startEvent);
  };

  const getSelectedPlayers = () => {
    if (
      event.preparation &&
      (event.preparation.playersInPitch.length !== 0 ||
        event.preparation.playersOnBench.length !== 0)
    ) {
      const selectedPlayers = (event?.preparation?.playersInPitch || []).reduce(
        (acc, cur) => ({ ...acc, [cur]: true }),
        {}
      );
      const unSelectedPlayers = (
        event?.preparation?.playersOnBench || []
      ).reduce((acc, cur) => ({ ...acc, [cur]: false }), {});

      const unfilteredPlayers: Record<string, string> = {
        ...selectedPlayers,
        ...unSelectedPlayers
      };
      // check if some of the IDs are from deleted player
      const filteredPlayers = Object.keys(unfilteredPlayers).reduce(
        (acc, cur) => {
          if (allPlayers.find((player) => player.id === cur)) {
            return { ...acc, [cur]: unfilteredPlayers[cur] };
          }
          return acc;
        },
        {}
      );
      return filteredPlayers;
    }

    if (event.type === GameType.Training) {
      return allPlayers.reduce((acc, cur) => ({ ...acc, [cur.id]: true }), {});
    }

    if (lastFinishedMatch && lastFinishedMatch.preparation) {
      const selectedPlayers = lastFinishedMatch.preparation.playersInPitch.map(
        (playerId) => playerId
      );
      return allPlayers.reduce(
        (acc, cur) => ({ ...acc, [cur.id]: selectedPlayers.includes(cur.id) }),
        {}
      );
    }
    return allPlayers.reduce((acc, cur) => ({ ...acc, [cur.id]: false }), {});
  };

  const onTagChange = (playerId: string, value: string) => {
    // if (showModalWarning) {
    //   setPlayersWithNoTag((prevPlayers) =>
    //     prevPlayers.map((player) =>
    //       player.id === playerId ? { ...player, tag: value } : player
    //     )
    //   );
    // }
    dispatch(updatePlayerAction({ id: playerId, tag: value }));
  };

  // const unDeletedPlayers = players.filter((player) => player.deleted !== true);

  const includeOrExcludeAllPlayers = (status: boolean) => {
    setSelectedPlayers(
      allPlayers.reduce((acc, cur) => ({ ...acc, [cur.id]: status }), {})
    );
  };

  const renderPlayer = ({ item }: { item: Player }) => {
    const options =
      avaialableTags.indexOf(item.tag) > -1
        ? avaialableTags
        : [...avaialableTags, item.tag];

    const { connectionText, connectionIcon, batteryPercentage, batteryIcon } =
      getPlayerAndTagOnlineStatus(config.tags, onlineTags, item.tag, isReady);

    return (
      <View style={styles.row}>
        <View style={styles.column1}>
          <Text numberOfLines={1} style={styles.playerText}>
            {item.name}
          </Text>
        </View>
        <View style={styles.column2}>
          <View style={{ width: 75 }}>
            <Dropdown
              disabled={isLive}
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
            value={selectedPlayers[item.id]}
            onValueChange={(value) => {
              setSelectedPlayers((prevState) => ({
                ...prevState,
                [item.id]: value
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

  const onSaveMissingTags = () => {
    setShowMissingTagsModal(false);
    onSaveHandler(true);
  };
  const numberOfSelectedPlayers = Object.keys(selectedPlayers).filter(
    (playerId) => selectedPlayers[playerId]
  ).length;

  return (
    <View style={styles.mainContainer}>
      {showMissingTagsModal && (
        <MissingTagsModal
          playersState={selectedPlayers}
          close={() => setShowMissingTagsModal(false)}
          setPlayersState={setSelectedPlayers}
          players={getPlayersWithoutTag()}
          onSave={onSaveMissingTags}
        />
      )}
      <Card style={styles.cardContainer}>
        <View style={styles.headerContainer}>
          <Pressable onPress={navigation.goBack} style={styles.closeIcon}>
            <AntDesign name="close" size={21} color={variables.red} />
          </Pressable>
          <View style={styles.handle} />
        </View>
        <Text style={styles.heading}>Players Overview</Text>
      </Card>
      <Card style={{ ...styles.cardContainer, flex: 1 }}>
        <View style={styles.topContainer}>
          <View style={styles.topWrapper}>
            <Icon
              style={styles.icon}
              icon={isReady ? 'icon_connected' : 'icon_disconnected'}
            />
            <Text numberOfLines={1}>
              {isReady && config.edgeDeviceName
                ? `Connected Egde: ${config.edgeDeviceName}`
                : 'Not Connected'}
            </Text>
          </View>
          <View style={styles.topWrapper}>
            <Icon style={styles.icon} icon="opponent_icon" />
            <Text>{`${numberOfSelectedPlayers} Players Included`}</Text>
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
            <Text>{`${
              onlineTags && isReady ? numberOfTagsConnected : 0
            } Tags Connected`}</Text>
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
          <FlatList
            data={sortPlayersByConnectionAndTagNumber(allPlayers)}
            renderItem={renderPlayer}
            style={styles.flatList}
          />
        </View>
        <View style={styles.includeExcludeContainer}>
          <Pressable onPress={() => includeOrExcludeAllPlayers(true)}>
            <View style={styles.underlineBorder}>
              <Text style={styles.includeExcludeText}>INCLUDE ALL</Text>
            </View>
          </Pressable>
          <View style={styles.includeExcludeBorder} />
          <Pressable onPress={() => includeOrExcludeAllPlayers(false)}>
            <View style={styles.underlineBorder}>
              <Text style={styles.includeExcludeText}>EXCLUDE ALL</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.buttons}>
          <ButtonNew
            text="Save & Close"
            onPress={() => onSaveHandler(false)}
            mode="secondary"
            style={styles.saveButton}
          />
          {!isLive && (
            <ButtonNew
              text="Start Tracking"
              onPress={() => {
                requestAnimationFrame(() => {
                  onSaveHandler(true);
                });
              }}
            />
          )}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 45
  },
  cardContainer: {
    backgroundColor: variables.realWhite,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 6,
    padding: 20,
    shadowColor: variables.realWhite,
    shadowOpacity: 0.05
  },
  closeIcon: {
    left: 0,
    position: 'absolute',
    top: -5
  },
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
  flatList: {
    paddingHorizontal: 30
  },
  handle: {
    backgroundColor: variables.lightGrey,
    borderRadius: 4,
    height: 5,
    marginBottom: 10,
    width: 70
  },

  header: {
    fontFamily: variables.mainFontSemiBold,
    fontSize: 16
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  headers: {
    flexDirection: 'row',
    paddingBottom: 20,
    paddingHorizontal: 30
  },
  heading: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    textAlign: 'center'
  },
  icon: {
    marginRight: 10
  },
  includeExcludeBorder: {
    borderRightColor: variables.textBlack,
    borderRightWidth: 2,
    marginHorizontal: 10
  },
  includeExcludeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 25
  },
  includeExcludeText: {
    color: variables.red,
    fontSize: 10,
    lineHeight: 14
  },
  listContainer: {
    flex: 1
  },
  mainContainer: {
    backgroundColor: '#F9F9F9',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flex: 1,
    marginTop: 65
  },

  playerText: {
    fontFamily: variables.mainFontSemiBold,
    paddingRight: 10
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
  text: {
    fontFamily: variables.mainFontMedium
  },
  topContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40
  },

  topWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 25
  },

  underlineBorder: {
    borderBottomColor: variables.red,
    borderBottomWidth: 0.5
  }
});
