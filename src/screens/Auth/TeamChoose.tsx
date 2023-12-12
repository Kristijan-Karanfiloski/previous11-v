import React, { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import BackgroundImageLanding from '../../components/BackgroundImageLanding';
import OverlayLoader from '../../components/common/OverlayLoader';
import { Icon } from '../../components/icon/icon';
import API from '../../helpers/api';
import { selectAuth } from '../../redux/slices/authSlice';
import {
  getClubsAction,
  selectActiveClub,
  selectClubs,
  setActiveClub
} from '../../redux/slices/clubsSlice';
import { palette } from '../../theme';
import { variables } from '../../utils/mixins';

const TeamChoose = () => {
  const dispatch = useDispatch();
  const clubs = useSelector(selectClubs);
  const activeClub = useSelector(selectActiveClub);
  const navigation = useNavigation();
  const authData = useSelector(selectAuth);

  useEffect(() => {
    dispatch(getClubsAction());
  }, []);

  useEffect(() => {
    if (activeClub && !activeClub.onboarded) {
      navigation.navigate('OnboardingInfo');
    }
  }, [activeClub]);

  const onTeamChoose = (team: any) => {
    API.bucketCustomerEvent({
      companyId: `${authData.customerName}/club/${team.name}`,
      userId: authData.email,
      attributes: {
        email: authData.email,
        type: authData.userType
      }
    })
      .then((resp) => console.log('customer', resp.data))
      .catch((err) => console.log('customer err', err));
    dispatch(setActiveClub(team));
  };

  const renderTeamCard = (team: any, index: number) => {
    return (
      <TouchableOpacity key={index} onPress={() => onTeamChoose(team)}>
        <View style={styles.cardContainer}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row'
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              {/* eslint-disable-next-line multiline-ternary */}
              {team?.photoUrl ? null : (
                // <Avatar
                //   style={{
                //     width: 34,
                //     height: 34,
                //     borderWidth: 2,
                //   }}
                //   photoUrl={team.data.photoUrl}
                //   enableUpload={false}
                //   resizeMode="contain"
                // />
                <View style={{ width: 34, height: 34 }} />
              )}
              <Text style={styles.teamName}>{team.name}</Text>
            </View>
            <Icon
              icon="arrow_next"
              style={{
                color: 'black',
                width: 8,
                height: 12
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <BackgroundImageLanding bgImage="choose_team" />
      <Text style={styles.subTitle}>
        Welcome to the universe of Next11. Empower your team through data.
      </Text>

      <View style={styles.teamChooseContainer}>
        <Text style={styles.headings}>Pick your team to get started</Text>
        <Text
          style={[
            styles.headings,
            {
              marginTop: 9,
              color: palette.darkGrey
            }
          ]}
        >
          Teams listed here have been activated by yourself or the Next11 team.
        </Text>
        <ScrollView style={styles.scrollView}>
          <OverlayLoader isLoading={!clubs} color="#000" isOverlay={false} />

          {clubs &&
            clubs.map((item, index) => {
              return renderTeamCard(item, index);
            })}
        </ScrollView>

        <Text style={styles.helpText}>Having trouble?</Text>
        <Text style={[styles.headings, { color: palette.darkGrey }]}>
          Contact us <Text style={{ color: palette.orange }}>here</Text> and
          we’ll help you get up and running with the Next11 Tracking System.
        </Text>
      </View>
    </View>
  );
};

export default TeamChoose;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: palette.realWhite,
    borderRadius: 12,
    elevation: 10,
    flex: 1,
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 29,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.54,
    shadowRadius: 6.27
  },
  container: {
    alignItems: 'center',
    backgroundColor: variables.white,
    flex: 1,
    padding: 120,
    paddingHorizontal: 152
  },
  headings: {
    fontFamily: variables.mainFont,
    fontSize: 14,
    lineHeight: 16.94
  },
  helpText: {
    fontFamily: variables.mainFontBold,
    fontSize: 16,
    lineHeight: 20.42,
    marginBottom: 5
  },
  scrollView: {
    marginBottom: 21,
    marginTop: 41,
    paddingHorizontal: 5,
    paddingTop: 7
  },
  subTitle: {
    color: palette.realWhite,
    fontFamily: variables.mainFont,
    fontSize: 16,
    lineHeight: 17,
    marginBottom: 67,
    textAlign: 'center',
    width: 294
  },
  teamChooseContainer: {
    backgroundColor: palette.realWhite,
    borderRadius: 4,
    flex: 1,
    height: 600,
    padding: 35,
    width: '100%'
  },
  teamName: {
    color: palette.black2,
    fontFamily: variables.mainFontMedium,
    fontSize: 14,
    lineHeight: 18,
    marginLeft: 10
  }
});
