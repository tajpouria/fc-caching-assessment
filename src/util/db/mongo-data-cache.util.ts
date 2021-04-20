import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Data, DataDocument } from 'src/schemas/data.schema';
import { CacheType } from 'src/types/cache.type';

@Injectable()
export class MongoDataCacheUtil implements CacheType<DataDocument> {
  constructor(@InjectModel(Data.name) public store: Model<DataDocument>) {}

  /**
   * Retrieve data by key
   * @param key
   */
  async get(key: string): Promise<DataDocument | null> {
    const res = await this.store.findById(key, '_id value', {
      maxTimeMS: 5000,
    });
    return res;
  }

  /**
   * Retrieve a list of keys
   */
  async keys(): Promise<Pick<DataDocument, '_id'>[]> {
    const res = await this.store.find({}, '_id', {
      maxTimeMS: 5000,
    });
    return res;
  }

  /**
   * Store key -> value for time to live
   * @param key
   * @param value
   * @param ttl
   */
  async set(value: string, ttl: number): Promise<DataDocument> {
    return await this.store.create({ value });
  }

  /**
   * Update and store key -> value for time to live(TTL)
   * @param key
   * @param value
   * @param ttl
   */
  async update(key: string, value: string, ttl: number): Promise<void> {
    await this.store.findByIdAndUpdate(
      key,
      { value },
      {
        maxTimeMS: 5000,
      },
    );
  }

  /**
   * Delete value associate to cache
   * @param key
   */
  async del(key: string): Promise<void> {
    await this.store.findByIdAndDelete(key, {
      maxTimeMS: 5000,
    });
  }

  /**
   * Wipe the cache
   */
  async flush(): Promise<void> {
    await this.store.deleteMany(
      {},
      {
        maxTimeMS: 1000,
      },
    );
  }
}
