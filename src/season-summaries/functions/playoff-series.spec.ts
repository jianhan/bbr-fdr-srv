import * as fs from 'fs';
import * as path from 'path';
import { generateSeries } from './playoff-series';
import { range } from 'ramda';
import { Maybe } from 'ramda-fantasy';

describe('test playoff series functions', () => {
  describe('test extractPlayoffSeries function', () => {
    it('should extract and set playoff series', async () => {
      range(2010, 2020).map((year) => {
        const expectedJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '../__tests__', `playoff_series_${year}.json`)).toString());
        const html = fs.readFileSync(path.join(__dirname, '../__tests__', `summary_${year}.html`)).toString();
        const actual = generateSeries(html);

        expect(Maybe.isJust(actual)).toBe(true);
        actual.map((v) => {
          expect(v).toStrictEqual(expectedJSON);
        });
      });
    });

    it('should return nothing when table can not be found', async () => {
      const html = fs.readFileSync(path.join(__dirname, '../__tests__', `summary_2021.html`)).toString();
      const actual = generateSeries(html);

      expect(Maybe.isNothing(actual)).toBe(true);
    });
  });
});
