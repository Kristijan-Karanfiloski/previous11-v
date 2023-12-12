import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { clubFirestoreProps } from '../../../converters';
import {
  selectActiveClub,
  updateActiveClubAction
} from '../../../redux/slices/clubsSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { palette } from '../../../theme';
import { TEAM_AGE_OPTIONS, variables } from '../../../utils/mixins';
import Dropdown from '../../common/Dropdown';
import { Icon } from '../../icon/icon';

const OnboardingBaseSettings = () => {
  const dispatch = useAppDispatch();
  const club = useAppSelector(selectActiveClub);

  const onBlurSubmit = (key: keyof clubFirestoreProps, value: any) => {
    return dispatch(updateActiveClubAction({ [key]: value as any }));
  };

  return (
    <View style={styles.mainContainer}>
      <Icon
        icon="logo"
        style={{
          width: 180,
          height: 180
        }}
      />
      <Text style={styles.subTitle}>
        Welcome to the universe of Next11. Empower your team through data.
      </Text>
      <View style={styles.settingsMainContainer}>
        <Text style={styles.headings}>{club.name}</Text>
        <View style={styles.borderContainer} />
        <View style={[styles.settingsContainer, { marginBottom: 30 }]}>
          <Text style={styles.settingsHeading}>Team Info</Text>
          <Text style={[styles.settingsHeading, styles.settingsText]}>
            Please select the age and gender of your team for the most accurate
            results.
          </Text>
        </View>

        <View style={styles.settingsContainer}>
          <Text style={styles.settingsHeading}>Team Age</Text>
          <View style={styles.settingContainer}>
            <Text style={[styles.settingsHeading, styles.settingsText]}>
              Select age range
            </Text>
            <Dropdown
              uiType="two"
              placeholder="Select"
              value={club.teamAge || null}
              options={TEAM_AGE_OPTIONS}
              onChange={(value) => onBlurSubmit('teamAge', value)}
              preventUnselect
              containerStyle={{ width: 104 }}
            />
          </View>
        </View>

        <View style={styles.borderContainer} />

        <View style={styles.settingsContainer}>
          <Text style={styles.settingsHeading}>Team Gender</Text>
          <View style={styles.settingContainer}>
            <Text style={[styles.settingsHeading, styles.settingsText]}>
              Specify team gender
            </Text>
            <Dropdown
              uiType="two"
              placeholder="Select"
              value={club.gender || null}
              options={[
                { label: 'Women', value: 'Women' },
                { label: 'Men', value: 'Men' }
              ]}
              onChange={(value) => onBlurSubmit('gender', value)}
              preventUnselect
              containerStyle={{ width: 104 }}
            />
          </View>
        </View>

        <View style={styles.borderContainer} />
      </View>
    </View>
  );
};

export default OnboardingBaseSettings;

const styles = StyleSheet.create({
  borderContainer: {
    borderColor: variables.lightestGrey,
    borderWidth: 0.6,
    marginBottom: 25,
    marginTop: 15,
    width: '90%'
  },
  headings: {
    fontFamily: variables.mainFont,
    fontSize: 16,
    lineHeight: 16.94
  },
  mainContainer: {
    alignItems: 'center',
    width: '100%'
  },
  settingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  settingsContainer: {
    width: '90%'
  },
  settingsHeading: {
    color: variables.black,
    fontFamily: variables.mainFont,
    fontSize: 14
  },
  settingsMainContainer: {
    alignItems: 'center',
    backgroundColor: palette.realWhite,
    borderRadius: 4,
    padding: 35,
    width: 420
  },

  settingsText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont
  },
  subTitle: {
    color: palette.realWhite,
    fontFamily: variables.mainFont,
    fontSize: 16,
    lineHeight: 17,
    marginBottom: 67,
    textAlign: 'center',
    width: 294
  }
});
