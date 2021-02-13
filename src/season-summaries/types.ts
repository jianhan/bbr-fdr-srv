import { Map } from 'immutable';
import { TeamPerGame } from './schemas/team-per-game';
import { GameStat } from './schemas/game-stat';
import { SeasonSummary } from './schemas/season-summary.schema';
import { Overall } from './schemas/overall';

export type SeasonSummaryMap = Map<keyof SeasonSummary, any>;

export type OverallMap = Map<keyof Overall, any>;

export type TeamPerGameStat = TeamPerGame & GameStat;

export type DivisionName =
  | 'atlanticDivision'
  | 'northwestDivision'
  | 'centralDivision'
  | 'pacificDivision'
  | 'southeastDivision'
  | 'southwestDivision';
