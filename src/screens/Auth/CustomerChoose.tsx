import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import BackgroundImageLanding from '../../components/BackgroundImageLanding';
import OverlayLoader from '../../components/common/OverlayLoader';
import { Icon } from '../../components/icon/icon';
import { getAdminClubs } from '../../helpers/firestoreService';
import { authUser, selectAuth } from '../../redux/slices/authSlice';
import { removeActiveClub } from '../../redux/slices/clubsSlice';
import { palette } from '../../theme';
import { variables } from '../../utils/mixins';

const CustomerChoose = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const authData = useSelector(selectAuth);
  const [customers, setCustomers] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    getAdminClubs().then((clubs: string[]) => {
      if (clubs && clubs.length > 0) {
        setCustomers(clubs);
      }
      dispatch(removeActiveClub());
    });
  }, []);

  const searchQuery = useMemo(() => {
    return customers.filter((item) =>
      item.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, customers]);

  const onCustomerChoose = (team: any) => {
    dispatch(authUser({ ...authData, customerName: team }));
    navigation.navigate('TeamChoose');
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const renderTeamCard = (team: any, index: number) => {
    return (
      <TouchableOpacity key={index} onPress={() => onCustomerChoose(team)}>
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
              <Text style={styles.teamName}>{team}</Text>
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
        <Text style={styles.headings}>Pick your customer to get started</Text>
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
        <TextInput
          style={styles.input}
          placeholder="Search..."
          value={searchText}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />

        <ScrollView style={styles.scrollView}>
          <OverlayLoader
            isLoading={!customers.length}
            color="#000"
            isOverlay={false}
          />

          {searchQuery &&
            searchQuery.map((item, index) => {
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

export default CustomerChoose;

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
  input: {
    borderColor: variables.greyD9,
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    marginTop: 16,
    paddingHorizontal: 10
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
