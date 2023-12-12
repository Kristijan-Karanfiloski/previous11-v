import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import PlayerNavigation from './navigation';

const PlayerApp = () => {
  return (
    <SafeAreaProvider onLayout={async () => await SplashScreen.hideAsync()}>
      <PlayerNavigation />
    </SafeAreaProvider>
  );
};

export default PlayerApp;
