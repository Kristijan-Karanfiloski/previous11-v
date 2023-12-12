import { GameType } from './game';

export interface APIInterface {
  code: string;
  msg: string;
  result: any;
}

export interface IActivationProps {
  email: string;
  firstName: string;
  lastName?: string;
  password: string;
}

export interface IPlayerInvitation {
  email: string;
  first_name: string;
  customer_name: string;
  team_name: string;
}

export interface ChangeEmail {
  email: string;
  newEmail: string;
}

export enum EventGender {
  male = 'male',
  female = 'female'
}
export interface RequestFullReportInterface {
  connectedPlayers: { macId: string; id: string; name: string }[];
  fullSession: { start: number; end: number };
  drills: string[];
  gameId: string;
  hockey: boolean;
  gender: EventGender;
  gameType: GameType;
  description: string;
  id_mapping?: { macId: string; id: string; name: string }[];
}

export interface Player {
  id: string;
  birthday?: any;
  photo?: any;
  photoUrl?: string | null;
  name: string;
  role: string;
  email: string;
  tag: string;
  height?: any;
  weight?: any;
  contact?: string;
  position: (string | number)[];
  ppos: number;
  startDate?: null | string;
  phone?: string;
  tShirtNumber: string | null;
  age?: number | string;
  deleted?: boolean;
}

export enum DropdownFilterKeys {
  LOAD_GOAL = 'load_goal',
  BENCHMARK = 'benchmark',
  DONT_COMPARE = 'dont_compare',
  BEST_MATCH = 'best_match',
  LAST_WEEK = 'last_week',
  LAST_4_WEEK = 'last_4_week',
  SELECTED_WEEK = 'selected_week'
}

export enum GenderType {
  Men = 'Men',
  Women = 'Women'
}

export interface TrackingEventInterface {
  event: string;
  userId: string;
  attributes?: {
    [key: string]: any;
  };
  timestamp?: number;
}

export interface TrackingCompanyInterface {
  companyId: string;
  userId: string;
  attributes?: {
    [key: string]: any;
  };
}

export interface TrackingUserInterface {
  userId: string;
  attributes?: {
    [key: string]: any;
  };
}
