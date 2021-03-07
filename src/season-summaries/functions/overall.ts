import { first, getMapProp, lengthEq, matchInBracket, matchesInBrackets, siblings, lengthGteTo, initializeMap } from '../../functions';
import * as cheerio from 'cheerio';
import { pipe, constant, isNull } from 'lodash/fp';
import { Link } from '../../models/Link';
import { Map } from 'immutable';
import { ifElse } from 'sanctuary';
import Cheerio = cheerio.Cheerio;
import Root = cheerio.Root;
import { Overall } from '../schemas/overall';

const createMap = (html: string): Map<string, any> => Map({ $: cheerio.load(html), overall: {} });

const tagToLink = (dataExtractor = null) => (element: Cheerio): Link => ({
  title: element.text(),
  href: element.attr('href'),
  data: dataExtractor ? dataExtractor(element.parent().text()) : null,
});

const extractAndSetLink = (selector: string, key: keyof Overall) => (immutableMap: Map<string, any>) => {
  const link = extractLink(selector)(immutableMap) as Link;
  return isNull(link) ? immutableMap : setProp(key, link, immutableMap);
};

//todo: fix unknown type
const setProp = (key: keyof Overall, val: unknown, immutableMap) => {
  const overall = immutableMap.get('overall');
  overall[key] = val;
  return immutableMap.set('overall', overall);
};

const selectStrong = (selector: string) => ($: Root) => $(`strong:contains('${selector}')`);

const extractLink = (selector) =>
  pipe(getMapProp('$'), selectStrong(selector), siblings('a'), ifElse(lengthEq(1))(pipe(first, tagToLink(matchInBracket)))(constant(null)));

const linkTagsToObjs = (tags: Cheerio) => {
  let current = tags.first();
  const links = [];
  while (current !== null && current.length > 0) {
    const link = tagToLink(null)(current);
    links.push(link);
    current = current.next();
  }

  return links;
};

const siblingsToObjs = (tag: string, strongTag) => pipe(siblings(tag), ifElse(lengthGteTo(1))(linkTagsToObjs)(constant(null)))(strongTag);

const setElements = (m) => m.set('linkElements', siblingsToObjs('a', m.get('strongTag')));
const setText = (m) => m.set('linkText', matchesInBrackets(m.get('strongTag').parent().text()));
const elementsMatchText = (m) => m.get('linkElements').length === m.get('linkText').length;

const combineElementsWithText = (m) => {
  const linkElements = m.get('linkElements');
  const linkText = m.get('linkText');
  return linkElements.map((data, i) => {
    data['data'] = linkText[i];
    return data;
  });
};

const extractLinks = pipe(initializeMap('strongTag'), setElements, setText, ifElse(elementsMatchText)(combineElementsWithText)(constant(null)));

const extractAndSetLinks = (selector, attribute) => (immutableMap) => {
  const strongTag = immutableMap.get('$')(`strong:contains('${selector}')`);
  return strongTag.length === 1 ? setProp(attribute, extractLinks(strongTag), immutableMap) : immutableMap;
};

export const extractOverall = pipe(
  createMap,
  extractAndSetLink('League Champion', 'leagueChampion'),
  extractAndSetLink('Most Valuable Player', 'mostValuablePlayer'),
  extractAndSetLinks('Rookie of the Year', 'rookieOfTheYear'),
  extractAndSetLink('PPG Leader', 'ppgLeader'),
  extractAndSetLink('RPG Leader', 'rpgLeader'),
  extractAndSetLink('APG Leader', 'apgLeader'),
  extractAndSetLink('WS Leader', 'wsLeader'),
  getMapProp('overall'),
);
