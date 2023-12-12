import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { toNumber } from 'lodash';

import { Player } from '../../types';
import { uploadPhoto } from '../helpers/firestoreService';
import { selectAuth } from '../redux/slices/authSlice';
import { selectActiveClub } from '../redux/slices/clubsSlice';
import { selectAvailableTags } from '../redux/slices/configSlice';
import {
  selectAllPlayers,
  selectPlayerById,
  updatePlayerAction
} from '../redux/slices/playersSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { commonStyles } from '../theme';
import { sortStringsInAscendingOrder } from '../utils';
import { utils, variables } from '../utils/mixins';

import Avatar from './common/Avatar';
import ButtonNew from './common/ButtonNew';
import Card from './common/Card';
import Dropdown from './common/Dropdown';
import InfoCell from './common/InfoCell';
import InputCell from './common/InputCell';
import OverlayLoader from './common/OverlayLoader';
import TakePhoto from './common/TakePhoto';

interface Props {
  close: () => void;
  playerId: string;
  isVisible: boolean;
}

const EditPlayerInfoOnboarding = ({ close, playerId, isVisible }: Props) => {
  const dispatch = useAppDispatch();
  const player = useAppSelector((state) => selectPlayerById(state, playerId));
  const allPlayers = useAppSelector(selectAllPlayers);
  const avaialableTags = useAppSelector(selectAvailableTags);
  const auth = useAppSelector(selectAuth);
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(player?.name || '');
  const [email, setEmail] = useState(player?.email || '');
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    player?.photoUrl || null
  );
  const [shirtNumber, setShirtNumber] = useState(player?.tShirtNumber || '');
  const [role, setRole] = useState(player?.role || '');
  const [position, setPosition] = useState<number>(
    toNumber(player?.ppos) || -1
  );
  const [tag, setTag] = useState(player?.tag || '');

  const tags = player?.tag
    ? [...avaialableTags, `${player?.tag}`]
    : avaialableTags;

  const playersShirtNumber = useMemo(() => {
    return allPlayers.map((player) => player.tShirtNumber);
  }, [allPlayers]);

  const onSubmit = async () => {
    if (!name) {
      alert('Please enter a name');
      return;
    }
    if (role === '') {
      alert('Please select a role');
      return;
    }
    if (position < 0 && +role !== 3 && !isHockey) {
      alert('Please select a position');
      return;
    }
    if (isHockey && (+role !== 0 || +role !== 3) && position < 0) {
      alert('Please select a position');
      return;
    }
    if (email && allPlayers.map((player) => player.email).includes(email)) {
      alert('Email is curently beeing used for another player');
      return;
    }

    setIsLoading(true);

    const playerNew: Partial<Player> = {
      ...player,
      name,
      email,
      tShirtNumber: shirtNumber,
      role,
      position: [role, utils.getPPOS(+role, position, isHockey)],
      ppos: utils.getPPOS(+role, position, isHockey),
      tag,
      photoUrl
    };

    await dispatch(updatePlayerAction(playerNew));
    setIsLoading(false);
    close();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={close}
      animationIn="fadeIn"
      style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Card
        style={StyleSheet.flatten([
          commonStyles.settingsCardContainer,
          { width: variables.deviceWidth * 0.75 }
        ])}
      >
        <Text style={styles.title}>Edit Player</Text>
        <View style={commonStyles.sepparator} />
        <ScrollView>
          <InfoCell title="Profile Picture" subTitle="Add player profile">
            <TakePhoto
              onSuccess={({ uri }) => {
                setIsLoading(true);
                uploadPhoto('player', player?.id || auth.id, uri)
                  .then((photoUrl) => setPhotoUrl(photoUrl))
                  .finally(() => setIsLoading(false));
              }}
            >
              <Avatar
                style={styles.avatar}
                enableUpload
                photoUrl={photoUrl || undefined}
              />
            </TakePhoto>
          </InfoCell>
          <InputCell
            placeholder="Player's Full name"
            title="Name *"
            value={name}
            onTextInput={setName}
          />

          <InputCell
            placeholder="Enter Player's email"
            title="Email"
            value={email}
            onTextInput={(value) => setEmail(value.toLowerCase())}
            keyboardType="email-address"
          />

          <InfoCell title="Shirt number" subTitle="Player Number">
            <View style={styles.dropdownContainer}>
              <Dropdown
                uiType="two"
                placeholder="Select Shirt"
                value={shirtNumber}
                options={[...Array(99).keys()]
                  .filter((item) => {
                    if (
                      player?.tShirtNumber &&
                      +player?.tShirtNumber === item + 1
                    ) {
                      return true;
                    }
                    return !playersShirtNumber.includes((item + 1) as any);
                  })
                  .map((item) => {
                    const label = `${item + 1}`;
                    return {
                      label,
                      value: item + 1
                    };
                  })}
                onChange={setShirtNumber}
              />
            </View>
          </InfoCell>
          <View style={commonStyles.sepparator} />
          <InfoCell title="Role *" subTitle="Select Player Role">
            <View style={styles.dropdownContainer}>
              <Dropdown
                uiType="two"
                placeholder="Select role"
                value={role}
                options={(isHockey
                  ? variables.playerPositionsHockey
                  : variables.playerPositions
                ).map((item, index) => {
                  return {
                    label: item,
                    value: index
                  };
                })}
                onChange={setRole}
                preventUnselect
              />
            </View>
          </InfoCell>
          <View style={commonStyles.sepparator} />
          <InfoCell
            title="Preferred Position *"
            subTitle="Select Player Position"
          >
            <View style={styles.dropdownContainer}>
              <Dropdown
                uiType="two"
                placeholder="Select position"
                value={position}
                options={
                  isHockey
                    ? variables.positionOptionsHockey
                    : variables.positionOptions
                }
                onChange={setPosition}
                preventUnselect
                disabled={
                  isHockey
                    ? toNumber(role) === 3 || toNumber(role) === 0
                    : toNumber(role) === 3
                }
              />
            </View>
          </InfoCell>
          <View style={commonStyles.sepparator} />
          <InfoCell title="Assigned Tag" subTitle="Tag Automatically Assigned">
            <View style={styles.dropdownContainer}>
              <Dropdown
                uiType="two"
                placeholder="Select tag"
                value={tag}
                options={sortStringsInAscendingOrder(tags).map((tag) => {
                  return {
                    label: tag,
                    value: tag
                  };
                })}
                onChange={setTag}
                preventUnselect
              />
            </View>
          </InfoCell>
          <View style={commonStyles.sepparator} />
        </ScrollView>
        <View style={styles.buttons}>
          <ButtonNew
            text="Cancel"
            onPress={close}
            mode="secondary"
            style={styles.saveButton}
          />
          <ButtonNew text="Edit" onPress={onSubmit} />
        </View>
        <OverlayLoader isLoading={isLoading} />
      </Card>
    </Modal>
  );
};

export default EditPlayerInfoOnboarding;

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 2,
    height: 64,
    marginRight: 3,
    width: 64
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 45
  },
  dropdownContainer: {
    width: variables.deviceWidth * 0.2
  },
  saveButton: {
    marginRight: 30
  },
  title: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    textAlign: 'center'
  }
});
