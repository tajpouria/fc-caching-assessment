import { Module } from '@nestjs/common';
import { databaseProviders } from 'src/providers/database.providers';
import { MongoDataCacheUtil } from 'src/util/db/mongo-data-cache.util';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { dataProviders } from './providers/data.providers';

@Module({
  controllers: [DataController],
  providers: [
    DataService,
    MongoDataCacheUtil,
    ...dataProviders,
    ...databaseProviders,
  ],
})
export class DataModule {}
