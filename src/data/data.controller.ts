import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { DataDocument } from 'src/schemas/data.schema';
import { DataService } from './data.service';
import { CreateDataDto } from './dot/create-data.dto';

@Controller('data')
export class DataController {
  constructor(private dataService: DataService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getKeys(): Promise<Partial<DataDocument | '_d'>[]> {
    return this.dataService.getKeys();
  }

  @Get('/:key')
  @HttpCode(HttpStatus.OK)
  getDataByKey(@Param('key') key: string): Promise<DataDocument> {
    return this.dataService.getDataByKey(key);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createData(@Body() createDataDto: CreateDataDto): Promise<DataDocument> {
    return this.dataService.createData(createDataDto);
  }
}
