import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import LogRocket from '@logrocket/react-native';
import {
  AnyAction,
  combineReducers,
  configureStore,
  createListenerMiddleware,
  isAnyOf
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { PersistConfig, persistReducer, persistStore } from 'redux-persist';

import authSlice, { selectAuth, updateUser } from './slices/authSlice';
import clubsSlice, { setActiveClub } from './slices/clubsSlice';
import configSlice from './slices/configSlice';
import deviceReducer from './slices/deviceSlice';
import filterSlice from './slices/filterSlice';
import gamesSlice, {
  getGamesAction,
  getReportsAction
} from './slices/gamesSlice';
import onlineTagsSlice from './slices/onlineTagsSlice';
import playersSlice, {
  getPlayersAction,
  selectAllPlayers
} from './slices/playersSlice';
import progressFilterSlice from './slices/progressFilter';
import syncSlice from './slices/syncSlice';
import userProfileSlice from './slices/userProfileSlice';
import persistStorage from './storage';

const PERSIST_KEY = 'persist:root_4';

const persistConfig: PersistConfig<any, any, any, any> = {
  key: PERSIST_KEY,
  storage: persistStorage(),
  blacklist: [filterSlice.name, onlineTagsSlice.name, progressFilterSlice.name]
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
  [filterSlice.name]: filterSlice.reducer,
  progressFilter: progressFilterSlice.reducer
});

const rootReducer = (state: any, action: AnyAction) => {
  if (action.type === 'auth/logoutUser') {
    persistStorage().removeItem(PERSIST_KEY);
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
      // listenerApi.dispatch(getConfigAction());
      listenerApi.dispatch(getPlayersAction());
    }
    if (action.type === getGamesAction.fulfilled.type) {
      listenerApi.dispatch(getReportsAction());
    }

    if (action.type === getPlayersAction.fulfilled.type) {
      const state = listenerApi.getState();
      const auth = selectAuth(state);
      const players = selectAllPlayers(state);
      const player = players.find(
        (player) => player.email.toLowerCase() === auth.email.toLowerCase()
      );
      if (player) {
        listenerApi.dispatch(updateUser({ playerId: player.id }));
      }
    }
    // if (action.type === getReportsAction.fulfilled.type) {
    //   listenerApi.dispatch(setSyncTime());
    // }
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
