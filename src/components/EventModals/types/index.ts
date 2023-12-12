import { GameType } from '../../../../types';

export const MODAL_HEADING = {
  new_event: 'New Event',
  event_details: 'Event Details',
  choose_players: 'Choose Players'
};

export const MODAL_HEADING_LEGEND = {
  number_of_players: 'number_of_players',
  include_exclude: 'include_exclude'
};

export type EventDetailsType = {
  type: string;
  date: Date;
  time: Date;
  category: string;
  repeat: string;
  location: string;
  opponent: string;
  repeatDate: Date;
};

export const REPEAT_EVENT_OPTION = {
  never: 'Never',
  day: 'Every Day',
  week: 'Every Week',
  two_week: 'Every 2 Weeks',
  month: 'Every Month'
};

export const TRAINING_CATEGORY = {
  MD_m8: 'Matchday -8',
  MD_m7: 'Matchday -7',
  MD_m6: 'Matchday -6',
  MD_m5: 'Matchday -5',
  MD_m4: 'Matchday -4',
  MD_m3: 'Matchday -3',
  MD_m2: 'Matchday -2',
  MD_m1: 'Matchday -1',
  MD: 'Matchday',
  MD_p1: 'Matchday +1',
  MD_p2: 'Matchday +2',
  MD_p3: 'Matchday +3',
  no_category: 'No Category',
  IT: 'Individual Training'
};

export const LocationOptions = [
  { label: 'Home', value: 'home' },
  { label: 'Away', value: 'away' }
];

export const TypeOptions = [
  { label: 'Match', value: GameType.Match },
  { label: 'Training', value: GameType.Training }
];

export const RepeatOptions = Object.values(REPEAT_EVENT_OPTION).map(
  (opt: string) => {
    return { label: opt, value: opt };
  }
);

export const TrainingCategory = Object.values(TRAINING_CATEGORY).map(
  (cat: string) => {
    return { label: cat, value: cat };
  }
);
