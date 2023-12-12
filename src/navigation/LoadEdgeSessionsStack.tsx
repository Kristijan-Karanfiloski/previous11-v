import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EdgeSessionLanding from '../components/EdgeSessionLoader/EdgeSessionLanding';
import SetupEdgeSession from '../components/EdgeSessionLoader/SetupEdgeSession';
import { LoadEdgeSessionsStackParamList } from '../types';

export const Stack =
  createNativeStackNavigator<LoadEdgeSessionsStackParamList>();

interface LoadEdgeSessionsStackProps {}

const LoadEdgeSessionsStack = (props: LoadEdgeSessionsStackProps) => {
  /**
   * A root stack navigator is often used for displaying modals on top of all other content.
   * https://reactnavigation.org/docs/modal
   */

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        contentStyle: { backgroundColor: 'transparent' }
      }}
    >
      <Stack.Screen name="EdgeSessionLanding" component={EdgeSessionLanding} />
      <Stack.Screen name="SetupEdgeSession" component={SetupEdgeSession} />
    </Stack.Navigator>
  );
};

export default LoadEdgeSessionsStack;
