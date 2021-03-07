import { CACHE_MANAGER, HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  downloadHtmlByUrl,
  findDocByYear,
  getCurrentYear,
  log,
  pointFree,
  setCacheValWithTTL,
  setMapProp,
  unary,
  validPropOrThrow,
  withCacheByKey,
} from '../functions';

import { from } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { checkUrlExists, checkYearExists, createMapByYear, setUrlByYear } from './functions/functions';
import { extractOverall } from './functions/overall';
import { SeasonSummaryMap } from './types';
import { partial } from 'lodash/fp';
import { SeasonSummary, SeasonSummaryDocument } from './schemas/season-summary.schema';
import { UpdateMapProp, UpdateMapPropSync } from '../types';

@Injectable()
export class SeasonSummariesService {
  private readonly logger = new Logger(SeasonSummariesService.name);
  private readonly domainUrl: string;
  private readonly minimalYear: number;
  private readonly ttl: number;

  private createMap;
  private setUrl: UpdateMapPropSync<SeasonSummaryMap>;
  private upsertByYear: (summaryMap: SeasonSummaryMap) => Promise<SeasonSummaryDocument>;
  private downloadAndSetHtml: UpdateMapProp<SeasonSummaryMap>;
  private wrapCacheWithManager: (key: string, getValFunc) => Promise<any>;
  private setOverall: (m) => any;

  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(SeasonSummary.name) private seasonSummaryModel: Model<SeasonSummaryDocument>,
    private configService: ConfigService,
  ) {
    this.domainUrl = this.configService.get<string>('DOMAIN_URL');
    this.minimalYear = this.configService.get<number>('MINIMAL_YEAR');
    this.ttl = this.configService.get<number>('CACHE_TTL');
    this.createMap = unary(createMapByYear(this.minimalYear, getCurrentYear()));
    this.setUrl = unary(setUrlByYear(this.domainUrl));
    this.upsertByYear = (summaryMap: SeasonSummaryMap) =>
      this.seasonSummaryModel
        .findOneAndUpdate({ year: summaryMap.get('year') }, summaryMap.toJS(), {
          new: true,
          upsert: true,
        })
        .exec();

    const setCacheWithTTLFunc = partial(setCacheValWithTTL, [this.cacheManager, this.ttl]);
    this.wrapCacheWithManager = partial(withCacheByKey, [log(this.logger), this.cacheManager.get, setCacheWithTTLFunc]);

    // todo: fix type below
    this.downloadAndSetHtml = (summaryMap: SeasonSummaryMap): Promise<SeasonSummaryMap> =>
      this.wrapCacheWithManager(summaryMap.get('url'), pointFree(downloadHtmlByUrl, summaryMap.get('url'))).then((v) => {
        return setMapProp('html')(v)(summaryMap);
      }) as any;

    this.setOverall = (m) => m.set('overall', extractOverall(m.get('html')));
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  syncSeasonSummary(): Promise<any> {
    return from(findDocByYear(this.seasonSummaryModel, -1))
      .pipe(
        tap((v) => this.logger.log(`start processing syncing season summary with: ${v}`)),
        map(this.createMap),
        tap((v) => this.logger.log(`initialized overall data with year: ${v}`)),
        map(checkYearExists),
        map(this.setUrl),
        map(checkUrlExists),
        tap((v) => this.logger.log(`url exists: ${v}`)),
        mergeMap(this.downloadAndSetHtml),
        tap((v) => this.logger.log(`downloaded and set html from: ${v.get('url')}`)),
        map(this.setOverall),
        map(validPropOrThrow('overall')),
        mergeMap((v) => {
          console.debug(123213)
          return from(this.upsertByYear(v));
        }),
        // map(this.upsertByYear),
      )
      .toPromise()
      .then((result) => {
        this.logger.log('finished sync overall');
        return result;
      })
      .catch((err: Error) => {
        this.logger.error(`error occur while syncing overall data ${err}`);
      });
  }
}
