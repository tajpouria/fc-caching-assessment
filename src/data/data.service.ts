import { Injectable } from '@nestjs/common';
import { DataDocument } from 'src/schemas/data.schema';
import { MongoDataCacheUtil } from 'src/util/db/mongo-data-cache.util';

@Injectable()
export class DataService {
  constructor(private dataCacheUtil: MongoDataCacheUtil) {}

  /**
   * Retrieve data document that associated to specified key
   * @param key
   */
  async getDataByKey(key: string): Promise<DataDocument> {
    const data = await this.dataCacheUtil.get(key);
    return data;
  }
}
