import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice
} from '@reduxjs/toolkit';
import _ from 'lodash';
import moment from 'moment';

import { GameAny, GameReport, GameType, StatsDataNew } from '../../../types';
import { gameConverter } from '../../converters/game';
import * as firestoreService from '../../helpers/firestoreService';
import {
  calculateBenchmarkForEvent,
  calculateBestMatch,
  isDateInCurrentWeek,
  recalculateBenchmark
} from '../../utils';
import { utils } from '../../utils/mixins';

import { selectAuth } from './authSlice';
import { selectActiveClub, updateActiveClubAction } from './clubsSlice';

export const getReportsAction = createAsyncThunk(
  'games/fetchReports',
  async (_, thunkApi) => {
    const state = thunkApi.getState();
    const auth = selectAuth(state);
    const games = selectAllGames(state);
    const activeTeam = selectActiveClub(state);
    const clubRef = (await firestoreService.getClub(auth.customerName)).doc(
      activeTeam.id
    );

    // Use the filter and map methods to get game reports directly
    const gameReportsPromises = games
      .filter((game) => game?.status?.isFinal && game.preparation)
      .map((game) => firestoreService.getGameReport(clubRef, game.id));

    const reports = await Promise.all(gameReportsPromises);

    return reports
      .filter(({ exists }) => exists)
      .map((report) => ({
        id: report.ref.parent.parent?.id,
        report: {
          stats: report.data() as StatsDataNew
        } as GameReport
      }));
  }
);

export const getGamesAction = createAsyncThunk(
  'games/fetchGamesAction',
  async (_, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const auth = selectAuth(state);
      const activeTeam = selectActiveClub(state);
      const clubRef = (await firestoreService.getClub(auth.customerName)).doc(
        activeTeam.id
      );
      const games = (await firestoreService.getGames(clubRef)) as GameAny[];
      return games.map(gameConverter.fromFirestore);
    } catch (e) {
      return thunkApi.rejectWithValue(e);
    }
  }
);

export const createBatchTrainingGamesAction = createAsyncThunk(
  'games/createBatchTrainingGamesAction',
  async (events: GameAny[], thunkApi) => {
    const state = thunkApi.getState();
    const auth = selectAuth(state);

    const activeTeam = selectActiveClub(state);
    const clubRef = (await firestoreService.getClub(auth.customerName)).doc(
      activeTeam.id
    );

    const games = firestoreService.batchCreateGames(clubRef, events);

    const gamesWithBenchmark = games.map((fullGame) => {
      const trainingBenchmark = calculateBenchmarkForEvent(fullGame, [
        ...gamesSelector.selectAll(state).filter((e) => e.id !== fullGame.id),
        fullGame
      ]);

      return {
        ...fullGame,
        benchmark: _.omit(
          { ...trainingBenchmark[0], ...fullGame.benchmark },
          'id'
        )
      };
    });

    firestoreService.batchUpdateGames(clubRef, gamesWithBenchmark);
    thunkApi.dispatch(addGames(gamesWithBenchmark));

    return gamesWithBenchmark;
  }
);

export const createGameAction = createAsyncThunk(
  'games/createGameAction',
  async (event: GameAny, thunkApi) => {
    const state = thunkApi.getState();
    const auth = selectAuth(state);

    const activeTeam = selectActiveClub(state);
    const clubRef = (await firestoreService.getClub(auth.customerName)).doc(
      activeTeam.id
    );
    const game = firestoreService.createGame(clubRef, event);

    let fullGame: GameAny = {
      ...event,
      id: game.id
    };
    if (event.type === GameType.Training) {
      const trainingBenchmark = calculateBenchmarkForEvent(fullGame, [
        ...gamesSelector.selectAll(state).filter((e) => e.id !== fullGame.id),
        fullGame
      ]);

      fullGame = {
        ...fullGame,
        benchmark: _.omit({ ...trainingBenchmark[0], ...event.benchmark }, 'id')
      };
      firestoreService.updateGame(clubRef, fullGame);
    } else {
      const startDate = moment(fullGame.date)
        .subtract(14, 'days')
        .format('YYYY/MM/DD');
      const endDate = moment(fullGame.date)
        .add(14, 'days')
        .format('YYYY/MM/DD');

      const gamesInRange = selectGamesWithinDateRange(
        state,
        startDate,
        endDate,
        GameType.Training
      ).filter(
        (game) =>
          !game.status?.isFinal &&
          !game.report &&
          !game.benchmark?.manualIndicator
      );

      const trainingBenchmarks = calculateBenchmarkForEvent(gamesInRange, [
        ...gamesSelector.selectAll(state).filter((e) => e.id !== fullGame.id),
        fullGame
      ]);

      const eventsToUpdate: any = trainingBenchmarks
        .filter((benchmark) => benchmark.id)
        .map((benchmark) => {
          if (!benchmark.id) return null;
          const event = selectGameById(state, benchmark.id);
          if (event && event.benchmark?.indicator !== benchmark.indicator) {
            delete benchmark.id;
            return {
              ...event,
              benchmark
            };
          }
          return null;
        })
        .filter(Boolean);

      thunkApi.dispatch(batchUpdateGamesAction(eventsToUpdate));
    }

    thunkApi.dispatch(addGame(fullGame));

    return fullGame;
  }
);

export const updateGameAction = createAsyncThunk(
  'games/updateGameAction',
  async (event: GameAny & { replaceReport?: boolean }, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const auth = selectAuth(state);
      const activeTeam = selectActiveClub(state);
      const games = selectAllGames(state);
      const clubRef = (await firestoreService.getClub(auth.customerName)).doc(
        activeTeam.id
      );
      const fullEvent = gamesSelector.selectById(state, event.id);
      const shouldReplaceReport = event.replaceReport;
      delete event.replaceReport;

      let fullGame = {
        ...fullEvent,
        ...event
      };
      firestoreService.updateGame(clubRef, event);

      if (fullEvent?.report && fullEvent.type === GameType.Training) {
        const prevIndicator = fullEvent.benchmark?.indicator;
        const newIndicator = event.benchmark?.indicator;
        const eventsToUpdate = [];

        eventsToUpdate.push(
          ...recalculateBenchmark(event, [
            ...games.filter((e) => e.id !== fullGame.id),
            fullGame
          ])
        );

        if (prevIndicator !== newIndicator) {
          eventsToUpdate.push(
            ...recalculateBenchmark(fullEvent, [
              ...games.filter((e) => e.id !== fullGame.id),
              fullGame
            ])
          );

          const trainingBenchmark = calculateBenchmarkForEvent(fullGame, [
            ...gamesSelector
              .selectAll(state)
              .filter((e) => e.id !== fullGame.id)
          ]);

          fullGame = {
            ...fullGame,
            benchmark: _.omit(trainingBenchmark[0], 'id')
          };
        }
        firestoreService.updateGame(clubRef, fullGame);
        thunkApi.dispatch(batchUpdateGamesAction(eventsToUpdate));
      }

      if (event.report) {
        firestoreService.uploadReportData(
          clubRef.collection('games').doc(event.id),
          event.report,
          shouldReplaceReport
        );

        if (event.type === GameType.Training) {
          const eventsToUpdate = recalculateBenchmark(event, [
            ...games.filter((e) => e.id !== fullGame.id),
            fullGame
          ]);

          thunkApi.dispatch(batchUpdateGamesAction(eventsToUpdate));
        } else {
          const bestMatchData = calculateBestMatch(
            [fullGame],
            activeTeam.bestMatch
          );

          firestoreService.updateClub(clubRef, {
            bestMatch: bestMatchData
          });
          thunkApi.dispatch(
            updateActiveClubAction({ bestMatch: bestMatchData })
          );
        }
      }
      // Recalculate benchmark for training event if there is no report.

      if (
        fullGame.type === GameType.Training &&
        !fullGame.report
        // fullEvent?.date !== event.date
        // !fullEvent?.benchmark?.manualIndicator
      ) {
        const trainingBenchmark = calculateBenchmarkForEvent(fullGame, [
          ...gamesSelector.selectAll(state).filter((e) => e.id !== fullGame.id),
          fullGame
        ]);

        fullGame = {
          ...fullGame,
          benchmark: _.omit(trainingBenchmark[0], 'id')
        };

        firestoreService.updateGame(clubRef, fullGame);
      }

      if (fullGame.type === GameType.Match) {
        // Update events categorization
        const startDate = moment(event.date)
          .subtract(14, 'days')
          .format('YYYY/MM/DD');
        const endDate = moment(event.date).add(14, 'days').format('YYYY/MM/DD');

        const gamesInRange = selectGamesWithinDateRange(
          state,
          startDate,
          endDate,
          GameType.Training
        ).filter((game) => {
          return (
            !game.status?.isFinal &&
            !game.report &&
            !game.benchmark?.manualIndicator
          );
        });

        const trainingBenchmarks = calculateBenchmarkForEvent(gamesInRange, [
          ...gamesSelector.selectAll(state).filter((e) => e.id !== event.id),
          fullGame
        ]);

        const eventsToUpdate: any = trainingBenchmarks
          .filter((benchmark) => benchmark.id)
          .map((benchmark) => {
            if (!benchmark.id) return null;
            const event = selectGameById(state, benchmark.id);
            if (event && event.benchmark?.indicator !== benchmark.indicator) {
              delete benchmark.id;
              return {
                ...event,
                benchmark
              };
            }
            return null;
          })
          .filter(Boolean);

        thunkApi.dispatch(batchUpdateGamesAction(eventsToUpdate));
      }

      thunkApi.dispatch(
        updateGame({
          id: event.id,
          changes: _.omit(fullGame, ['id', 'activeDrill'])
        })
      );
      return fullGame;
    } catch (e) {
      console.log('[ACTION ERROR]', e);
      return thunkApi.rejectWithValue(e);
    }
  }
);

export const deleteGameAction = createAsyncThunk(
  'games/deleteGameAction',
  async (event: GameAny, thunkApi) => {
    const state = thunkApi.getState();
    const auth = selectAuth(state);
    const activeTeam = selectActiveClub(state);
    const games = selectAllGames(state);
    const clubRef = (await firestoreService.getClub(auth.customerName)).doc(
      activeTeam.id
    );
    firestoreService.deleteGame(clubRef, event);

    if (event.status?.isFinal) {
      if (event.type === GameType.Training) {
        const eventsToUpdate = recalculateBenchmark(
          event,
          games.filter((e) => e.id !== event.id)
        );
        thunkApi.dispatch(batchUpdateGamesAction(eventsToUpdate));
      } else {
        const bestMatchData: any = calculateBestMatch(
          games.filter((e) => e.id !== event.id)
        );
        firestoreService.updateClub(clubRef, {
          bestMatch: bestMatchData
        });
        thunkApi.dispatch(updateActiveClubAction({ bestMatch: bestMatchData }));
      }
    }

    if (event.type === GameType.Match) {
      // Update events categorization
      const startDate = moment(event.date)
        .subtract(14, 'days')
        .format('YYYY/MM/DD');
      const endDate = moment(event.date).add(14, 'days').format('YYYY/MM/DD');

      const gamesInRange = selectGamesWithinDateRange(
        state,
        startDate,
        endDate,
        GameType.Training
      ).filter(
        (game) =>
          !game.status?.isFinal &&
          !game.report &&
          !game.benchmark?.manualIndicator
      );

      const trainingBenchmarks = calculateBenchmarkForEvent(gamesInRange, [
        ...gamesSelector.selectAll(state).filter((e) => e.id !== event.id)
      ]);

      const eventsToUpdate: any = trainingBenchmarks
        .filter((benchmark) => benchmark.id)
        .map((benchmark) => {
          if (!benchmark.id) return null;
          const event = selectGameById(state, benchmark.id);
          if (event && event.benchmark?.indicator !== benchmark.indicator) {
            delete benchmark.id;
            return {
              ...event,
              benchmark
            };
          }
          return null;
        })
        .filter(Boolean);

      thunkApi.dispatch(batchUpdateGamesAction(eventsToUpdate));
    }

    thunkApi.dispatch(removeGame(event.id));
  }
);

export const deleteBatchTrainingGamesAction = createAsyncThunk(
  'games/deleteBatchTrainingGamesAction',
  async (events: GameAny[], thunkApi) => {
    const state = thunkApi.getState();
    const auth = selectAuth(state);
    const activeTeam = selectActiveClub(state);
    const games = selectAllGames(state);
    const clubRef = (await firestoreService.getClub(auth.customerName)).doc(
      activeTeam.id
    );
    firestoreService.batchDeleteGames(clubRef, events);

    for (const event of events) {
      if (event.status?.isFinal) {
        if (event.type === GameType.Training) {
          const eventsToUpdate = recalculateBenchmark(
            event,
            games.filter((e) => e.id !== event.id)
          );
          thunkApi.dispatch(batchUpdateGamesAction(eventsToUpdate));
        } else {
          const bestMatchData: any = calculateBestMatch(
            games.filter((e) => e.id !== event.id)
          );
          firestoreService.updateClub(clubRef, {
            bestMatch: bestMatchData
          });
          thunkApi.dispatch(
            updateActiveClubAction({ bestMatch: bestMatchData })
          );
        }
      }
    }

    thunkApi.dispatch(removeGames([...events].map((e) => e.id)));
  }
);

export const batchUpdateGamesAction = createAsyncThunk(
  'games/batchUpdateGamesAction',
  async (events: GameAny[], thunkApi) => {
    const state = thunkApi.getState();
    const auth = selectAuth(state);
    const activeTeam = selectActiveClub(state);
    const clubRef = (await firestoreService.getClub(auth.customerName)).doc(
      activeTeam.id
    );
    firestoreService.batchUpdateGames(clubRef, events);

    thunkApi.dispatch(
      updateGames(
        [...events].map((e) => ({
          id: e.id,
          changes: _.omit(e, ['id', 'activeDrill'])
        }))
      )
    );
  }
);

const gamesAdapter = createEntityAdapter<GameAny>({
  selectId: (game) => game.id,
  sortComparer: (a, b) =>
    moment(
      utils.checkAndFormatUtcDate(a.UTCdate, a.date, a.startTime).date,
      utils.checkAndFormatUtcDate(a.UTCdate, a.date, a.startTime).dateFormat
    ).isAfter(
      moment(
        utils.checkAndFormatUtcDate(b.UTCdate, b.date, b.startTime).date,
        utils.checkAndFormatUtcDate(a.UTCdate, a.date, a.startTime).dateFormat
      )
    )
      ? 1
      : -1
});

type InitialState = {
  isFetching: boolean;
  error: null | string;
  fetched: boolean;
};

export const gamesSlice = createSlice({
  name: 'games',
  initialState: gamesAdapter.getInitialState({
    isFetching: false,
    error: null,
    fetched: false
  } as InitialState),
  reducers: {
    addGame: gamesAdapter.addOne,
    updateGame: gamesAdapter.updateOne,
    removeGame: gamesAdapter.removeOne,
    removeGames: gamesAdapter.removeMany,
    addGames: gamesAdapter.addMany,
    updateGames: gamesAdapter.updateMany
  },
  extraReducers: (builder) => {
    builder.addCase(getGamesAction.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(getGamesAction.fulfilled, (state, action) => {
      state.isFetching = false;
      state.fetched = true;

      gamesAdapter.setAll(state, action.payload as GameAny[]);
    });
    builder.addCase(getGamesAction.rejected, (state, action) => {
      state.isFetching = false;
      state.fetched = true;
      state.error = action.error.message || null;
    });
    builder.addCase(getReportsAction.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(getReportsAction.fulfilled, (state, action) => {
      state.isFetching = false;
      state.fetched = true;
      // gamesAdapter.setAll(state, action.payload as GameAny[]);
      const reports = action.payload as { id: string; report: GameReport }[];
      gamesAdapter.updateMany(
        state,
        reports.map((reportItem) => {
          return {
            id: reportItem.id,
            changes: {
              report: reportItem.report
            }
          };
        })
      );
    });
    builder.addCase(getReportsAction.rejected, (state, action) => {
      state.isFetching = false;
      state.fetched = true;
      state.error = action.error.message || null;
    });
  }
});

export const {
  addGame,
  addGames,
  removeGame,
  removeGames,
  updateGame,
  updateGames
} = gamesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`

export const gamesSelector = gamesAdapter.getSelectors(
  (state: any) => state.games
);
export const selectGamesState = (state: any) => state.games;

export const selectAllGames = (state: any) => gamesSelector.selectAll(state);

export const selectAllFinishedGamesByType = (state: any, type?: GameType) =>
  selectAllGames(state).filter(
    (game) =>
      game.status?.isFinal &&
      game.preparation &&
      game.report &&
      (!type || game.type === type)
  );

export const selectCurrentWeekGames = (state: any) =>
  selectAllGames(state).filter((game) => isDateInCurrentWeek(game.date));

export const selectScheduledGames = (state: any) =>
  selectAllGames(state).filter(
    (game) => !game.status?.isFinal && !game.report && game.preparation
  );

const selectLastFinishedGame = (allGames: GameAny[], type: GameType) => {
  for (let i = allGames.length - 1; i >= 0; i--) {
    const game = allGames[i];
    const isPastEvent = moment(new Date()).isSameOrAfter(
      moment(game.date, 'YYYY/MM/DD')
    );
    const isTraining = game.type === type;
    const isFinal = game.status?.isFinal;
    const hasPreparation = game.preparation;
    if (isPastEvent && isTraining && isFinal && hasPreparation) {
      return game;
    }
  }
  return null;
};

export const selectLastFinishedMatch = (state: any) => {
  const allGames = selectAllGames(state);
  return selectLastFinishedGame(allGames, GameType.Match);
};

export const selectLastFinishedTraining = (state: any) => {
  const allGames = selectAllGames(state);
  return selectLastFinishedGame(allGames, GameType.Training);
};

export const selectGameById = (state: any, id: string) =>
  gamesSelector.selectById(state, id);

export const selectGamesWithinDateRange = (
  state: any,
  startDate: string,
  endDate: string,
  type?: GameType
) => {
  const games = selectAllGames(state);
  const startMoment = moment(startDate, 'YYYY/MM/DD');
  const endMoment = moment(endDate, 'YYYY/MM/DD');

  const filteredGames = games.filter((game) => {
    const gameMoment = moment(game.date, 'YYYY/MM/DD');
    return (
      gameMoment.isSameOrAfter(startMoment) &&
      gameMoment.isSameOrBefore(endMoment) &&
      (!type || game.type === type)
    );
  });

  return filteredGames;
};

export const selectGamesWithinDateRangePlayerApp = (
  state: any,
  startDate: string,
  endDate: string,
  id: string,
  type?: GameType
) => {
  const games = selectFinishedGamesByPlayer(state, id);
  const startMoment = moment(startDate, 'YYYY/MM/DD');
  const endMoment = moment(endDate, 'YYYY/MM/DD');

  const filteredGames = games.filter((game) => {
    const gameMoment = moment(game.date, 'YYYY/MM/DD');
    return (
      gameMoment.isSameOrAfter(startMoment) &&
      gameMoment.isSameOrBefore(endMoment) &&
      (!type || game.type === type)
    );
  });

  return filteredGames;
};

export const selectFinishedGamesByPlayer = (state: any, id?: string) => {
  return selectAllGames(state).filter(({ status, report }) => {
    return (
      id &&
      status &&
      status.isFinal &&
      !!report?.stats?.players &&
      !!report?.stats?.players[id] &&
      report?.stats?.players[id]?.fullSession.playerLoad.total > 5
    );
  });
};

export default gamesSlice.reducer;
