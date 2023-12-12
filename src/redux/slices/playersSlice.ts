import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

import { Player } from '../../../types';
import { playerConverter } from '../../converters/player';
import API from '../../helpers/api';
// import {
//   getClub,
//   getPlayers,
//   updatePlayer
// } from '../../helpers/firestoreService';
import * as firestoreService from '../../helpers/firestoreService';

import { selectAuth } from './authSlice';
import { selectActiveClub } from './clubsSlice';

export const getPlayersAction = createAsyncThunk(
  'players/fetchPlayers',
  async (_, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const auth = selectAuth(state);
      const activeTeam = selectActiveClub(state);
      const clubRef = (await firestoreService.getClub(auth.customerName)).doc(
        activeTeam.id
      );
      const players = await firestoreService.getPlayers(clubRef);

      return players.docs.map((snapshot) =>
        playerConverter.fromFirestore(snapshot.data())
      );
    } catch (e) {
      return thunkApi.rejectWithValue(e);
    }
  }
);

export const updatePlayerAction: any = createAsyncThunk(
  'players/updatePlayerAction',
  async (player: Player, thunkApi) => {
    const state = thunkApi.getState();
    const auth = selectAuth(state);
    const activeTeam = selectActiveClub(state);
    const clubRef = (await firestoreService.getClub(auth.customerName)).doc(
      activeTeam.id
    );
    firestoreService.updatePlayer(clubRef, player);

    thunkApi.dispatch(updatePlayer(player));
  }
);

export const addPlayerAction: any = createAsyncThunk(
  'players/addPlayerAction',
  async (player: Player, thunkApi) => {
    const state = thunkApi.getState();
    const auth = selectAuth(state);
    const activeTeam = selectActiveClub(state);
    const clubRef = (await firestoreService.getClub(auth.customerName)).doc(
      activeTeam.id
    );
    const newPlayer = firestoreService.addPlayer(clubRef, player);

    thunkApi.dispatch(
      addPlayer({
        ...player,
        id: newPlayer.id
      })
    );
    if (player.email) {
      await API.invitePlayer({
        email: player.email,
        customer_name: auth.customerName,
        first_name: player.name,
        team_name: activeTeam.name
      });
    }
    return newPlayer.id;
  }
);

const playersAdapter = createEntityAdapter<Player>({
  selectId: (player) => player.id
  // sortComparer: (a, b) =>
  //   formatDateTime(a.) > formatDateTime(b.date) ? 1 : -1
});

type InitialState = {
  isFetching: boolean;
  error: null | string;
  fetched: boolean;
};

export const playersSlice = createSlice({
  name: 'players',
  initialState: playersAdapter.getInitialState({
    isFetching: false,
    error: null,
    fetched: false
  } as InitialState),
  reducers: {
    addPlayer: playersAdapter.addOne,
    updatePlayer: (state, action: PayloadAction<Player>) => {
      playersAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload
      });
    },
    removePlayer: playersAdapter.removeOne,
    addPlayers: playersAdapter.addMany
  },
  extraReducers: (builder) => {
    builder.addCase(getPlayersAction.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(getPlayersAction.fulfilled, (state, action: any) => {
      state.isFetching = false;
      state.fetched = true;

      playersAdapter.setAll(state, action.payload as Player[]);
    });
    builder.addCase(getPlayersAction.rejected, (state, action) => {
      state.isFetching = false;
      state.fetched = true;
      state.error = action.error.message || null;
    });
    /// ///
  }
});

export const { addPlayer, addPlayers, removePlayer, updatePlayer } =
  playersSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`

export const playersSelector = playersAdapter.getSelectors(
  (state: any) => state.players
);
export const selectPlayersState = (state: any) => state.players;

export const selectAllPlayers = (state: any) =>
  playersSelector.selectAll(state).filter((p: Player) => !p.deleted);

export const selectPlayerById = (state: any, id: string) =>
  playersSelector.selectById(state, id);

export const selectSomePlayers = (
  state: any,
  playerIds: string[]
): Player[] => {
  return playerIds
    .filter((id) => selectPlayerById(state, id))
    .map((id) => selectPlayerById(state, id)) as Player[];
};

export default playersSlice.reducer;
