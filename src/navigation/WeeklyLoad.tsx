import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WeeklySinglePlayerStats from '../components/WeeklyLoad/StatsScreens/WeeklySinglePlayerStats';
import WeeklyLoadScreen from '../screens/WeeklyLoadScreen';
import { WeeklyOverviewStackList } from '../types';

const WeeklyOverviewStack =
  createNativeStackNavigator<WeeklyOverviewStackList>();

const WeeklyLoad = () => {
  return (
    <WeeklyOverviewStack.Navigator
      initialRouteName="TeamStats"
      screenOptions={{
        headerShown: false
      }}
    >
      <WeeklyOverviewStack.Screen
        name="TeamStats"
        component={WeeklyLoadScreen}
      />
      <WeeklyOverviewStack.Screen
        name="PlayerStats"
        component={WeeklySinglePlayerStats}
      />
    </WeeklyOverviewStack.Navigator>
  );
};

export default WeeklyLoad;
