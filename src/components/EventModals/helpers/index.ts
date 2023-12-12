import moment from 'moment';

import { GameAny, GameType, Player } from '../../../../types';
import { categorizeTrainingEvents } from '../../../utils';
import { EventDetailsType, TRAINING_CATEGORY } from '../types';

export const defaultCategoryPicker = (indicator: 'no_category' | number) => {
  switch (indicator) {
    case -8:
      return TRAINING_CATEGORY.MD_m8;
    case -7:
      return TRAINING_CATEGORY.MD_m7;
    case -6:
      return TRAINING_CATEGORY.MD_m6;
    case -5:
      return TRAINING_CATEGORY.MD_m5;
    case -4:
      return TRAINING_CATEGORY.MD_m4;
    case -3:
      return TRAINING_CATEGORY.MD_m3;
    case -2:
      return TRAINING_CATEGORY.MD_m2;
    case -1:
      return TRAINING_CATEGORY.MD_m1;
    case 1:
      return TRAINING_CATEGORY.MD_p1;
    case 2:
      return TRAINING_CATEGORY.MD_p2;
    case 3:
      return TRAINING_CATEGORY.MD_p3;
    case 'no_category':
      return TRAINING_CATEGORY.no_category;
    default:
      return TRAINING_CATEGORY.MD;
  }
};

export const manualCategory = (indicator: string) => {
  switch (indicator) {
    case TRAINING_CATEGORY.MD_m8:
      return -8;
    case TRAINING_CATEGORY.MD_m7:
      return -7;
    case TRAINING_CATEGORY.MD_m6:
      return -6;
    case TRAINING_CATEGORY.MD_m5:
      return -5;
    case TRAINING_CATEGORY.MD_m4:
      return -4;
    case TRAINING_CATEGORY.MD_m3:
      return -3;
    case TRAINING_CATEGORY.MD_m2:
      return -2;
    case TRAINING_CATEGORY.MD_m1:
      return -1;
    case TRAINING_CATEGORY.MD_p1:
      return 1;
    case TRAINING_CATEGORY.MD_p2:
      return 2;
    case TRAINING_CATEGORY.MD_p3:
      return 3;
    case TRAINING_CATEGORY.no_category:
      return 'no_category';
    case TRAINING_CATEGORY.IT:
      return 'individual';
    default:
      return 0;
  }
};

export const getSelectedPlayers = (
  type: string,
  allPlayers: Player[],
  lastTraining: GameAny | null,
  lastMatch: GameAny | null
) => {
  const allPlayersSelected = allPlayers.reduce(
    (acc, cur) => ({ ...acc, [cur.id]: true }),
    {}
  );

  if (type === '') return allPlayersSelected;

  const hasPreparation = (game: GameAny | null) =>
    game?.preparation &&
    (game?.preparation?.playersInPitch?.length !== 0 ||
      game?.preparation?.playersOnBench?.length !== 0);

  const getPlayers = (gameType: GameType) => {
    const game = gameType === GameType.Match ? lastMatch : lastTraining;
    return {
      playersOnBench: game?.preparation?.playersOnBench || [],
      playersInPitch: game?.preparation?.playersInPitch || []
    };
  };

  const hasLastTrainingPreparation = hasPreparation(lastTraining);
  const hasLastMatchPreparation = hasPreparation(lastMatch);

  if (hasLastMatchPreparation || hasLastTrainingPreparation) {
    const { playersOnBench, playersInPitch } = getPlayers(
      type === GameType.Match ? GameType.Match : GameType.Training
    );

    const selectedPlayers = playersInPitch.reduce(
      (acc, cur) => ({ ...acc, [cur]: true }),
      {}
    );

    const unSelectedPlayers = playersOnBench.reduce(
      (acc, cur) => ({ ...acc, [cur]: false }),
      {}
    );

    const unfilteredPlayers = { ...selectedPlayers, ...unSelectedPlayers };

    const filteredPlayers = Object.fromEntries(
      Object.entries(unfilteredPlayers).filter(([cur]) =>
        allPlayers.find((player) => player.id === cur)
      )
    );

    return filteredPlayers;
  }

  return allPlayersSelected;
};

export const getDefaultTrainingCategoryOption = (
  allGames: GameAny[],
  eventDetails: EventDetailsType
) => {
  const { indicator } = categorizeTrainingEvents([
    ...allGames,
    {
      id: 'NEW',
      date: moment(eventDetails.date).format('YYYY/MM/DD'),
      type: 'training',
      startTime: '15:00'
    }
  ]).NEW;

  if (indicator === null) return 'no_category';
  return indicator;
};
