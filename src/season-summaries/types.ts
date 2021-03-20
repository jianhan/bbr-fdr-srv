import { Map } from 'immutable';
import { TeamPerGame } from './schemas/team-per-game';
import { GameStat } from './schemas/game-stat';
import { SeasonSummary } from './schemas/season-summary.schema';

export type SeasonSummaryMap = Map<keyof SeasonSummary, any>;

export type TeamPerGameStat = TeamPerGame & GameStat;

