import { createMapByYear, extractAndSetProps, setUrlByYear } from './functions';
import { Map } from 'immutable';
import { SeasonSummaryMap } from './types';
import * as funcs from '../functions';
import { identity } from 'lodash/fp';

jest.mock('../functions');
const mockedPropIsValidOrThrow = <jest.Mock<typeof funcs.propIsValidOrThrow>>funcs.propIsValidOrThrow;

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

  describe('extractAndSetProps', () => {
    it('should throw when property validation fail', (done) => {
      const errMsg = `Property html is required in in map`;
      const inputMap = Map() as SeasonSummaryMap;
      mockedPropIsValidOrThrow.mockImplementation((key: string) => (data) => {
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
      // @ts-ignore
      mockedPropIsValidOrThrow.mockImplementation((key: string) => (data) => {
        return data;
      });
      extractAndSetProps(mockedFunc)(inputMap).subscribe(identity, identity, identity);
      expect(mockedFunc).toBeCalled();
    });
  });
});
