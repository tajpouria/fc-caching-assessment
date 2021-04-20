import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { DataDocument } from 'src/schemas/data.schema';
import { DataService } from './data.service';

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
}
