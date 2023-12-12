import { IntensityZones } from './';

export interface GeneralStat {
  amount: number;
  distance: number;
}

export interface StatsWrapper {
  startTimeStamp: number;
  stats: Stats;
}

export interface LiveIntensityStat {
  color: string;
  liveIntensity: number;
}

interface PlayerLoadSerie {
  timestamp: number;
  value: number;
}

export interface StatsWrapperNew {
  duration?: number;
  intensityZones: IntensityZones;
  liveIntensity: {
    color: string;
    liveIntensity: number;
  };
  playerLoad: {
    load: number;
    series: PlayerLoadSerie[];
    total: number;
    pMinute: number;
  };
  actions: IntensityZones;
}

export interface Drills {
  duration: number;
  startTimestamp: number;
  endTimestamp: number;
  intensityZones: IntensityZones;
  liveIntensity: LiveIntensityStat;
  playerLoad: {
    load: number;
    series: PlayerLoadSerie[];
    total: number;
  };
}

export interface BasicStatsNew {
  fullSession: StatsWrapperNew;
  drills: Record<string, Drills>;
}

export interface ActionStatNew {
  time: number;
  length: number;
}

export interface TimeOnIce {
  avg: number;
  max: number;
  min: number;
  total: number;
  series: { end: number; start: number }[];
}

export interface StatsNew {
  duration?: number;
  movements?: {
    explosive?: ActionStatNew[];
    veryHigh?: ActionStatNew[];
  };
  intensityZones: IntensityZones;
  liveIntensity: {
    color: string;
    liveIntensity: number;
  };
  playerLoad: {
    load: number;
    series: PlayerLoadSerie[];
    total: number;
    pMinute: number;
  };
  actions: IntensityZones;
  timeOnIce?: TimeOnIce;
}

export interface BasicPlayerStatsNew {
  drills: Record<string, Drills>;
  fullSession: StatsNew;
}
export interface StatsDataNew {
  // The actually stat data
  team: BasicStatsNew;
  // Converted 90 mins stat data
  players: Record<string, BasicPlayerStatsNew>;
}

export interface GameReport {
  timeStamp: number;
  stats: StatsDataNew;
}

export interface BestMatchTeamStat {
  id?: string;
  intensity: number;
  fullSession: StatsWrapperNew;
}

export interface BestMatchPlayerStat {
  id?: string;
  intensity: number;
  fullSession: StatsNew;
}
export interface BestMatchStats {
  team: BestMatchTeamStat;
  players: Record<string, BestMatchPlayerStat>;
}

export type WeeklyOverview = {
  load: number;
  explosive: number;
  veryHigh: number;
  high: number;
  date: any;
  indicator: number | string | null;
}[];
