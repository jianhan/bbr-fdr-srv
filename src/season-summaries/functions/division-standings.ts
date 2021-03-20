import { isNaN, eq, cond, identity } from 'lodash/fp';
import * as cheerio from 'cheerio';
import {
  cheerioLoadHtml,
  mergeObjs,
  createLinkObj,
  createObjWithKey,
  first,
  forkThenJoin,
  isNotNull,
  matchesInBrackets,
  selectChildren,
} from '../../functions';
import { ifElse, pipe, complement, head, propEq, always, assoc, pickAll } from 'ramda';

const setRoot = ($: cheerio.Root) => assoc('$', $, {});
const isDivisionRowTag = (row) => row.name === 'tr' && row.attribs['class'] === 'thead';
const isDataRow = (trNode) => trNode.name === 'tr' && trNode.attribs['class'] === 'full_table';
const getPrevTr = (element) => element.prev('tr');
const findDivision = pipe(
  getPrevTr,
  cond([
    [propEq('length', 0), always(null)],
    [pipe(head, isDivisionRowTag), (row) => row.text()],
    [pipe(head, isDataRow), (row) => findDivision(row)],
  ]),
);
const extractTeamLink = pipe(selectChildren('a'), ifElse(propEq('length', 0), always(null), pipe(first, createLinkObj)));
const hasRank = (trElement) => matchesInBrackets(trElement.text()).length > 0;
const extractRank = pipe(matchesInBrackets, head, Number.parseInt, ifElse(isNaN, always(null), identity));
const extractIsPlayoffTeam = (trElement) => trElement.text().includes('*');
const createTeamObj = pipe(extractTeamLink, ifElse(isNotNull, createObjWithKey('teamName'), identity));
const createRankObj = ifElse(hasRank, pipe(extractRank, ifElse(isNotNull, createObjWithKey('rank'), identity)), always({}));
const createIsPlayoffObj = ifElse(
  complement(hasRank),
  pipe(extractIsPlayoffTeam, ifElse(isNotNull, createObjWithKey('isPlayoffTeam'), identity)),
  always({}),
);
const getRowText = (trElement) => trElement.text();
const extractNumber = (key: string, parseFunc = Number.parseInt) =>
  pipe(getRowText, parseFunc, ifElse(isNaN, always({ [key]: null }), createObjWithKey(key)));
const dataStatEq = (v: string) => (tr) => eq(tr.attr('data-stat'), v);
const extractByDataStat = ($) => (accumulated, current) => {
  const obj = cond([
    [dataStatEq('team_name'), pipe(forkThenJoin(mergeObjs, createTeamObj, createRankObj, createIsPlayoffObj))],
    [dataStatEq('wins'), extractNumber('wins')],
    [dataStatEq('losses'), extractNumber('losses')],
    [dataStatEq('win_loss_pct'), extractNumber('winLossPercentage', Number.parseFloat)],
    [dataStatEq('gb'), extractNumber('gamesBehind', Number.parseFloat)],
    [dataStatEq('pts_per_g'), extractNumber('pointsPerGame ', Number.parseFloat)],
    [dataStatEq('opp_pts_per_g'), extractNumber('opponentPointsPerGame', Number.parseFloat)],
    [dataStatEq('srs'), extractNumber('simpleRatingSystem', Number.parseFloat)],
    [always(true), always({})],
  ])($(current));

  return mergeObjs(accumulated, obj);
};
const extractTeamStatus = ($) => (i, row) =>
  $(row)
    .children('td[data-stat],th[data-stat]')
    .toArray()
    .reduce(extractByDataStat($), { division: findDivision($(row)) });

const extractConference = (id: string, prop: string) => (obj) => {
  const $ = obj['$'];
  const conference = $(`#${id}`).children('tbody').first().children('tr.full_table').map(extractTeamStatus($)).toArray();
  return mergeObjs(obj, { [prop]: conference });
};

export const extractDivisionStandings = pipe(
  cheerioLoadHtml,
  setRoot,
  extractConference('divs_standings_E', 'easternConference'),
  extractConference('divs_standings_W', 'westernConference'),
  pickAll(['easternConference', 'westernConference']),
);
