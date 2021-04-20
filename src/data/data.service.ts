import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { DataDocument } from 'src/schemas/data.schema';
import { MongoDataCacheUtil } from 'src/util/db/mongo-data-cache.util';
import { commerce } from 'faker';
import { envConst } from 'src/constants/env.const';
import { CreateDataDto } from './dot/create-data.dto';

const { CACHE_DEFAULT_TTL_SEC: _CACHE_DEFAULT_TTL_SEC } = envConst;
const CACHE_DEFAULT_TTL = parseInt(_CACHE_DEFAULT_TTL_SEC, 10);

@Injectable()
export class DataService {
  constructor(private dataCacheUtil: MongoDataCacheUtil) {}

  /**
   * Retrieve cache keys
   * @param key
   */
  async getKeys(): Promise<Partial<DataDocument | '_d'>[]> {
    try {
      return this.dataCacheUtil.keys();
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  /**
   * Retrieve data document that associated to specified key
   * @param key
   * @param ttl
   */
  async getDataByKey(
    key: string,
    ttl = CACHE_DEFAULT_TTL,
  ): Promise<DataDocument> {
    try {
      const data = await this.dataCacheUtil.get(key);
      if (data) {
        return data;
      }

      return this.dataCacheUtil.set(commerce.product(), ttl);
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  /**
   * Create a data
   * @param key
   * @param ttl
   */
  async createData({ value }: CreateDataDto): Promise<DataDocument> {
    try {
      return this.dataCacheUtil.set(value, CACHE_DEFAULT_TTL);
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }
}
