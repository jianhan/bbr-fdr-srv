import { generateTeamPerGameStats } from './team-per-game-stats';
import { identity, range } from 'ramda';
import * as fs from 'fs';
import * as path from 'path';
import { either } from 'sanctuary';
import { generateTeamStats } from './team-stats';

describe('team stats functions', () => {
  describe('generateTeamStats function', () => {
    it('should extract team stat', () => {
      range(2010, 2015).map((year) => {
        const actual = generateTeamStats(fs.readFileSync(path.join(__dirname, '../__tests__', `summary_${year}.html`)).toString());

        either(identity)((v) => {
          const expected = JSON.parse(fs.readFileSync(path.join(__dirname, '../__tests__', `team_stats_${year}.json`)).toString());
          expect(v).toEqual(expected);
        })(actual);
      });
    });
  });
});
