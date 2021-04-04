import * as puppeteer from 'puppeteer';
import { range } from 'ramda';
import * as fs from 'fs';
import * as path from 'path';

const syncByYear = async (year: number) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.basketball-reference.com/leagues/NBA_${year}.html`);
  await page.waitForSelector('#team-stats-per_game').then(() => console.log('got it'));
  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  fs.writeFileSync(path.join(__dirname, '../__tests__', `summary_${year}.html`), bodyHTML);
  await browser.close();

  return bodyHTML;
};

describe('resync test data', () => {
  describe('sync', () => {
    it('should download all files', async () => {
      const pp = await Promise.all(range(2015, 2021).map(syncByYear));
    }, 100000);
  });
});
