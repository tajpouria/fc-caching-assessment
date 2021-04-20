import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { envConst } from 'src/constants/env.const';
import { Data } from 'src/schemas/data.schema';
import { CacheType } from 'src/types/cache.type';

const { CACHE_DEFAULT_TTL_SEC: _CACHE_DEFAULT_TTL_SEC } = envConst;
const CACHE_DEFAULT_TTL_SEC = parseInt(_CACHE_DEFAULT_TTL_SEC);

@Injectable()
export class MongoDataCacheUtil implements CacheType<Data> {
  constructor(
    @Inject('DATA_MODEL')
    public store: Model<Data>,
  ) {
    this.calculateExpiryDataThreshold;
  }

  private READ_DATA_TIMEOUT_MS = 5000;
  private WRITE_DATA_TIMEOUT_MS = 10000;

  /**
   * Retrieve oldest valid expiration daytime
   */
  private get calculateExpiryDataThreshold(): Date {
    const t = new Date();
    t.setSeconds(t.getSeconds() - CACHE_DEFAULT_TTL_SEC);
    return t;
  }

  /**
   * Retrieve data by key
   * @param key
   */
  async get(key: string): Promise<Data | null> {
    const res = await this.store.findOneAndUpdate(
      { _id: key, updatedAt: { $gt: this.calculateExpiryDataThreshold } },
      { updatedAt: new Date() },
      {
        maxTimeMS: this.READ_DATA_TIMEOUT_MS,
      },
    );
    return res;
  }

  /**
   * Retrieve a list of keys
   */
  async keys(): Promise<Pick<Data, '_id'>[]> {
    const res = await this.store.find(
      { updatedAt: { $gt: this.calculateExpiryDataThreshold } },
      '_id',
      {
        maxTimeMS: this.READ_DATA_TIMEOUT_MS,
      },
    );
    return res;
  }

  /**
   * Store key -> value for time to live
   * @param key
   * @param value
   * @param ttl
   */
  async set(value: string, ttl: number): Promise<Data> {
    return await this.store.findOneAndReplace(
      { value },
      { value },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  /**
   * Update and store key -> value for time to live(TTL)
   * @param key
   * @param value
   * @param ttl
   */
  async update(key: string, value: string, ttl: number): Promise<Data> {
    return await this.store.findOneAndUpdate(
      { _id: key },
      { value, updatedAt: new Date() },
    );
  }

  /**
   * Delete value associate to cache
   * @param key
   */
  async del(key: string): Promise<void> {
    await this.store.findOneAndUpdate(
      { _id: key },
      { updatedAt: new Date('December 30, 1997 11:20:25') },
      {
        maxTimeMS: this.READ_DATA_TIMEOUT_MS,
      },
    );
  }

  /**
   * Wipe the cache
   */
  async flush(): Promise<void> {
    await this.store.updateMany(
      {},
      { updatedAt: new Date('December 30, 1997 11:20:25') },
      {
        maxTimeMS: this.WRITE_DATA_TIMEOUT_MS,
      },
    );
  }
}
