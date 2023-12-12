import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import LogRocket from '@logrocket/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AnyAction,
  combineReducers,
  configureStore,
  createListenerMiddleware,
  isAnyOf
} from '@reduxjs/toolkit';
import * as ImageManipulator from 'expo-image-manipulator';
import logger from 'redux-logger';
import { PersistConfig, persistReducer, persistStore } from 'redux-persist';

import { GameType } from '../../types';
import { calculateBestMatch } from '../utils';
import { utils } from '../utils/mixins';

import authSlice from './slices/authSlice';
import clubsSlice, {
  setActiveClub,
  updateActiveClubAction
} from './slices/clubsSlice';
import configSlice, { getConfigAction } from './slices/configSlice';
import currentWeek from './slices/currentWeek';
import deviceReducer from './slices/deviceSlice';
import filterSlice from './slices/filterSlice';
import gamesSlice, {
  getGamesAction,
  getReportsAction,
  selectAllFinishedGamesByType
} from './slices/gamesSlice';
import onlineTagsSlice from './slices/onlineTagsSlice';
import playersSlice, { getPlayersAction } from './slices/playersSlice';
import syncSlice, { setSyncTime } from './slices/syncSlice';
import trackingEvent from './slices/trackingEventSlice';
import userProfileSlice from './slices/userProfileSlice';
import persistStorage from './storage';

const PERSIST_KEY = 'persist:root_4';

const persistConfig: PersistConfig<any, any, any, any> = {
  key: PERSIST_KEY,
  storage: persistStorage(),
  blacklist: [filterSlice.name, onlineTagsSlice.name, currentWeek.name]
};

const appReducer = combineReducers({
  device: deviceReducer,
  auth: authSlice,
  userProfile: userProfileSlice,
  clubs: clubsSlice,
  games: gamesSlice,
  players: playersSlice,
  config: configSlice,
  sync: syncSlice,
  onlineTags: onlineTagsSlice,
  [trackingEvent.name]: trackingEvent.reducer,
  [filterSlice.name]: filterSlice.reducer,
  [currentWeek.name]: currentWeek.reducer
});

const rootReducer = (state: any, action: AnyAction) => {
  if (action.type === 'auth/logoutUser') {
    AsyncStorage.removeItem(PERSIST_KEY);
    removeImageKeys();

    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  matcher: isAnyOf(
    setActiveClub,
    getGamesAction as any,
    getReportsAction
  ) as any,
  effect: async (action: any, listenerApi) => {
    if (action.type === setActiveClub.type) {
      listenerApi.dispatch(getGamesAction());
      listenerApi.dispatch(getConfigAction());
      listenerApi.dispatch(getPlayersAction());
    }

    if (action.type === getGamesAction.fulfilled.type) {
      listenerApi.dispatch(getReportsAction());
    }

    if (action.type === getReportsAction.fulfilled.type) {
      const matches = selectAllFinishedGamesByType(
        store.getState(),
        GameType.Match
      );

      const bestMatch = calculateBestMatch(matches || []);

      if (bestMatch) {
        listenerApi.dispatch(updateActiveClubAction({ bestMatch }));
      }
      // Serialize the Redux store to a string
      const storeString = JSON.stringify(store.getState());
      // Regular expression to match all URLs containing "firebasestorage"
      const urlRegex = /https?:\/\/[^ "]*firebasestorage[^ "]*\.[^ "]+/g;
      // Extract all matching URLs
      const matchedUrls = storeString.match(urlRegex) || [];
      // Retrieve all keys that start with 'images/' from AsyncStorage
      const savedImgUrlsKeys = await AsyncStorage.getAllKeys();
      const savedImgUrls = savedImgUrlsKeys.filter((key) =>
        key.startsWith('images/')
      );

      // Filter out the URLs that have already been saved
      const urlsToProcess = matchedUrls.filter((url) => {
        // Construct the key from the URL, similar to how you save them
        const potentialKey = 'images/' + utils.encodeBase64(url);
        // Only include URLs that do not have a corresponding saved key
        return !savedImgUrls.includes(potentialKey);
      });
      if (urlsToProcess.length > 0) {
        processAllUrls(urlsToProcess);
      }

      listenerApi.dispatch(setSyncTime());
    } else if (action.type === getReportsAction.rejected.type) {
      alert('Error');
      listenerApi.dispatch(setSyncTime());
    }
  }
});

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      // },
      immutableCheck: false,
      serializableCheck: false
    }).prepend(listenerMiddleware.middleware);
    if (!__DEV__) {
      return defaultMiddleware.concat(LogRocket.reduxMiddleware());
    }
    return defaultMiddleware.concat(logger);
  }
});

export default store;
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

async function processUrl(url: string) {
  const key = utils.encodeBase64(url);
  const response = await fetch(url);
  const blob = await response.blob();
  const base64Url: any = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => {
      // Reject with an Error object
      reject(new Error('FileReader error'));
    };
  });

  if (!base64Url) return;
  const resizedImage = await ImageManipulator.manipulateAsync(
    base64Url,
    [{ resize: { width: 600 } }],
    {
      compress: 0.5,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true
    }
  );

  await AsyncStorage.setItem(`images/${key}`, resizedImage.base64 || '');
}

async function processAllUrls(matchedUrls: string[]) {
  const promises = matchedUrls.map((url) =>
    processUrl(url).catch((e) => {
      console.error(`Error processing URL ${url}:`, e);
      // Handle any errors for individual URLs here, such as setting a default value
      return null; // Return null or a default value if there's an error
    })
  );

  // Wait for all the promises to settle
  await Promise.all(promises);
  console.log('All URLs processed');
}

const removeImageKeys = async () => {
  try {
    // Get all keys in AsyncStorage
    const allKeys = await AsyncStorage.getAllKeys();

    // Filter keys that start with 'images/'
    const imageKeys = allKeys.filter((key) => key.startsWith('images/'));

    // Use multiRemove to remove all keys that match
    await AsyncStorage.multiRemove(imageKeys);

    console.log('All image keys removed');
  } catch (e) {
    console.error('Error removing image keys', e);
  }
};
