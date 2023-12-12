import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import LogRocket from '@logrocket/react-native';
import firestore from '@react-native-firebase/firestore';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import moment from 'moment';
import { PersistGate } from 'redux-persist/integration/react';

import 'react-native-gesture-handler';

import { LiveTimerProvider } from './src/hooks/liveTimerContext';
import { SocketProvider } from './src/hooks/socketContext';
// import { APP_TYPE, FireBaseAnalytics } from './src/utils/analytics';
import useApiQueue from './src/hooks/useApiQueue';
import useCachedResources from './src/hooks/useCachedResources';
// import useColorScheme from './src/hooks/useColorScheme';
import Navigation from './src/navigation';
import PlayerApp from './src/player-app';
import store, { persistor } from './src/redux/store';
import storePlayer from './src/redux/store-player';

SplashScreen.preventAutoHideAsync();

moment.updateLocale('en', {
  week: {
    dow: 1 // Monday is the first day of the week.
  }
});
try {
  firestore().settings({ cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED });
  // firestore().enableNetwork();
} catch (e) {
  console.log('error', e);
}

if (!__DEV__) {
  LogRocket.init('usnovv/next11');
}

export default function App() {
  const isLoadingComplete = useCachedResources();
  // const colorScheme = useColorScheme();
  useApiQueue();
  // const fbAnalytics = new FireBaseAnalytics(APP_TYPE.COACH);

  // fbAnalytics.logEvent('login', {});
  if (!isLoadingComplete) {
    return null;
  } else if (
    (Platform.OS === 'ios' && !Platform.isPad) ||
    Platform.OS === 'android'
  ) {
    return (
      <Provider store={storePlayer}>
        <SafeAreaProvider>
          <PlayerApp />
        </SafeAreaProvider>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <SocketProvider>
            <LiveTimerProvider>
              <Navigation />
              <StatusBar style="auto" />
            </LiveTimerProvider>
          </SocketProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
