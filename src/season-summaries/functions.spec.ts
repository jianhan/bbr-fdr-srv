import { createMapByYear, extractOverall, extractAndSetProps, setUrlByYear } from './functions';
import { Map } from 'immutable';
import { SeasonSummaryMap } from './types';
import * as funcs from '../functions';
import { identity } from 'lodash/fp';
import * as fs from 'fs';
import * as path from 'path';
import { Overall } from './schemas/overall';

describe('test functions', () => {
  describe('test createMapByYear', () => {
    it('should set year to be min year when doc is null', () => {
      const actual = createMapByYear(2000, 2020)(null) as SeasonSummaryMap;
      expect(actual.get('year')).toBe(2000);
    });

    it('should set year to be next year if next year is less than current year', () => {
      const actual = createMapByYear(2000, 2020)({ year: 2001 }) as SeasonSummaryMap;
      expect(actual.get('year')).toBe(2002);
    });

    it('should set year to be current year if next year is greater than current year', () => {
      const actual = createMapByYear(2000, 2020)({ year: 2020 }) as SeasonSummaryMap;
      expect(actual.get('year')).toBe(2020);
    });

    it('should set year to be current year if next year is equal to current year', () => {
      const actual = createMapByYear(2000, 2020)({ year: 2019 }) as SeasonSummaryMap;
      expect(actual.get('year')).toBe(2020);
    });
  });
  describe('test setUrlByYear', () => {
    it('it should set url by year', () => {
      const year = 1800;
      const inputMap = Map({ year }) as SeasonSummaryMap;

      const actual = setUrlByYear('http://test.com')(inputMap);
      expect(actual.get('url')).not.toBeNull();
      expect(actual.get('url')).not.toBeUndefined();
      expect(actual.get('url')).toBe(`http://test.com/leagues/NBA_${year}.html`);
    });
  });

  describe('test extractAndSetProps', () => {
    it('should throw when property validation fail', (done) => {
      const errMsg = `Property html is required in in map`;
      const inputMap = Map() as SeasonSummaryMap;

      jest.spyOn(funcs, 'propIsValidOrThrow').mockImplementation((key: string) => (data) => {
        throw new Error(errMsg);
      });

      extractAndSetProps((v) => v)(inputMap).subscribe(
        identity,
        (err) => {
          expect(err.message).toEqual(errMsg);
          done();
        },
        identity,
      );
    });

    it('should call the functions in pipe to extract and set properties', () => {
      const inputMap = Map() as SeasonSummaryMap;
      const mockedFunc = jest.fn(identity);
      jest.spyOn(funcs, 'propIsValidOrThrow').mockImplementation((key: string) => (data) => {
        return data;
      });
      extractAndSetProps(mockedFunc)(inputMap).subscribe(identity, identity, identity);
      expect(mockedFunc).toBeCalled();
    });
  });

  describe('test extractAndSetOverall', () => {
    let yearsWithHtml;
    beforeEach(() => {
      yearsWithHtml = [2000, 2010, 2020].map((year: number, index: number) => {
        const html = fs.readFileSync(path.join(__dirname, '__tests__', `summary_${year}.html`)).toString();
        const expected: Overall = JSON.parse(fs.readFileSync(path.join(__dirname, '__tests__', `summary_overall_${year}.json`)).toString());
        return { year, html, expected };
      });
    });
    it('should extract all attributes', () => {
      yearsWithHtml.forEach((v) => {
        const summaryMap: SeasonSummaryMap = Map();
        const actual = extractOverall(summaryMap.set('year', v.year).set('html', v.html));
        expect(actual.get('year')).toEqual(v.year);
        expect(actual.get('overall')).toEqual(v.expected);
      });
    });

    it('should validate overall if it is invalid', () => {});
  });
});
