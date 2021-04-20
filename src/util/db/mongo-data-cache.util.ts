import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Data } from 'src/schemas/data.schema';
import { CacheType } from 'src/types/cache.type';

@Injectable()
export class MongoDataCacheUtil implements CacheType<Data> {
  constructor(
    @Inject('DATA_MODEL')
    public store: Model<Data>,
  ) {}

  private READ_DATA_TIMEOUT_MS = 5000;
  private WRITE_DATA_TIMEOUT_MS = 10000;

  /**
   * Retrieve data by key
   * @param key
   */
  async get(key: string): Promise<Data | null> {
    const res = await this.store.findById(key, '_id value', {
      maxTimeMS: this.READ_DATA_TIMEOUT_MS,
    });
    return res;
  }

  /**
   * Retrieve a list of keys
   */
  async keys(): Promise<Pick<Data, '_id'>[]> {
    const res = await this.store.find({}, '_id', {
      maxTimeMS: this.READ_DATA_TIMEOUT_MS,
    });
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
    return await this.store.findOneAndReplace({ _id: key }, { value });
  }

  /**
   * Delete value associate to cache
   * @param key
   */
  async del(key: string): Promise<void> {
    await this.store.findOneAndRemove(
      { _id: key },
      {
        maxTimeMS: this.READ_DATA_TIMEOUT_MS,
      },
    );
  }

  /**
   * Wipe the cache
   */
  async flush(): Promise<void> {
    await this.store.deleteMany(
      {},
      {
        maxTimeMS: this.WRITE_DATA_TIMEOUT_MS,
      },
    );
  }
}
