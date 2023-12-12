import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { RouteProp, useRoute } from '@react-navigation/native';

import { palette } from '../../theme';
import { DrawerParamList } from '../../types';
import { variables } from '../../utils/mixins';

import CoachInfo from './CoachInfo';
import PlayersInfo from './PlayersInfo';
import TeamInfo from './TeamInfo';

const Tab = createMaterialTopTabNavigator();

const Settings = () => {
  const route = useRoute() as RouteProp<DrawerParamList, 'Settings'>;

  const initialRouteName = route.params?.routeName || 'Personal Info';
  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        swipeEnabled: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: palette.tipGrey,
        tabBarLabelStyle: {
          fontSize: 16,
          fontFamily: variables.mainFontMedium
        },
        tabBarStyle: {
          backgroundColor: palette.grey,
          height: 62,
          justifyContent: 'center'
        },
        tabBarIndicatorStyle: {
          backgroundColor: palette.orange,
          height: 4
        }
      }}
    >
      <Tab.Screen name="Personal Info" component={CoachInfo} />
      <Tab.Screen name="Team" component={TeamInfo} />
      <Tab.Screen name="Players and Tags" component={PlayersInfo} />
    </Tab.Navigator>
  );
};

export default Settings;
