import { always, cond, contains, head, ifElse, invoker, map, mergeAll, partial, pipe } from 'ramda';
import Root = cheerio.Root;
import Cheerio = cheerio.Cheerio;
import {
  cheerioAttrEq,
  cheerioLoad,
  cheerioToArray,
  createLinkObj,
  createObjWithKey,
  first,
  forkThenJoin,
  mergeObjs,
  propLengthEq,
  selectByRoot,
  selectChildrenBy,
  selectWithRoot,
  toLeftIfLengthIsZero,
} from '../../functions';
import { chain as sChain, map as sMap } from 'sanctuary';
const dataStatEq = ($: Root, v) => pipe(selectWithRoot($), cheerioAttrEq('data-stat', v));

const extractTeam = ($: Root) =>
  pipe(
    selectWithRoot($),
    selectChildrenBy('a'),
    ifElse(propLengthEq(1), pipe(head, selectWithRoot($), createLinkObj, createObjWithKey('team')), always({})),
  );
const extractIsPlayoffTeam = ($: Root) => pipe(selectWithRoot($), invoker(0, 'text'), pipe(contains('*'), createObjWithKey('isPlayoffTeam')));

const extractTeamAndIsPlayoff = ($: Root) => forkThenJoin(mergeObjs, extractTeam($), extractIsPlayoffTeam($));
const toIntThenCreateObj = ($: Root, prop) => (tdElement: Cheerio) => ({ [prop]: parseInt($(tdElement).text(), 10) });
const toFloatThenCreateObj = ($: Root, prop) => (tdElement: Cheerio) => ({ [prop]: parseFloat($(tdElement).text()) });

export const tdOrThToProp = ($: Root) =>
  cond([
    [dataStatEq($, 'ranker'), toIntThenCreateObj($, 'rank')],
    [dataStatEq($, 'team_name'), extractTeamAndIsPlayoff($)],
    [dataStatEq($, 'g'), toIntThenCreateObj($, 'games')],
    [dataStatEq($, 'mp'), toFloatThenCreateObj($, 'minutesPlayed')],
    [dataStatEq($, 'fg'), toFloatThenCreateObj($, 'fieldGoals')],
    [dataStatEq($, 'fga'), toFloatThenCreateObj($, 'fieldGoalAttempts')],
    [dataStatEq($, 'fg_pct'), toFloatThenCreateObj($, 'fieldGoalPercentage')],
    [dataStatEq($, 'fg3'), toFloatThenCreateObj($, 'threePointFieldGoals')],
    [dataStatEq($, 'fg3a'), toFloatThenCreateObj($, 'threePointFieldGoalAttempts')],
    [dataStatEq($, 'fg3_pct'), toFloatThenCreateObj($, 'threePointFieldGoalPercentage')],
    [dataStatEq($, 'fg2'), toFloatThenCreateObj($, 'twoPointFieldGoals')],
    [dataStatEq($, 'fg2a'), toFloatThenCreateObj($, 'twoPointFieldGoalAttempts')],
    [dataStatEq($, 'fg2_pct'), toFloatThenCreateObj($, 'twoPointFieldGoalPercentage')],
    [dataStatEq($, 'ft'), toFloatThenCreateObj($, 'freeThrows')],
    [dataStatEq($, 'fta'), toFloatThenCreateObj($, 'freeThrowAttempts')],
    [dataStatEq($, 'ft_pct'), toFloatThenCreateObj($, 'freeThrowPercentage')],
    [dataStatEq($, 'orb'), toFloatThenCreateObj($, 'offensiveRebounds')],
    [dataStatEq($, 'drb'), toFloatThenCreateObj($, 'defensiveRebounds')],
    [dataStatEq($, 'trb'), toFloatThenCreateObj($, 'totalRebounds')],
    [dataStatEq($, 'ast'), toFloatThenCreateObj($, 'assists')],
    [dataStatEq($, 'stl'), toFloatThenCreateObj($, 'steals')],
    [dataStatEq($, 'blk'), toFloatThenCreateObj($, 'blocks')],
    [dataStatEq($, 'tov'), toFloatThenCreateObj($, 'turnovers')],
    [dataStatEq($, 'pf'), toFloatThenCreateObj($, 'personalFouls')],
    [dataStatEq($, 'pts'), toFloatThenCreateObj($, 'points')],
    [always(true), always({})],
  ]);

const selectRowsToArr = ($) => pipe(selectWithRoot($), selectChildrenBy('tbody'), first, selectChildrenBy('tr:not([class])'), cheerioToArray);

// todo: fix type any
const rowToTeamPerGameStat = ($: Root) =>
  pipe(selectWithRoot($), selectChildrenBy('th[data-stat], td[data-stat]'), cheerioToArray, partial(map, [tdOrThToProp($)]), (v: any) => {
    return mergeAll(v);
  });
const mapRows = ($: Root) => partial(map, [rowToTeamPerGameStat($)]);

// TODO: fix type
export const generatePerGameStatsByTableId: any = (html: string, tableId: string) => {
  const $ = cheerioLoad(html);

  return pipe(selectByRoot(`#${tableId}`), toLeftIfLengthIsZero, sMap(selectRowsToArr($)), sChain(toLeftIfLengthIsZero), sMap(mapRows($)))($);
};
