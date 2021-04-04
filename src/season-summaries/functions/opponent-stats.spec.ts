import { identity, range } from 'ramda';
import * as fs from 'fs';
import * as path from 'path';
import { either } from 'sanctuary';
import { opponentOpponentStats } from './opponent-stats';

describe('opponent per game stats functions', () => {
  describe('generateOpponentPerGameStats function', () => {
    it('should extract opponent per game stat', () => {
      range(2010, 2015).map((year) => {
        const actual = opponentOpponentStats(fs.readFileSync(path.join(__dirname, '../__tests__', `summary_${year}.html`)).toString());

        either(identity)((v) => {
          const expected = JSON.parse(fs.readFileSync(path.join(__dirname, '../__tests__', `opponent_stats_${year}.json`)).toString());
          expect(v).toEqual(expected);
        })(actual);
      });
    });
  });
});
