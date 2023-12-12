import { GameAny } from '../../types';

export type PlayerStats = {
  totalLoad: number;
  lowestLoad: number;
  highestLoad: number;
  averageLoad: number;
  numberOfSameTypeEvents: number;
  lowestEvent: GameAny | null;
  highestEvent: GameAny | null;
  loadPerMin: string;
};
