import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { DataDocument } from 'src/schemas/data.schema';
import { MongoDataCacheUtil } from 'src/util/db/mongo-data-cache.util';
import { commerce } from 'faker';
import { envConst } from 'src/constants/env.const';

const { CACHE_DEFAULT_TTL_SEC: _CACHE_DEFAULT_TTL_SEC } = envConst;
const CACHE_DEFAULT_TTL = parseInt(_CACHE_DEFAULT_TTL_SEC, 10);

@Injectable()
export class DataService {
  constructor(private dataCacheUtil: MongoDataCacheUtil) {}

  /**
   * Retrieve data document that associated to specified key
   * @param key
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
      console.info(error);
      throw new ServiceUnavailableException();
    }
  }
}
