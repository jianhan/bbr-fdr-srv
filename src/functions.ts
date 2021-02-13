import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Cache } from 'cache-manager';
import axios from 'axios';
import { Map } from 'immutable';
import cheerio from 'cheerio';
import { from } from 'rxjs';
import { Logger } from '@nestjs/common';
import * as fp from 'lodash/fp';
import { validateSync } from 'class-validator';
import * as fs from 'fs';

export function getMongoConnectionString(configService: ConfigService): string {
  const username = configService.get<string>('MONGODB_USERNAME');
  const password = configService.get<string>('MONGODB_PASSWORD');
  const host = configService.get<number>('MONGODB_HOST');
  const port = configService.get<number>('MONGODB_PORT');
  const database = configService.get<string>('MONGODB_DATABASE');

  return `mongodb://${username}:${password}@${host}:${port}/${database}`;
}

export function findDocByYear<T>(model: Model<any>, sortOrder = 1): Promise<T> {
  return model.findOne({}, null, { sort: { year: sortOrder } }).exec();
}

export const getCurrentYear = (): number => parseInt(moment().format('YYYY'), 10);

export const unary = (fn) => (arg) => fn(arg);

export function setCacheValWithTTL<T>(cacheManager: Cache, ttl: number, key: string, val: T): Promise<T> {
  return cacheManager.set(key, val, { ttl }).then(fp.constant(val));
}

export const withCacheByKey = async (loggerFunc, getCachedValByFunc, setCachedValFunc, key: string, getValFunc) => {
  const cachedVal = await getCachedValByFunc(key);
  if (_.isNull(cachedVal) || _.isUndefined(cachedVal)) {
    loggerFunc(`cached value was not found by key ${key}: ${cachedVal}`);
    const newVal = await getValFunc(key);
    loggerFunc(`cached was updated for key ${key}: ${cachedVal}`);
    await setCachedValFunc(key, newVal);
    return newVal;
  }

  loggerFunc(`load from cache by key ${key}`);
  return cachedVal;
};

export const pointFree = (fn, ...args) => () => fn(...args);

export const downloadHtmlByUrl = (url: string) =>
  axios.get(url).then((r) => {
    fs.writeFileSync(`test.html`, r.data);
    return r.data;
  });

export const stringInBrackets = (str: string): string => {
  const match = /\((.*?)\)/gm.exec(str);

  if (match === null) {
    return '';
  }

  if (match.length > 0) {
    return match[1];
  }

  return '';
};

export const strToCheerioRoot = (html: string) => cheerio.load(html);

export function isMapPropValid(key: string, data: Map<string, any>): boolean {
  const val = data.get(key);
  return !_.isNull(val) && !_.isUndefined(val);
}

/**
 * TODO: fix data type, if there is a type specified, then it must be generic enough to be
 * used anywhere.
 */
export const propIsValidOrThrow = (key: string) => (data) => {
  if (!isMapPropValid(key, data)) {
    throw new Error(`Property ${key} is required in in map ${data}`);
  }

  return data;
};

export const validOrThrow = (obj) => {
  const errs = validateSync(obj);
  if (errs.length > 0) {
    throw new Error(errs.map((v) => v.toString()).join(','));
  }

  return obj;
};

export function setCacheWithTTL<T>(cacheManager: Cache, ttl: number, key: string, val: T) {
  return cacheManager.set(key, val, ttl);
}

export const toObservable = (fn) => (...args) => from(fn(args));

export const log = (logger: Logger) => (message: any, context?: string): void => logger.log(message, context);

export const error = (logger: Logger) => (message: any, trace?: string, context?: string): void => logger.error(message, trace, context);

export const warn = (logger: Logger) => (message: any, context?: string): void => logger.warn(message, context);

export const debug = (logger: Logger) => (message: any, context?: string): void => logger.debug(message, context);

export const verbose = (logger: Logger) => (message: any, context?: string): void => logger.verbose(message, context);

export const setMapProp = (m, k, v) => m.set(k, v);

export const inc = (x) => x + 1;
