import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { toNumber } from 'lodash';

import { Player } from '../../types';
import { uploadPhoto } from '../helpers/firestoreService';
import { selectAuth } from '../redux/slices/authSlice';
import { selectActiveClub } from '../redux/slices/clubsSlice';
import { selectAvailableTags } from '../redux/slices/configSlice';
import {
  addPlayerAction,
  selectAllPlayers,
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

interface AddNewPlayerProps {
  isVisible: boolean;
  onClose: () => void;
}

const AddNewPlayer = (props: AddNewPlayerProps) => {
  const dispatch = useAppDispatch();

  const auth = useAppSelector(selectAuth);
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  const avaialableTags = useAppSelector(selectAvailableTags);
  const allPlayers = useAppSelector(selectAllPlayers);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [shirtNumber, setShirtNumber] = useState('');
  const [role, setRole] = useState('');
  const [position, setPosition] = useState<number>(-1);
  const [tag, setTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadUri, setUploadUri] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!name) {
      alert('Please enter a name');
      return;
    }
    if (role === '') {
      alert('Please select a role');
      return;
    }
    if (!isHockey && position < 0 && +role !== 3) {
      alert('Please select a position');
      return;
    }
    if (isHockey && !(+role === 0 || +role === 3) && position < 0) {
      alert('Please select a position');
      return;
    }

    if (email && allPlayers.map((player) => player.email).includes(email)) {
      alert('Email is curently beeing used for another player');
      return;
    }
    // if (!validateEmail(email)) {
    //   alert('Please enter a valid email');
    //   return;
    // }
    setIsLoading(true);

    const player: Partial<Player> = {
      name,
      email,
      tShirtNumber: shirtNumber,
      role,
      position: [role, utils.getPPOS(+role, position, isHockey)],
      ppos: utils.getPPOS(+role, position, isHockey),
      tag
    };

    await dispatch(addPlayerAction(player))
      .unwrap()
      .then((playerId: string) => {
        if (!uploadUri) return;
        return uploadPhoto('player', playerId, uploadUri).then((photoUrl) =>
          dispatch(updatePlayerAction({ id: playerId, photoUrl }))
        );
      })
      .finally(props.onClose);
  };

  const playersShirtNumber = useMemo(() => {
    return allPlayers.map((player) => player.tShirtNumber);
  }, [allPlayers]);

  useEffect(() => {
    if (toNumber(role) === 3) {
      setPosition(-1);
    }
    if (isHockey && toNumber(role) === 0) {
      setPosition(-1);
    }
  }, [role]);

  const isBtnDisabled = useMemo(
    () => !name || !role || position === -1,
    [name, role, position]
  );

  return (
    <Modal
      isVisible={props.isVisible}
      //   onBackdropPress={props.onClose}
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
        <Text style={styles.title}>Add new Player</Text>
        <View style={commonStyles.sepparator} />
        <ScrollView>
          <InfoCell title="Profile Picture" subTitle="Add player profile">
            <TakePhoto onSuccess={({ uri }) => setUploadUri(uri)}>
              <Avatar style={styles.avatar} enableUpload photoUrl={uploadUri} />
            </TakePhoto>
          </InfoCell>
          <InputCell
            placeholder="Player's Full name"
            title="Name *"
            value={name}
            onTextInput={setName}
            autoCapitalize="words"
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
                options={sortStringsInAscendingOrder(avaialableTags).map(
                  (tag) => {
                    return {
                      label: tag,
                      value: tag
                    };
                  }
                )}
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
            onPress={props.onClose}
            mode="secondary"
            style={styles.saveButton}
          />
          <ButtonNew
            text="Create"
            onPress={onSubmit}
            disabled={isBtnDisabled}
          />
        </View>
        <OverlayLoader isLoading={isLoading} />
      </Card>
    </Modal>
  );
};

export default AddNewPlayer;

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
