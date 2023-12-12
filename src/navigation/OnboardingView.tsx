import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BasicOnboarding from '../components/Onboarding/screens/BasicOnboarding';
import FinishedInvitePlayersScreen from '../components/Onboarding/screens/FinishedInvitePlayersScreen';
import FinishedRecurringEvent from '../components/Onboarding/screens/FinishedRecurringEvent';
import OnboardingEvents from '../components/Onboarding/screens/OnboardingEvents';
import OnboardInvitePlayers from '../components/Onboarding/screens/OnboardInvitePlayers';
import StepOnboarding from '../components/Onboarding/screens/StepOnboarding';
import CustomerChoose from '../screens/Auth/CustomerChoose';
import TeamChoose from '../screens/Auth/TeamChoose';
import CreateEventModal from '../screens/EventScreens/CreateEventModal';
import EventDetailsModal from '../screens/EventScreens/EventDetailsModal';
import { OnboardingStackParamList } from '../types';

interface OnboardingViewProps {
  initialRouteName?: keyof OnboardingStackParamList;
}

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const OnboardingView = ({
  initialRouteName = 'TeamChoose'
}: OnboardingViewProps) => {
  return (
    <OnboardingStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false
      }}
    >
      <OnboardingStack.Screen
        name="CustomerChoose"
        component={CustomerChoose}
      />
      <OnboardingStack.Screen name="TeamChoose" component={TeamChoose} />
      <OnboardingStack.Screen
        name="OnboardingInfo"
        component={BasicOnboarding}
      />
      <OnboardingStack.Screen
        name="OnboardingSteps"
        component={StepOnboarding}
      />
      <OnboardingStack.Screen
        name="OnboardingEvents"
        component={OnboardingEvents}
      />
      <OnboardingStack.Screen
        name="FinishedRecurringScreen"
        component={FinishedRecurringEvent}
      />
      <OnboardingStack.Screen
        name="OnboardInvitePlayers"
        component={OnboardInvitePlayers}
      />
      <OnboardingStack.Screen
        name="FinishedInvitePlayersScreen"
        component={FinishedInvitePlayersScreen}
      />
      <OnboardingStack.Group
        screenOptions={{
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'fade'
        }}
      >
        <OnboardingStack.Screen
          name="CreateEventModal"
          component={CreateEventModal}
        />
        <OnboardingStack.Screen
          name="EventDetailsModal"
          component={EventDetailsModal}
        />
      </OnboardingStack.Group>
    </OnboardingStack.Navigator>
  );
};

export default OnboardingView;
