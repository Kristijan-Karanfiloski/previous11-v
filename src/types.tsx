/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Moment } from 'moment';

import { GameAny, GameType } from '../types';

import { PlayerStats } from './player-app/playerAppTypes';

export type LandingStack = {
  Landing: undefined;
  LiveView: undefined;
};

export type DrawerParamList = {
  Root?: {
    screen?: keyof LandingStack;
  };
  WeeklyLoad?: undefined;
  Calendar?: {
    calendarDate?: Moment | undefined;
  };
  Settings: {
    routeName?: string;
  };
  AcuteChronic: undefined;
  Wellness: undefined;
};

export type OnboardingStackParamList = {
  TeamChoose: undefined;
  OnboardingInfo: undefined;
  OnboardingSteps: {
    recurringEvent?: string;
  };
  OnboardingEvents: undefined;
  FinishedRecurringScreen: undefined;
  OnboardInvitePlayers: undefined;
  FinishedInvitePlayersScreen: undefined;
  CreateEventModal: {
    date?: Date | undefined;
    closePrevRoute?: boolean;
  };
  EventDetailsModal: {
    event: GameAny;
    closePrevRoute?: boolean;
  };
  CustomerChoose: undefined;
};

export type DrawerStackParamList = {
  Drawer: undefined;
  NetworkErrorModal: {
    title: string;
    text: string;
  };
  SyncModal?: {
    forceSync?: boolean;
  };
  CreateEventModal: {
    date?: Date | undefined;
    closePrevRoute?: boolean;
  };
  EventDetailsModal: {
    event: GameAny;
  };
  LiveView: undefined;
  TagsOverviewModal: undefined;
  AddingTagsModal: undefined;
  EndLiveEventModal: undefined;
  Report: {
    eventId: string;
    wasPrevRouteLive?: boolean;
  };
  DrillsModal: {
    type: string;
    onSubmit?: (val: string) => void;
  };
  LostConnectionModal: {
    isStartingEvent?: boolean;
    // resentational must be used with isStartingEvent set to true
    presentational?: boolean;
  };
  MatchTypeSelector: { event: GameAny };
  IncompleteDatasetModal: {
    event: GameAny;
  };
  SessionsMenu: {
    initialDate?: string;
  };
  ResetPassword: { title?: string; email?: string };
  AcuteExplanationModal: undefined;
  RPEExplanationMoldal: undefined;
  LandingExplanationModal: undefined;
  TroubleshootingTag: { tagId: string };
  PlayersOverviewModal: {
    event: GameAny;
    onSave: (data: GameAny, cb: any) => void;
    isLive?: boolean;
    // showModalWarning: boolean;
    // showWarningModalHandler: () => void;
  };
  LoadEdgeSessionsModal: any;
  AskToLoadSessionModal: {
    date: string;
    event?: GameAny;
  };
};

export type WeeklyOverviewStackList = {
  TeamStats: undefined;
  PlayerStats: {
    playerId: string;
  };
};

export type ReportStackParamList = {
  TeamReport: {
    eventId: string;
  };
  PlayerReport: {
    playerId: string;
    eventId: string;
  };
};

export type AuthStackParamList = {
  Login: { email?: string };
  Activation: undefined;
  ResetPassword: undefined;
  Register: undefined;
  TeamChoose: undefined;
  NetworkErrorModal: { title: string; text: string };
};

export type PlayerAuthStackParamList = {
  Login: { email?: string };
  Activation: undefined;
  ResetPassword: undefined;
  Register: undefined;
  TeamChoose: undefined;
  ResetPasswordConfirmation?: undefined;
  CreateProfile: undefined;
  WebView: undefined;
};

export type PlayerMainStackParamList = {
  Root: undefined;
  TooltipModal: {
    modal:
      | 'similarTrainings'
      | 'totalLoadTraining'
      | 'totalLoadMatch'
      | 'intensity'
      | 'weeklyEffort'
      | 'acuteChronic';
  };
  FilterModal: {
    modal: 'filter';
  };
};

export type ActivitiesStackParamList = {
  Activities: undefined;
  ActivityInfo: {
    game: GameAny;
    playerStats: PlayerStats;
    prevRoute: string;
  };
  ActivitiesProgress: { game: GameAny };
  TeamEffort: { game: GameAny };
  Accute: { date: string };
};

export type ProgressStackParamList = {
  ProgressScreen: undefined;
  ActivityInfo: {
    game: GameAny;
    playerStats: PlayerStats;
    prevRoute: string;
  };
  Progress: undefined;
  WeeklyEffort: undefined;
  ActivitiesProgress: { game: GameAny };
  TeamEffort: { game: GameAny };
  Accute: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  ChangePassword: undefined;
  ChangeEmail: undefined;
};

export type LiveViewParamList = {
  TeamLive: undefined;
  PlayerLive: {
    playerId: string;
    event: GameAny;
    eventId?: string;
  };
};

export type LoadEdgeSessionsStackParamList = {
  EdgeSessionLanding: { date?: string; event?: GameAny };
  SetupEdgeSession: {
    sessionId: string;
    eventType: GameType.Match | GameType.Training;
    date?: string;
    event?: GameAny;
  };
};

export type RootStackParamList = LandingStack &
  DrawerStackParamList &
  ReportStackParamList &
  DrawerParamList &
  LiveViewParamList & {
    NotFound: undefined;
  } & OnboardingStackParamList &
  WeeklyOverviewStackList &
  PlayerMainStackParamList;

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export interface SlideInSubPageRef {
  pageClose: () => void;
}
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamList {}
  }
}

export interface WeekDayType {
  Monday: Date;
  Tuesday: Date;
  Wednesday: Date;
  Thursday: Date;
  Friday: Date;
  Saturday: Date;
  Sunday: Date;
}

export interface WeekDaySelectedType {
  Monday: boolean;
  Tuesday: boolean;
  Wednesday: boolean;
  Thursday: boolean;
  Friday: boolean;
  Saturday: boolean;
  Sunday: boolean;
}

export type OnboardingSteps = {
  id: number;
  text: string;
  isFinished: boolean;
  isNext: boolean;
}[];

export type ZoneSelector = {
  label: string;
  color: string;
  key: string;
  aboveAverageColor: string;
  sort?: number;
};

export type PrgoressFilterType = {
  allMatches: boolean;
  won: boolean;
  lost: boolean;
  tied: boolean;
  allTrainings: boolean;
  matchday: boolean;
  plusOne: boolean;
  plusTwo: boolean;
  plusThree: boolean;
  minusOne: boolean;
  minusTwo: boolean;
  minusThree: boolean;
  minusFour: boolean;
  minusFive: boolean;
  minusSix: boolean;
  minusSeven: boolean;
  minusEight: boolean;
  noCategory: boolean;
  individual: boolean;
};
