import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envConst } from './constants/env.const';
import { DataModule } from './data/data.module';

@Module({
  imports: [
    MongooseModule.forRoot(envConst.MONGO_DB_CONNECTION_URL),
    DataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
