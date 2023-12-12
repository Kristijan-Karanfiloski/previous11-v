import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AntDesign } from '@expo/vector-icons';
import _ from 'lodash';
import moment from 'moment';

import { Player } from '../../types';
import API from '../helpers/api';
import { uploadPhoto } from '../helpers/firestoreService';
import { selectAuth } from '../redux/slices/authSlice';
import { selectActiveClub } from '../redux/slices/clubsSlice';
import { selectAvailableTags } from '../redux/slices/configSlice';
import {
  batchUpdateGamesAction,
  selectScheduledGames
} from '../redux/slices/gamesSlice';
import {
  selectAllPlayers,
  selectPlayerById
} from '../redux/slices/playersSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { commonStyles } from '../theme';
import { sortStringsInAscendingOrder } from '../utils';
import { utils, variables } from '../utils/mixins';

import AlertTooltip from './common/AlertTooltip';
import Avatar from './common/Avatar';
import ButtonNew from './common/ButtonNew';
import Card from './common/Card';
import DateTimePIcker from './common/DateTimePicker';
import Dropdown from './common/Dropdown';
import InfoCell from './common/InfoCell';
import InputCell from './common/InputCell';
import OverlayLoader from './common/OverlayLoader';
import TakePhoto from './common/TakePhoto';
interface EditPlayerInfoProps {
  close: () => void;
  playerId: string;
  onSubmit: (player: Player, modifiedField: Record<string, any>) => void;
}

const EditPlayerInfo = ({
  close = () => undefined,
  playerId,
  onSubmit = () => undefined
}: EditPlayerInfoProps) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const player = useAppSelector((state) => selectPlayerById(state, playerId));
  const allPlayers = useAppSelector(selectAllPlayers);
  const avaialableTags = useAppSelector(selectAvailableTags);
  const activeTeam = useAppSelector(selectActiveClub);
  const isHockey = activeTeam.gameType === 'hockey';
  const scheduledEvents = useAppSelector(selectScheduledGames);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<string | undefined>();
  // const [height, setHeight] = useState<string | null>(null);
  // const [weight, setWeight] = useState<string | null>(null);
  const [contact, setContact] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInvite, setIsLoadingInvite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isSaved) {
      setTimeout(() => setIsSaved(false), 3000);
    }
  }, [isSaved]);

  useEffect(() => {
    if (player) {
      setName(player.name);
      setEmail(player.email);
      // setHeight(player.height || null);
      // setWeight(player.weight || null);
      setPhone(player.phone);
      setContact(player.contact);
    }
  }, [player]);

  useEffect(() => {
    if (player?.deleted) {
      close();
    }
  }, [player?.deleted]);

  const onDeletePlayer = useCallback(async () => {
    if (!player) return;

    const playerInScheduledEvents = scheduledEvents.filter(
      (event) =>
        event.preparation?.playersInPitch?.includes(player.id) ||
        event.preparation?.playersOnBench?.includes(player.id)
    );
    const eventsToUpdate = [];
    for (const event of playerInScheduledEvents) {
      const playersInPitch =
        event.preparation?.playersInPitch?.filter(
          (item) => item !== player.id
        ) || [];
      const playersOnBench =
        event.preparation?.playersOnBench?.filter(
          (item) => item !== player.id
        ) || [];
      eventsToUpdate.push({
        ...event,
        preparation: { ...event.preparation, playersInPitch, playersOnBench }
      });
    }
    if (eventsToUpdate.length > 0) {
      await dispatch(batchUpdateGamesAction(eventsToUpdate)).unwrap();
    }
    onBlurSubmit({ deleted: true, tag: '', tShirtNumber: null });
  }, [player, scheduledEvents]);

  const onBlurSubmit = useCallback(
    (modifiedField: Record<string, any>) => {
      const key = Object.keys(modifiedField)[0] as keyof Player;
      if (!player || player[key] === modifiedField[key]) return;
      if (
        modifiedField.email &&
        allPlayers
          .map((player) => player.email)
          .includes(modifiedField.email.toLowerCase())
      ) {
        alert('Email is curently beeing used for another player');
        setEmail('');
        return null;
      }
      setIsSaved(true);
      return onSubmit(player, modifiedField);
    },
    [player]
  );

  const availableShirts = useMemo(() => {
    const playersShirtNumber = allPlayers
      .map((player) => player.tShirtNumber)
      .filter((item) => item !== player?.tShirtNumber);
    const playersUsedNumbers = [...Array(99).keys()]
      .filter((item) => {
        return !playersShirtNumber.includes((item + 1) as any);
      })
      .map((item) => {
        const label = `${item + 1}`;
        return {
          label,
          value: item + 1
        };
      });

    return playersUsedNumbers;
  }, [allPlayers]);

  const getIsDisabledForPosition = () => {
    if (!isHockey) {
      return (
        (player?.role !== undefined && +(player?.role || 0) === 3) || false
      );
    }

    return (
      (player?.role !== undefined &&
        (+(player?.role || 0) === 3 || +(player?.role || 0) === 0)) ||
      false
    );
  };

  const renderPlayerProfile = () => {
    return (
      <Card style={commonStyles.settingsCardContainer}>
        <Text style={styles.title}>Player Profile</Text>
        <View style={commonStyles.sepparator} />
        <View>
          <InfoCell
            title="Profile Picture"
            subTitle="A profile picture helps personalize your profile"
          >
            <TakePhoto
              onSuccess={({ uri }) => {
                if (!player?.id) return;
                setIsLoading(true);
                uploadPhoto('player', player.id, uri)
                  .then((photoUrl) => onBlurSubmit({ photoUrl }))
                  .finally(() => setIsLoading(false));
              }}
            >
              <Avatar
                style={styles.avatar}
                enableUpload
                photoUrl={player?.photoUrl}
              />
            </TakePhoto>
          </InfoCell>

          <InputCell
            placeholder="Player's Full name"
            title="First & Last Name"
            value={name}
            onTextInput={setName}
            onBlur={() => onBlurSubmit({ name })}
            autoCapitalize="words"
          />

          <InfoCell title="Shirt number" subTitle="Player Number">
            <View style={styles.dropdownContainer}>
              <Dropdown
                uiType="two"
                placeholder="Select Shirt"
                value={player?.tShirtNumber || null}
                options={availableShirts}
                onChange={(tShirtNumber) => onBlurSubmit({ tShirtNumber })}
              />
            </View>
          </InfoCell>
          <View style={commonStyles.sepparator} />
          <InfoCell title="Role *" subTitle="Select Player Role">
            <View style={styles.dropdownContainer}>
              <Dropdown
                uiType="two"
                placeholder="Select role"
                value={player?.role === undefined ? null : player?.role}
                options={(isHockey
                  ? variables.playerPositionsHockey
                  : variables.playerPositions
                ).map((item, index) => {
                  return {
                    label: item,
                    value: index
                  };
                })}
                onChange={(role) =>
                  onBlurSubmit({
                    role,
                    position: [
                      role,
                      utils.getPPOS(role, player?.ppos || 0, isHockey)
                    ],
                    ppos: utils.getPPOS(role, player?.ppos || 0, isHockey)
                  })
                }
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
                value={player?.ppos || 0}
                options={
                  isHockey
                    ? variables.positionOptionsHockey
                    : variables.positionOptions
                }
                onChange={(ppos) =>
                  onBlurSubmit({ ppos, position: [player?.role, ppos] })
                }
                preventUnselect
                disabled={getIsDisabledForPosition()}
              />
            </View>
          </InfoCell>
          <View style={commonStyles.sepparator} />
          <InfoCell title="Assigned Tag" subTitle="Tag Automatically Assigned">
            <View style={styles.dropdownContainer}>
              <Dropdown
                uiType="two"
                placeholder="Select tag"
                value={player?.tag || null}
                options={sortStringsInAscendingOrder(
                  _.uniq(
                    player?.tag
                      ? [...avaialableTags, player?.tag]
                      : avaialableTags
                  )
                ).map((tag) => {
                  return {
                    label: tag,
                    value: tag
                  };
                })}
                onChange={(tag) => onBlurSubmit({ tag: tag || null })}
              />
            </View>
          </InfoCell>
          <View style={commonStyles.sepparator} />
        </View>

        <OverlayLoader isLoading={isLoading} />
      </Card>
    );
  };

  const renderPhysicalDetails = () => {
    return (
      <Card style={commonStyles.settingsCardContainer}>
        <Text style={styles.title}>Physical Details</Text>
        <View style={commonStyles.sepparator} />
        <View>
          <InfoCell
            title="Date of Birth"
            subTitle="Enter birthdate of the player"
          >
            <DateTimePIcker
              value={
                moment(player?.birthday, 'DD/MM/YYYY').isValid()
                  ? moment(player?.birthday, 'DD/MM/YYYY').toDate()
                  : moment().toDate()
              }
              defaultValue={!!player?.birthday}
              mode="date"
              onConfirm={(date) =>
                onBlurSubmit({
                  birthday: moment(date).format('DD/MM/YYYY'),
                  age: moment().diff(date, 'years')
                })
              }
            />
          </InfoCell>
          {/*
            This lines are commented because we hide weight and height of
            the player for the time beeing... We may implement it later on
          <View style={commonStyles.sepparator} />
          <InputCell
            title="Height"
            placeholder="-- cm"
            value={height || undefined}
            onTextInput={setHeight}
            onBlur={() => onBlurSubmit({ height })}
            keyboardType="numeric"
          />
          <InputCell
            title="Weight"
            placeholder="-- kg"
            value={weight || undefined}
            onTextInput={setWeight}
            onBlur={() => onBlurSubmit({ weight })}
            keyboardType="numeric"
          /> */}
        </View>
      </Card>
    );
  };

  const renderContactDetails = () => {
    return (
      <Card style={commonStyles.settingsCardContainer}>
        <Text style={styles.title}>Contact Details</Text>
        <View style={commonStyles.sepparator} />
        <View>
          <InfoCell
            title="Starting Date"
            subTitle="Enter date this player joined the club"
          >
            <DateTimePIcker
              value={
                moment(player?.startDate, 'DD/MM/YYYY').isValid()
                  ? moment(player?.startDate, 'DD/MM/YYYY').toDate()
                  : moment().toDate()
              }
              defaultValue={!!player?.startDate}
              mode="date"
              onConfirm={(date) =>
                onBlurSubmit({ startDate: moment(date).format('DD/MM/YYYY') })
              }
            />
          </InfoCell>
          <View style={commonStyles.sepparator} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}
          >
            <View style={{ flex: 0.95 }}>
              <InputCell
                title="Email *"
                placeholder="Please enter the player's email"
                value={email}
                onTextInput={setEmail}
                onBlur={() => onBlurSubmit({ email: email.toLowerCase() })}
                keyboardType="email-address"
              />
            </View>
            <ButtonNew
              style={{
                width: 145
              }}
              mode="secondary"
              text="Send Invitation"
              onPress={() => {
                setIsLoadingInvite(true);

                API.invitePlayer({
                  email,
                  customer_name: auth.customerName,
                  first_name: name,
                  team_name: activeTeam.name
                })
                  .then((resp) => {
                    console.log('resp.data', resp.data);
                    if (resp.status === 200 && resp.data.code === '1000') {
                      Alert.alert('Email sent successfully!');
                    } else {
                      Alert.alert(resp.data.msg);
                    }
                  })
                  .catch((err) => {
                    alert(err.message);
                  })
                  .finally(() => setIsLoadingInvite(false));
              }}
              disabled={isLoadingInvite}
              isLoading={isLoadingInvite}
            />
          </View>

          <InputCell
            title="Phone Number"
            placeholder="Please enter the player's phone number"
            value={phone}
            onTextInput={setPhone}
            onBlur={() => onBlurSubmit({ phone })}
            keyboardType="phone-pad"
          />
          <InputCell
            title="Emergency Contact"
            placeholder="Please enter the player's emergency contact"
            value={contact}
            onTextInput={setContact}
            onBlur={() => onBlurSubmit({ contact })}
          />
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView extraScrollHeight={100} style={styles.container}>
        <ScrollView
          style={{
            paddingHorizontal: 100,
            paddingTop: 31
          }}
        >
          <Pressable onPress={close} style={styles.closeButton}>
            <AntDesign name="close" size={18} color="white" />
          </Pressable>
          {renderPlayerProfile()}

          {renderPhysicalDetails()}
          {renderContactDetails()}

          <Card
            style={StyleSheet.flatten([
              commonStyles.settingsCardContainer,
              {
                alignItems: 'center'
              }
            ])}
          >
            <ButtonNew
              text={player?.deleted ? 'Deleted' : 'Delete Player Profile'}
              mode="secondary"
              onPress={() => {
                Alert.alert(
                  'Delete Player',
                  'Are you sure you want to delete this player?',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel'
                    },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: onDeletePlayer
                    }
                  ]
                );
              }}
              disabled={player?.deleted}
            />
          </Card>
        </ScrollView>
      </KeyboardAwareScrollView>
      {isSaved && <AlertTooltip text="Changes saved!" />}
    </View>
  );
};

export default EditPlayerInfo;

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 2,
    height: 64,
    marginRight: 3,
    width: 64
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: variables.red,
    borderRadius: 50,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    transform: [{ translateX: 11 }],
    width: 32,
    zIndex: 2
  },
  container: {
    flex: 1,
    position: 'relative'
  },
  dropdownContainer: {
    width: variables.deviceWidth * 0.2
  },
  title: {
    fontFamily: variables.mainFontMedium,
    fontSize: 21,
    textAlign: 'left'
  }
});
