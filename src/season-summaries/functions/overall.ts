import { getMapProp, matchesInBrackets, siblings, lengthGteTo, initializeMap } from '../../functions';
import * as cheerio from 'cheerio';
import { pipe, constant } from 'lodash/fp';
import { Link } from '../../models/Link';
import { Map } from 'immutable';
import { ifElse } from 'sanctuary';
import Cheerio = cheerio.Cheerio;
import { Overall } from '../schemas/overall';

const createMap = (html: string): Map<string, any> => Map({ $: cheerio.load(html), overall: {} });

const toLink = (dataExtractor = null) => (element: Cheerio): Link => ({
  title: element.text(),
  href: element.attr('href'),
  data: dataExtractor ? dataExtractor(element.parent().text()) : null,
});

//todo: fix unknown type
const setProp = (key: keyof Overall, val: unknown, immutableMap) => {
  const overall = immutableMap.get('overall');
  overall[key] = val;
  return immutableMap.set('overall', overall);
};

const tagsToObjs = (tags: Cheerio) => {
  let current = tags.first();
  const links = [];
  while (current !== null && current.length > 0) {
    const link = toLink(null)(current);
    links.push(link);
    current = current.next();
  }

  return links;
};

const siblingsToObjs = (tag: string, strongTag) => pipe(siblings(tag), ifElse(lengthGteTo(1))(tagsToObjs)(constant(null)))(strongTag);

const setElements = (m) => m.set('linkElements', siblingsToObjs('a', m.get('strongTag')));

const setText = (m) => m.set('linkText', matchesInBrackets(m.get('strongTag').parent().text()));

const elementsMatchesText = (m) => m.get('linkElements').length === m.get('linkText').length;

const combineElementsAndText = (m) => {
  const linkElements = m.get('linkElements');
  const linkText = m.get('linkText');
  return linkElements.map((data, i) => {
    data['data'] = linkText[i];
    return data;
  });
};

const extractLinks = pipe(initializeMap('strongTag'), setElements, setText, ifElse(elementsMatchesText)(combineElementsAndText)(constant(null)));

const extractAndSetLinks = (selector, attribute) => (immutableMap) => {
  const strongTag = immutableMap.get('$')(`strong:contains('${selector}')`);
  return strongTag.length === 1 ? setProp(attribute, extractLinks(strongTag), immutableMap) : immutableMap;
};

export const extractOverall = pipe(
  createMap,
  extractAndSetLinks('League Champion', 'leagueChampion'),
  extractAndSetLinks('Most Valuable Player', 'mostValuablePlayer'),
  extractAndSetLinks('Rookie of the Year', 'rookieOfTheYear'),
  extractAndSetLinks('PPG Leader', 'ppgLeader'),
  extractAndSetLinks('RPG Leader', 'rpgLeader'),
  extractAndSetLinks('APG Leader', 'apgLeader'),
  extractAndSetLinks('WS Leader', 'wsLeader'),
  getMapProp('overall'),
);
