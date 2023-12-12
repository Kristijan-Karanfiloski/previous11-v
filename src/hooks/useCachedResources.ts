import { useEffect, useState } from 'react';
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons';
import * as Font from 'expo-font';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          ...MaterialCommunityIcons.font,
          ...FontAwesome5.font,
          ...Feather.font,
          ...MaterialIcons.font,
          'space-mono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
          'SpaceGrotesk-Medium': require('../../assets/fonts/SpaceGrotesk-Medium.otf'),
          'SpaceGrotesk-Bold': require('../../assets/fonts/SpaceGrotesk-Bold.otf'),
          'SpaceGrotesk-Light': require('../../assets/fonts/SpaceGrotesk-Light.otf'),
          'SpaceGrotesk-Regular': require('../../assets/fonts/SpaceGrotesk-Regular.otf'),
          'SpaceGrotesk-SemiBold': require('../../assets/fonts/SpaceGrotesk-SemiBold.otf')
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        // await SplashScreen.hideAsync()
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
