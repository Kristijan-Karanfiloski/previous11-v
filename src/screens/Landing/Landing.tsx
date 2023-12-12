import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import moment from 'moment';

import Banner from '../../components/common/banner';
import ConnectionButton from '../../components/common/ConnectionButton';
import { Icon } from '../../components/icon/icon';
import UpcomingEvent from '../../components/UpcomingEvent';
import ApiQueue from '../../helpers/apiQueue';
import { weeklyLoadData } from '../../helpers/chartHelpers';
import { logoutUser, selectAuth } from '../../redux/slices/authSlice';
import { selectGamesWithinDateRange } from '../../redux/slices/gamesSlice';
import { selectAllPlayers } from '../../redux/slices/playersSlice';
import { needSync } from '../../redux/slices/syncSlice';
import store, { useAppDispatch, useAppSelector } from '../../redux/store';
import { color } from '../../theme';
import { variables } from '../../utils/mixins';

import BottomStatsData from './components/BottomStatsData';
import WeeklyChartContainer from './components/WeeklyChartContainer';
import WeeklyHeaderInfo from './components/WeeklyHeaderInfo';

export default function Landing(props: any) {
  const dispatch = useAppDispatch();
  const showSync = useAppSelector(needSync);
  const { customerName } = useAppSelector(selectAuth);
  const isLoggedIn = auth().currentUser;
  const { trySendQueueRequest } = ApiQueue();
  const allPlayers = useAppSelector(selectAllPlayers);

  useEffect(() => {
    if (showSync && isLoggedIn) {
      props.navigation.navigate('SyncModal');
    }
    if (!isLoggedIn) {
      dispatch(logoutUser());
    }
  }, []);

  const weekEvents = selectGamesWithinDateRange(
    store.getState(),
    moment().clone().startOf('isoWeek').format('YYYY/MM/DD'),
    moment().clone().endOf('isoWeek').format('YYYY/MM/DD')
  );

  const { totalLoad, headerData } = weeklyLoadData(weekEvents, allPlayers);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Banner style={styles.banner} image>
        <View style={styles.bannerContent}>
          <View style={styles.bannerTopContent}>
            <Pressable
              onPress={() => {
                trySendQueueRequest('open_drawer').then((res) =>
                  console.log('res', res)
                );

                props.navigation.openDrawer();
              }}
            >
              <Icon icon="hamburger" />
            </Pressable>
            <View style={styles.bannerButtons}>
              <ConnectionButton />
            </View>
          </View>
          <View style={styles.headingContent}>
            <View>
              <Text style={styles.headingText}>{customerName}</Text>
              <Text style={styles.dateText}>
                {moment().format('dddd, DD MMMM YYYY')}
              </Text>
            </View>
            <UpcomingEvent />
          </View>
        </View>
      </Banner>
      <View style={styles.mainContainer}>
        <WeeklyHeaderInfo
          totalLoadData={totalLoad}
          totalTimeData={headerData.trainingTime + headerData.matchTime}
        />
        <ScrollView>
          <WeeklyChartContainer />
          <BottomStatsData />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: color.palette.darkGreyish,
    height: 235,
    resizeMode: 'cover',
    width: '100%'
  },
  bannerButtons: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  bannerContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 14,
    paddingBottom: 56,
    paddingTop: 32
  },
  bannerTopContent: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  container: {
    backgroundColor: variables.white,
    flex: 1
  },
  dateText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 14
  },
  headingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headingText: {
    color: variables.realWhite,
    fontFamily: variables.mainFontMedium,
    fontSize: 40,
    lineHeight: 50
  },
  mainContainer: {
    flex: 1,
    marginTop: -50
  }
});
