import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Player } from '../../../types';
import AddNewPlayer from '../../components/AddNewPlayer';
import AlertTooltip from '../../components/common/AlertTooltip';
import Avatar from '../../components/common/Avatar';
import Card from '../../components/common/Card';
import Dropdown from '../../components/common/Dropdown';
import InfoCell from '../../components/common/InfoCell';
import SlideInSubPage from '../../components/common/SlideInSubPage';
import EditPlayerInfo from '../../components/EditPlayerInfo';
import EditPlayerInfoOnboarding from '../../components/EditPlayerInfoOnboarding';
import { selectActiveClub } from '../../redux/slices/clubsSlice';
import { selectAvailableTags } from '../../redux/slices/configSlice';
import {
  selectAllPlayers,
  updatePlayerAction
} from '../../redux/slices/playersSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { commonStyles, palette } from '../../theme';
import { SlideInSubPageRef } from '../../types';
import { sortStringsInAscendingOrder } from '../../utils';
import { variables } from '../../utils/mixins';

interface PlayersInfoProps {
  onboardingEditPlayer?: boolean;
}

const PlayersInfo = (
  { onboardingEditPlayer = false }: PlayersInfoProps,
  ref: React.Ref<any>
) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const players = useAppSelector(selectAllPlayers);
  const avaialableTags = useAppSelector(selectAvailableTags);
  const [newPlayerModalVisible, setNewPlayerModalVisible] = useState(false);
  const [showPlayerInfo, setShowPlayerInfo] = useState<boolean | string>(false);
  const [isSaved, setIsSaved] = useState(false);
  const pageRef = React.useRef<SlideInSubPageRef | null>(null);
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  useEffect(() => {
    if (isSaved) {
      setTimeout(() => setIsSaved(false), 3000);
    }
  }, [isSaved]);

  useImperativeHandle(
    ref,
    () => {
      return {
        toggleModal
      };
    },
    []
  );

  const toggleModal = () => {
    setNewPlayerModalVisible((prevState) => !prevState);
  };

  const onBlurSubmit = (player: Player, modifiedField: Record<any, any>) => {
    if (!modifiedField) return;

    if (
      modifiedField.email &&
      players
        .map((player) => player.email)
        .includes(modifiedField.email.toLowerCase())
    ) {
      alert('Email is curently beeing used for another player');
      return null;
    }
    const entry = Object.entries(modifiedField)[0];
    if (player[entry[0] as keyof Player] === entry[1]) return;
    setIsSaved(true);
    return dispatch(
      updatePlayerAction({
        ...player,
        ...modifiedField
      })
    );
  };

  if (showPlayerInfo) {
    if (onboardingEditPlayer) {
      return (
        <EditPlayerInfoOnboarding
          close={() => setShowPlayerInfo(false)}
          playerId={showPlayerInfo as string}
          isVisible={!!showPlayerInfo}
        />
      );
    }
    return (
      <SlideInSubPage ref={pageRef} onClose={() => setShowPlayerInfo(false)}>
        <EditPlayerInfo
          close={() => pageRef.current?.pageClose()}
          playerId={showPlayerInfo as string}
          onSubmit={onBlurSubmit}
        />
      </SlideInSubPage>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Card style={{ ...commonStyles.settingsCardContainer, flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Player List</Text>
              <Pressable
                style={styles.btnPosition}
                onPress={() => setNewPlayerModalVisible(true)}
              >
                <Text style={styles.redText}>Add New</Text>
                <Feather name="plus" size={17} color={palette.orange} />
              </Pressable>
            </View>
            {/* <Pressable style={commonStyles.flexRowCenter}>
            <Text style={styles.redText}>Autoassign Tags</Text>
            <MaterialCommunityIcons
              name="reload"
              size={17}
              color={palette.orange}
            />
          </Pressable> */}
          </View>
          <View style={commonStyles.sepparator} />
          <ScrollView>
            {[
              ...(isHockey
                ? variables.playerPositionsPluralHockey
                : variables.playerPositionsPlural),
              'Not Specified'
            ].map((group, index) => {
              let groupPlayers =
                players.filter((player) => (player.role as any) === index) ||
                [];

              if (group === 'Not Specified') {
                groupPlayers = players.filter(
                  (player) =>
                    !(
                      isHockey
                        ? variables.playerPositionsPluralHockey
                        : variables.playerPositionsPlural
                    )[parseInt(player.role)]
                );

                if (groupPlayers.length === 0) return null;
              }

              return (
                <View key={group} style={{ marginBottom: 16 }}>
                  <Text style={styles.groupTitle}>{group}</Text>
                  {groupPlayers.length > 0
                    ? (
                        groupPlayers.map((player: Player) => {
                          const options =
                        avaialableTags.indexOf(player.tag) > -1
                          ? avaialableTags
                          : [...avaialableTags, player.tag];

                          return (
                        <Pressable
                          key={player.id}
                          style={styles.playerContainer}
                          onPress={() => setShowPlayerInfo(player.id)}
                        >
                          <Avatar
                            style={styles.avatar}
                            photoUrl={player.photoUrl}
                          />
                          <InfoCell
                            title={player.name}
                            subTitle={
                              (isHockey
                                ? variables.positionMappingHockey
                                : variables.positionMapping)[
                                (player.ppos || 0) as number
                              ]
                            }
                            containerStyle={styles.cellContainer}
                            titleStyle={styles.playerTitle}
                          >
                            <View style={{ width: 150 }}>
                              <Dropdown
                                placeholder="-"
                                uiType="two"
                                options={sortStringsInAscendingOrder(
                                  options
                                ).map((tag) => ({
                                  label: tag,
                                  value: tag
                                }))}
                                onChange={(tag) =>
                                  onBlurSubmit(player, { tag: tag || null })
                                }
                                value={player.tag}
                              />
                            </View>
                          </InfoCell>
                        </Pressable>
                          );
                        })
                      )
                    : (
                    <Text style={styles.playerTitle}>No {group} added yet</Text>
                      )}
                </View>
              );
            })}
          </ScrollView>
        </Card>
        {!onboardingEditPlayer && (
          <Card style={commonStyles.settingsCardContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <View style={styles.headerContainer}>
                <Text style={styles.title}>Tag Management</Text>
                <Pressable
                  style={styles.btnPosition}
                  onPress={() => navigation.navigate('AddingTagsModal')}
                >
                  <Text style={styles.redText}>Add New</Text>
                  <Feather name="plus" size={17} color={palette.orange} />
                </Pressable>
              </View>
            </View>
            <Text
              style={{
                marginTop: 20,
                fontFamily: variables.mainFont
              }}
            >
              Click ‘Add new’ to add a new tag to your team kit.
            </Text>
          </Card>
        )}
        {newPlayerModalVisible && (
          <AddNewPlayer
            isVisible={newPlayerModalVisible}
            onClose={() => setNewPlayerModalVisible(false)}
          />
        )}
      </View>
      {isSaved && <AlertTooltip text="Changes saved!" />}
    </View>
  );
};

export default forwardRef(PlayersInfo);

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 2,
    height: 50,
    marginRight: 17,
    width: 50
  },
  btnPosition: {
    flexDirection: 'row',
    position: 'absolute',
    right: 15,
    top: 5
  },
  cellContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 0
  },
  container: {
    flex: 1,
    paddingHorizontal: 100,
    paddingTop: 31
  },
  groupTitle: {
    fontFamily: variables.mainFontBold,
    fontSize: 16,
    marginBottom: 8
  },

  headerContainer: {
    width: '100%'
  },
  playerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 7
  },
  playerTitle: { fontFamily: variables.mainFont, fontSize: 14 },
  redText: {
    color: palette.orange,
    fontFamily: variables.mainFontMedium,
    fontSize: 16
  },
  title: {
    fontFamily: variables.mainFontMedium,
    fontSize: 20
  }
});
