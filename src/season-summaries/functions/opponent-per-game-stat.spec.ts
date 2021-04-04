import { identity, range } from 'ramda';
import { generateTeamPerGameStats } from './team-per-game-stats';
import * as fs from 'fs';
import * as path from 'path';
import { either } from 'sanctuary';
import { generateOpponentPerGameStats } from './opponent-per-game-stat';

describe('opponent per game stats functions', () => {
  describe('generateOpponentPerGameStats function', () => {
    it('should extract opponent per game stat', () => {
      range(2010, 2015).map((year) => {
        const actual = generateOpponentPerGameStats(fs.readFileSync(path.join(__dirname, '../__tests__', `summary_${year}.html`)).toString());

        either(identity)((v) => {
          const expected = JSON.parse(fs.readFileSync(path.join(__dirname, '../__tests__', `opponent_per_game_stats_${year}.json`)).toString());
          expect(v).toEqual(expected);
        })(actual);
      });
    });
  });
});
