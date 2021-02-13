import Root = cheerio.Root;
import { Link } from '../models/Link';
import { propIsValidOrThrow, stringInBrackets, unary, validOrThrow } from '../functions';
import { SeasonSummaryMap } from './types';
import { Map } from 'immutable';
import * as cheerio from 'cheerio';
import { SeasonSummaryDocument } from './schemas/season-summary.schema';
import { UpdateMapPropSync } from '../types';
import { Overall } from './schemas/overall';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { isNull, constant, pipe } from 'lodash/fp';
import { ifElse } from 'sanctuary';

const getUrlByDomainAndYear = (domainUrl: string, year: number) => `${domainUrl}/leagues/NBA_${year}.html`;

/**
 * TODO: fix the type, try not use as SeasonSummaryMap
 * @param year
 */
const initMapWithYear = (year: number): SeasonSummaryMap => Map({ year }) as SeasonSummaryMap;

const findNextYear = (currentYear: number) => (doc?: SeasonSummaryDocument): number => {
  const nextYear = doc.year + 1;
  return nextYear < currentYear ? nextYear : currentYear;
};

export const createMapByYear = (minimalYear: number, currentYear: number) =>
  ifElse(isNull)(constant(initMapWithYear(minimalYear)))(pipe([findNextYear(currentYear), initMapWithYear]));

export const setUrlByYear = (domainUrl: string) => (data: SeasonSummaryMap): SeasonSummaryMap =>
  data.set('url', getUrlByDomainAndYear(domainUrl, data.get('year') as number));

export const extractAndSetProps = (...fns: UpdateMapPropSync<SeasonSummaryMap>[]) => (summaryMap: SeasonSummaryMap) =>
  of(summaryMap).pipe(map(propIsValidOrThrow('html')), map(pipe(fns)));

export const extractAndSetOverall: UpdateMapPropSync<SeasonSummaryMap> = (summaryMap: SeasonSummaryMap): SeasonSummaryMap => {
  const overall: Overall = { apgLeader: undefined, ppgLeader: undefined, rpgLeader: undefined, wsLeader: undefined };
  const $ = cheerio.load(summaryMap.get('html') as string);
  [
    { attribute: 'leagueChampion', selector: 'League Champion' },
    { attribute: 'mostValuablePlayer', selector: 'Most Valuable Player' },
    { attribute: 'rookieOfTheYear', selector: 'Rookie of the Year' },
    { attribute: 'ppgLeader', selector: 'PPG Leader' },
    { attribute: 'rpgLeader', selector: 'RPG Leader' },
    { attribute: 'apgLeader', selector: 'APG Leader' },
    { attribute: 'wsLeader', selector: 'WS Leader' },
  ].forEach((v) => {
    const segment = extractOverallSegment($, v.selector);
    if (segment !== null) {
      overall[v.attribute] = segment;
    }
  });
  validOrThrow(overall);
  return summaryMap.set('overall', overall);
};

export const extractOverallSegment = ($: Root, selector: string): Link | null => {
  const element = $(`strong:contains('${selector}')`).next('a').first();
  if (element.length === 1) {
    return {
      title: element.text(),
      href: element.attr('href'),
      data: stringInBrackets(element.parent().text()),
    };
  }

  return null;
};

export const extractAndSetConferenceStandings: UpdateMapPropSync<SeasonSummaryMap> = (summaryMap: SeasonSummaryMap): SeasonSummaryMap => {
  const $ = cheerio.load(summaryMap.get('html') as string);
  const eastern = $('#all_confs_standings_E');
  if (eastern.length === 1) {
  }
  console.log(eastern.length, summaryMap.get('year'));
  return summaryMap;
  // const $ = cheerio.load(summaryMap.get('html') as string);
};

export const checkYearExists = unary(propIsValidOrThrow('year'));

export const checkUrlExists = unary(propIsValidOrThrow('url'));
