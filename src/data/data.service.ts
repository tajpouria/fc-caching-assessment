import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Data } from 'src/schemas/data.schema';
import { MongoDataCacheUtil } from 'src/util/db/mongo-data-cache.util';
import { name } from 'faker';
import { envConst } from 'src/constants/env.const';
import { dataDto } from './dto/data.dto';
import { Types } from 'mongoose';
import { enMessages } from './i18n/en-messages.i18n';
import { logger } from 'src/util/log/logger.util';

const { CACHE_DEFAULT_TTL_SEC: _CACHE_DEFAULT_TTL_SEC } = envConst;
const CACHE_DEFAULT_TTL = parseInt(_CACHE_DEFAULT_TTL_SEC, 10);

@Injectable()
export class DataService {
  constructor(private dataCacheUtil: MongoDataCacheUtil) {}

  /**
   * Retrieve cache keys
   * @param key
   */
  async getKeys(): Promise<Partial<Data | '_id'>[]> {
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
  async getDataByKey(key: string, ttl = CACHE_DEFAULT_TTL): Promise<Data> {
    try {
      Types.ObjectId(key);
    } catch (error) {
      logger.info('Cache hit');
      return this.dataCacheUtil.set(name.firstName(), ttl);
    }

    try {
      const data = await this.dataCacheUtil.get(key);
      if (data) {
        logger.info('Cache hit');
        return data;
      }

      logger.info('Cache miss');
      return this.dataCacheUtil.set(name.firstName(), ttl);
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
  async createData({ value }: dataDto, ttl = CACHE_DEFAULT_TTL): Promise<Data> {
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
  async updateDataByKey(
    key: string,
    { value }: dataDto,
    ttl = CACHE_DEFAULT_TTL,
  ): Promise<Data> {
    let res: Data;
    try {
      Types.ObjectId(key);
    } catch (error) {
      throw new BadRequestException(enMessages.invalidDataKey);
    }

    try {
      res = await this.dataCacheUtil.update(key, value, ttl);
    } catch (error) {
      if (error.code === 10003) {
        throw new BadRequestException(error.message);
      }

      throw new ServiceUnavailableException();
    }
    if (!res) {
      throw new NotFoundException();
    }
    return res;
  }

  /**
   * Delete Data
   * @param key
   * @param dataDto
   */
  async deleteDataByKey(key: string): Promise<void> {
    try {
      Types.ObjectId(key);
    } catch (error) {
      throw new BadRequestException(enMessages.invalidDataKey);
    }

    try {
      await this.dataCacheUtil.del(key);
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  /**
   * Removes all records
   */
  async flushData(): Promise<void> {
    try {
      await this.dataCacheUtil.flush();
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }
}
