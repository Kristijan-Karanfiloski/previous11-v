import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { selectAuth } from '../../../../redux/slices/authSlice';
import { selectFinishedGamesByPlayer } from '../../../../redux/slices/gamesSlice';
import { useAppSelector } from '../../../../redux/store';
import { variables } from '../../../../utils/mixins';
import { getWeeklyEffortData } from '../../../heleprs';

import WeeklyDashboardGraph from './components/WeeklyDashboardGraph';

const WeeklyEffortDashboard = () => {
  const navigation = useNavigation() as any;

  const auth = useAppSelector(selectAuth);
  const playerId = auth?.playerId || '';
  const games = useAppSelector((state) =>
    selectFinishedGamesByPlayer(state, playerId)
  );
  const data = getWeeklyEffortData(games, playerId);

  const currentWeek = data['0'];

  const getDate = () => {
    const [startDate, endDate] = currentWeek.name.split('-');
    const startDateFormatted = moment(startDate, 'YYYY/MM/DD').format('D MMM');
    const endDateFormatted = moment(endDate, 'YYYY/MM/DD').format('D MMM');

    return `${startDateFormatted} - ${endDateFormatted}`;
  };
  getDate();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>Weekly Effort</Text>
          <Text style={styles.date}>Total Load, {getDate()}</Text>
          <Text style={styles.load}>{currentWeek.totalWeeklyLoad}</Text>
        </View>
        <WeeklyDashboardGraph data={data} />
      </View>
      <Pressable
        onPress={() => navigation.navigate('WeeklyEffort')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          View and compare your Weekly Effort
        </Text>
      </Pressable>
    </View>
  );
};

export default WeeklyEffortDashboard;

const styles = StyleSheet.create({
  button: {
    marginLeft: 'auto'
  },
  buttonText: {
    color: variables.grey2,
    fontFamily: variables.mainFontBold
  },
  container: {
    backgroundColor: variables.realWhite,
    borderRadius: 8,
    marginBottom: 12,
    paddingBottom: 22,
    paddingHorizontal: 16,
    paddingTop: 27,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  date: {
    fontFamily: variables.mainFontLight,
    fontSize: 10,
    marginBottom: 1
  },
  load: {
    fontFamily: variables.mainFontBold,
    fontSize: 55
  },
  title: {
    fontFamily: variables.mainFontBold,
    fontSize: 18,
    marginBottom: 16
  }
});
