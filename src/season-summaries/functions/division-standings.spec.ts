import * as fs from 'fs';
import * as path from 'path';
import { extractDivisionStandings } from './division-standings';
import { range } from 'ramda';

describe('test division standing functions', () => {
  describe('test extractDivisionStandings', () => {
    it('should contain conference information', () => {
      range(2000, 2021).forEach((v, i) => {
        const html = fs.readFileSync(path.join(__dirname, '../__tests__', `summary_${v}.html`)).toString();
        const actual = extractDivisionStandings(html);
        const expected = JSON.parse(fs.readFileSync(path.join(__dirname, '../__tests__', `division_standings_${v}.json`)).toString());
        expect(actual).toEqual(expected);
      });
    });
  });
});
