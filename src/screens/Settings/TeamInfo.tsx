import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { DrillsModalType } from '../../../types';
import AlertTooltip from '../../components/common/AlertTooltip';
import Avatar from '../../components/common/Avatar';
import ButtonNew from '../../components/common/ButtonNew';
import Card from '../../components/common/Card';
import Dropdown from '../../components/common/Dropdown';
import InfoCell from '../../components/common/InfoCell';
import InputCell from '../../components/common/InputCell';
import OverlayLoader from '../../components/common/OverlayLoader';
import TakePhoto from '../../components/common/TakePhoto';
import { clubFirestoreProps } from '../../converters';
import { uploadPhoto } from '../../helpers/firestoreService';
import {
  selectActiveClub,
  updateActiveClubAction
} from '../../redux/slices/clubsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { commonStyles } from '../../theme';
import { TEAM_AGE_OPTIONS, variables } from '../../utils/mixins';

const TeamInfo = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const activeClub = useAppSelector(selectActiveClub);

  const [nation, setNation] = useState(activeClub.nation);
  const [league, setLeague] = useState(activeClub.league);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isSaved) {
      setTimeout(() => setIsSaved(false), 3000);
    }
  }, [isSaved]);

  const onBlurSubmit = (key: keyof clubFirestoreProps, value: any) => {
    if (activeClub?.[key] === value) return;
    setIsSaved(true);
    return dispatch(updateActiveClubAction({ [key]: value as any }));
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Card style={commonStyles.settingsCardContainer}>
          <Text style={styles.title}>Team Info</Text>
          <View style={commonStyles.sepparator} />
          <InfoCell
            title="Team Logo"
            subTitle="Upload your team logo to personalize"
          >
            <TakePhoto
              onSuccess={({ uri }) => {
                setIsLoading(true);
                uploadPhoto('team', activeClub.id, uri)
                  .then((photoUrl) => onBlurSubmit('photoUrl', photoUrl))
                  .finally(() => setIsLoading(false));
              }}
            >
              <Avatar
                style={{
                  width: 64,
                  height: 64,
                  borderWidth: 2
                }}
                enableUpload
                photoUrl={activeClub.photoUrl}
              />
            </TakePhoto>
          </InfoCell>
          <InfoCell title="Team" subTitle={activeClub.name} />
          <InputCell
            placeholder="Specify the country of your team"
            title="Country"
            value={nation}
            onTextInput={setNation}
            onBlur={() => onBlurSubmit('nation', nation)}
          />

          <InputCell
            placeholder="Specify the league of your team"
            title="League"
            value={league}
            onTextInput={setLeague}
            onBlur={() => onBlurSubmit('league', league)}
          />

          <InfoCell title="Team Age" subTitle="Select age range">
            <View style={styles.dropdownContainer}>
              <Dropdown
                uiType="two"
                placeholder="Select age"
                value={activeClub.teamAge || null}
                options={TEAM_AGE_OPTIONS}
                onChange={(value) => onBlurSubmit('teamAge', value)}
                preventUnselect
              />
            </View>
          </InfoCell>

          <InfoCell
            title="Gender"
            subTitle="Select team gender to better track performances"
          >
            <View style={styles.dropdownContainer}>
              <Dropdown
                uiType="two"
                placeholder="Select event type"
                value={activeClub.gender || null}
                options={[
                  { label: 'Women', value: 'Women' },
                  { label: 'Men', value: 'Men' }
                ]}
                onChange={(value) => onBlurSubmit('gender', value)}
                preventUnselect
              />
            </View>
          </InfoCell>
        </Card>

        <Card style={commonStyles.settingsCardContainer}>
          <Text style={styles.title}>Drills</Text>
          <View style={commonStyles.sepparator} />
          <InfoCell
            title="Your Drills"
            subTitle="Specify the set of Drills for your team"
          >
            <ButtonNew
              text="Manage Drills"
              mode="secondary"
              style={{ width: 160, borderRadius: 10 }}
              textStyle={{ fontFamily: variables.mainFont, fontSize: 16 }}
              onPress={() =>
                navigation.navigate('DrillsModal', {
                  type: DrillsModalType.manageDrills
                })
              }
            />
          </InfoCell>
        </Card>

        <Card style={commonStyles.settingsCardContainer}>
          <Text style={styles.title}>Extra Time</Text>
          <View style={commonStyles.sepparator} />
          <InfoCell
            title="Your Extra Time"
            subTitle="Specify the set of Extra Time options for your team"
          >
            <ButtonNew
              text="Manage Extra Time"
              mode="secondary"
              style={{ width: 160, borderRadius: 10 }}
              textStyle={{ fontFamily: variables.mainFont, fontSize: 16 }}
              onPress={() =>
                navigation.navigate('DrillsModal', {
                  type: DrillsModalType.manageExtraTime
                })
              }
            />
          </InfoCell>
        </Card>

        <Card style={commonStyles.settingsCardContainer}>
          <Text style={styles.title}>Intensity Zones Visibility</Text>
          <View style={commonStyles.sepparator} />
          <InfoCell
            title="Moderate Intensity Work"
            subTitle="Include moderate intensity work in the app"
          >
            <View style={styles.switchToggle}>
              <Switch
                value={!activeClub.moderateIntensityDisabled}
                onValueChange={(value) =>
                  onBlurSubmit('moderateIntensityDisabled', !value)
                }
                trackColor={{ true: '#E5004D', false: '#9899A0' }}
                ios_backgroundColor="#9899A0"
              />
            </View>
          </InfoCell>
          <InfoCell
            title="Low Intensity Work"
            subTitle="Include low intensity work in the app"
          >
            <View style={styles.switchToggle}>
              <Switch
                value={!activeClub.lowIntensityDisabled}
                onValueChange={(value) =>
                  onBlurSubmit('lowIntensityDisabled', !value)
                }
                trackColor={{ true: '#E5004D', false: '#9899A0' }}
                ios_backgroundColor="#9899A0"
              />
            </View>
          </InfoCell>
        </Card>
        {/* TODO: uncomment when API is ready  */}
        {/* <Card style={commonStyles.settingsCardContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>Staff Members</Text>

            <Pressable>
              <Text style={styles.titleLink}>Add New +</Text>
            </Pressable>
          </View>
          <View style={commonStyles.sepparator} />
          <InfoCell title="Head Coach" subTitle="Invite Head Coach" />
          <InfoCell title="Assistant Coach" subTitle="Invite Assistant Coach" />
          <InfoCell title="Physical Coach" subTitle="Invite Physical Coach" />
          <InfoCell title="Other" subTitle="Invite Other" />
        </Card> */}
      </ScrollView>
      <OverlayLoader isLoading={isLoading} />
      {isSaved && <AlertTooltip text="Changes saved!" />}
    </View>
  );
};

export default TeamInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 100,
    paddingTop: 31
  },
  dropdownContainer: {
    width: variables.deviceWidth * 0.13
  },
  switchToggle: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    minWidth: 61
  },
  title: {
    fontFamily: variables.mainFontMedium,
    fontSize: 20
  }
  // titleLink: {
  //   color: variables.red,
  //   fontFamily: variables.mainFontMedium,
  //   fontSize: 17,
  //   marginLeft: 15
  // }
});
