import { ifElse, pipe, propEq, map, reduce, cond, partial, append, always, identity, nth, invoker, split, head } from 'ramda';
import { trimChars } from 'lodash/fp';
import {
  cheerioToArray,
  createLinkObj,
  findBy,
  forkThenJoin,
  toJust,
  matchesInBrackets,
  mergeObjs,
  toNothing,
  selectChildrenBy,
  selectByRoot,
  selectWithRoot,
  createObjWithKey,
} from '../../functions';

import * as cheerio from 'cheerio';
import Root = cheerio.Root;
import Cheerio = cheerio.Cheerio;
import { PlayoffSerieGame } from '../schemas/playoff-serie-game';

const createGameLink = ({ $, current }: { $: Root; current: cheerio.Element }) => {
  const firstLink = $(current).children('a').first();
  return firstLink.length === 1 ? createLinkObj(firstLink) : {};
};
const createGameDate = ({ $, current }: { $: Root; current: cheerio.Element }) => ({ date: $(current).text() });
const createAwayTeam = ({ $, current }: { $: Root; current: cheerio.Element }) => ({ awayTeam: $(current).text() });
const createAwayTeamPoints = ({ $, current }: { $: Root; current: cheerio.Element }) => ({ awayTeamPoints: parseInt($(current).text(), 10) });
const createHomeTeam = ({ $, current }: { $: Root; current: cheerio.Element }) => ({
  homeTeam: pipe(trimChars(' '), trimChars('@'))($(current).text()),
});
const createHomeTeamPoints = ({ $, current }: { $: Root; current: cheerio.Element }) => ({ homeTeamPoints: parseInt($(current).text(), 10) });
const indexEq = partial(propEq, ['index']);
const createGamePropByIndex = cond([
  [indexEq(0), createGameLink],
  [indexEq(1), createGameDate],
  [indexEq(2), createAwayTeam],
  [indexEq(3), createAwayTeamPoints],
  [indexEq(4), createHomeTeam],
  [indexEq(5), createHomeTeamPoints],
]);
const gameTdReducer = ($: Root) => (accumulated, current, index) =>
  Object.assign(
    {},
    accumulated,
    createGamePropByIndex({
      $,
      index,
      current,
    }),
  );
const gamesReducer = ($: Root) => (accumulatedGames: PlayoffSerieGame[], current: cheerio.Element) => {
  const obj = $(current).children('td').toArray().reduce(gameTdReducer($), {});

  return append(obj, accumulatedGames);
};
const selectGameRows = findBy('td:first-child > div:first-child > table:first-child > tbody:first-child > tr');
const rowToGames = ($: Root) => pipe(selectWithRoot($), selectGameRows, cheerioToArray, reduce(gamesReducer($), []), createObjWithKey('games'));

const selectPreviousTds = (tableRow): cheerio.Element[] => tableRow.prev('tr').first().children('td').toArray();
const rowToSerieOveralls = ($: Root) => pipe(selectWithRoot($), selectPreviousTds, ifElse(propEq('length', 3), extractOveralls($), always({})));

const extractTitle = ($: Root) => pipe(nth(0), selectWithRoot($), invoker(0, 'text'), createObjWithKey('title'));
const extractStatsFromArr = ($: Root) => pipe(nth(0), selectWithRoot($), createLinkObj, createObjWithKey('stats'));
const extractStats = ($: Root) =>
  pipe(nth(2), selectWithRoot($), selectChildrenBy('a'), cheerioToArray, ifElse(propEq('length', 1), extractStatsFromArr($), identity));

const extractTeamWon = ($: Root) => pipe(nth(0), pipe(selectWithRoot($), createLinkObj, createObjWithKey('teamWon')));
const extractTeamLose = ($: Root) => pipe(nth(1), pipe(selectWithRoot($), createLinkObj, createObjWithKey('teamLose')));
const extractWonLoseTeam = ($: Root) => forkThenJoin(mergeObjs, extractTeamWon($), extractTeamLose($));
const extractTeams = ($: Root) =>
  pipe(nth(1), selectWithRoot($), selectChildrenBy('a'), cheerioToArray, ifElse(propEq('length', 2), extractWonLoseTeam($), identity));
const extractScoresFromArr = pipe(
  head,
  split('-'),
  ifElse(propEq('length', 2), (arr) => ({ wonBy: parseInt(arr[0], 10), loseBy: parseInt(arr[1], 10) }), identity),
);
const extractScores = ($: Root) =>
  pipe(nth(1), selectWithRoot($), invoker(0, 'text'), matchesInBrackets, ifElse(propEq('length', 1), extractScoresFromArr, identity));

const extractOveralls = ($: Root) => forkThenJoin(mergeObjs, extractTitle($), extractStats($), extractTeams($), extractScores($));
const transformRowToSerie = ($: Root) => forkThenJoin(mergeObjs, rowToGames($), rowToSerieOveralls($));
const selectToggleableRows = (table: Cheerio) => table.find('tbody').first().children('tr.toggleable');
const processSeriesTable = ($: Root) => pipe(selectToggleableRows, cheerioToArray, partial(map, [transformRowToSerie($)]));
const selectSeriesTable = pipe(selectByRoot('#all_playoffs'), ifElse(propEq('length', 1), toJust, toNothing));

/**
 * @param html
 */
export const generateSeries = (html: string) => pipe(selectSeriesTable, map(processSeriesTable(cheerio.load(html))))(cheerio.load(html));
