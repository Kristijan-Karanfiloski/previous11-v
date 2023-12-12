import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NetworkErrorModal from '../components/common/NetworkErrorModal';
import Activation from '../screens/Auth/Activation';
import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';
import ResetPassword from '../screens/Auth/ResetPassword';
import { AuthStackParamList } from '../types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigation = () => {
  /**
   * A root stack navigator is often used for displaying modals on top of all other content.
   * https://reactnavigation.org/docs/modal
   */
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Activation" component={Activation} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Group
        screenOptions={{
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'fade'
        }}
      >
        <Stack.Screen name="NetworkErrorModal" component={NetworkErrorModal} />
      </Stack.Group>
      {/* <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="Modal" component={ModalScreen} />
        </Stack.Group> */}
    </Stack.Navigator>
  );
};

export default AuthNavigation;
