import { Controller, Get, Param } from '@nestjs/common';
import { DataDocument } from 'src/schemas/data.schema';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private dataService: DataService) {}

  @Get('/:key')
  getDataByKey(@Param('id') key: string): Promise<DataDocument> {
    console.info('hello');
    return this.dataService.getDataByKey(key);
  }
}
