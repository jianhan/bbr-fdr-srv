import { SeasonSummaryMap } from '../types';
import { Map } from 'immutable';
import { SeasonSummary } from '../schemas/season-summary.schema';
import { pipe, identity, constant, isNull } from 'lodash/fp';
import { getMapProp, inc, propIsValidOrThrow, unary } from '../../functions';
import { ifElse, lt } from 'sanctuary';
import { UpdateMapPropSync } from '../../types';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

export const getUrlByDomainAndYear = (domainUrl: string, year: number) => `${domainUrl}/leagues/NBA_${year}.html`;

export const initMapWithYear = (year: number): SeasonSummaryMap => <Map<keyof SeasonSummary, any>>Map({ year });

export const findNextYear = (currentYear: number) => pipe(getMapProp('year'), inc, ifElse(lt(currentYear))(identity)(constant(currentYear)));

export const createMapByYear = (minimalYear: number, currentYear: number) =>
  ifElse(isNull)(constant(initMapWithYear(minimalYear)))(pipe([findNextYear(currentYear), initMapWithYear]));

export const setUrlByYear = (domainUrl: string) => (data: SeasonSummaryMap): SeasonSummaryMap =>
  data.set('url', getUrlByDomainAndYear(domainUrl, data.get('year') as number));

export const extractAndSetProps = (...fns: UpdateMapPropSync<SeasonSummaryMap>[]) => (summaryMap: SeasonSummaryMap) =>
  of(summaryMap).pipe(map(propIsValidOrThrow('html')), map(pipe(fns)));

export const checkYearExists = unary(propIsValidOrThrow('year'));

export const checkUrlExists = unary(propIsValidOrThrow('url'));
