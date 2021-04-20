import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { DataDocument } from 'src/schemas/data.schema';
import { MongoDataCacheUtil } from 'src/util/db/mongo-data-cache.util';
import { commerce } from 'faker';
import { envConst } from 'src/constants/env.const';
import { dataDto } from './dot/data.dto';
import { Types } from 'mongoose';
import { enMessages } from './i18n/en-messages.i18n';

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
      Types.ObjectId(key);
    } catch (error) {
      throw new BadRequestException(enMessages.invalidDataKey);
    }

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
   * @param dataDto
   * @param ttl
   */
  async createData(
    { value }: dataDto,
    ttl = CACHE_DEFAULT_TTL,
  ): Promise<DataDocument> {
    try {
      return this.dataCacheUtil.set(value, ttl);
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  /**
   * Update Data
   * @param key
   * @param dataDto
   * @param ttl
   */
  async updateData(
    key: string,
    { value }: dataDto,
    ttl = CACHE_DEFAULT_TTL,
  ): Promise<DataDocument> {
    let res: DataDocument;
    try {
      Types.ObjectId(key);
    } catch (error) {
      throw new BadRequestException(enMessages.invalidDataKey);
    }

    try {
      res = await this.dataCacheUtil.update(key, value, ttl);
    } catch (error) {
      throw new ServiceUnavailableException();
    }
    if (!res) {
      throw new NotFoundException();
    }
    return res;
  }
}
