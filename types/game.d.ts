import { firebase } from '@react-native-firebase/firestore';

import { GameReport } from './report';

type StatusMatch = {
  drills: string[];
  startTimestamp: number;
  endTimestamp?: number;
  duration?: number;
  isFinal: boolean;
  isFullReport?: boolean;
  intensity?: number;
  interception?: number;
  redCardAmount?: number;
  scoreResult?: string;
  scoreThem?: string;
  scoreUs?: string;
  technical?: number;
  totalTime?: number;
  yellowCardAmount?: number;
};

type Substitutions = {
  subbed: 'in' | 'out';
  time: number;
  drillName: string | null;
};

type GamePreparation = {
  playersInPitch: string[];
  playersOnBench: string[];
  substitutions?: Record<string, Substitutions[]>;
  strategy?: string;
};

export interface IntensityZones {
  veryHigh: number;
  low: number;
  high: number;
  moderate: number;
  explosive: number;
}

type Benchmark = {
  loadPerMin: number;
  intensity: number;
  intensityZones: IntensityZones;
};

export enum GameType {
  Training = 'training',
  Match = 'match',
  training_no_benchmark = 'training_no_benchmark'
}

export enum FilterStateType {
  training = 'training',
  match = 'match',
  noBenchmark = 'noBenchmark',
  weeklyLoad = 'weeklyLoad',
  landing = 'landing'
}

type Training = GameType.Training;
type Match = GameType.Match;

export interface BenchmarkData {
  indicator: number | string;
  intensity: number;
  loadPerMin: number;
  intensityZones: IntensityZones;
  players: Record<string, Benchmark>;
  manualIndicator?: boolean;
}
type Timestamp = firebase.firestore.Timestamp;
export interface Game<T> {
  id: string;
  docId?: string;
  UTCdate?: string;
  date: typeof Timestamp;
  startTime: string;
  endTime: string;
  location: string;
  type: GameType.Training | GameType.Match;
  versus: T extends Match ? string : null;
  preparation?: GamePreparation;
  readerList?: Array<string>;
  rpe?: Record<string, any>;
  status?: StatusMatch | null; // Need to add Training Status
  benchmark?: T extends Training ? BenchmarkData : null;
  report?: GameReport | null;
  recurringEventId?: number;
  manualIndicator?: boolean;
  rpe?: Record<string, number>;
}

export interface GameAny extends Game<GameType.Match | GameType.Training> {}

export enum DrillsModalType {
  drills = 'drills',
  extraTime = 'extraTime',
  manageDrills = 'manageDrills',
  manageExtraTime = 'manageExtraTime'
}
