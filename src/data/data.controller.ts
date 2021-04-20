import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Data } from 'src/schemas/data.schema';
import { DataService } from './data.service';
import { dataDto } from './dto/data.dto';

@Controller('data')
export class DataController {
  constructor(private dataService: DataService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getKeys(): Promise<Partial<Data | '_d'>[]> {
    return this.dataService.getKeys();
  }

  @Get('/:key')
  @HttpCode(HttpStatus.OK)
  getDataByKey(@Param('key') key: string): Promise<Data> {
    return this.dataService.getDataByKey(key);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createData(@Body() createDataDto: dataDto): Promise<Data> {
    return this.dataService.createData(createDataDto);
  }

  @Patch('/:key')
  @HttpCode(HttpStatus.OK)
  updateData(
    @Param('key') key: string,
    @Body() updateDataDto: dataDto,
  ): Promise<Data> {
    return this.dataService.updateDataByKey(key, updateDataDto);
  }

  @Delete('/')
  @HttpCode(HttpStatus.NO_CONTENT)
  flushData(): Promise<void> {
    return this.dataService.flushData();
  }

  @Delete('/:key')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteData(@Param('key') key: string): Promise<void> {
    return this.dataService.deleteDataByKey(key);
  }
}
