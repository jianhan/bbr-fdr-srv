import { extractOverall } from './overall';
import * as fs from 'fs';
import * as path from 'path';
import { Overall } from '../schemas/overall';

const filterResults = (results) => (year: number) => results.filter((val) => val.year === year)[0];

describe('test overall functions', () => {
  describe('test extractAndSetOverall', () => {
    let expectedResults;
    let fetchResultByYear;

    beforeEach(() => {
      expectedResults = [2000, 2010, 2020].map((year: number) => {
        const html = fs.readFileSync(path.join(__dirname, '../__tests__', `summary_${year}.html`)).toString();
        const expected: Overall = JSON.parse(fs.readFileSync(path.join(__dirname, '../__tests__', `summary_overall_${year}.json`)).toString());
        return { year, html, expected };
      });
      fetchResultByYear = filterResults(expectedResults);
    });

    it('should return empty overall if html is invalid', () => {
      const actual = extractOverall('invalid html');
      expect(actual).toEqual({});
    });

    it('should extract multiply player for rookie of the year', () => {
      const year2000 = fetchResultByYear(2000);
      const actual = extractOverall(year2000.html);
      const rookieOfTheYear = actual.rookieOfTheYear;
      expect(rookieOfTheYear).toBeInstanceOf(Array);
      expect(rookieOfTheYear).toHaveLength(2);
      const expectedRookieOfTheYear = year2000.expected.rookieOfTheYear;
      expect(rookieOfTheYear).toEqual(expectedRookieOfTheYear);
    });

    it('should extract all attributes', () => {
      expectedResults.forEach((val) => {
        const actual = extractOverall(val.html);
        expect(actual).toEqual(val.expected);
      });
    });
  });
});
