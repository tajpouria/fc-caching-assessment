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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Data } from 'src/schemas/data.schema';
import { DataService } from './data.service';
import { dataDto } from './dto/data.dto';

@ApiTags('data')
@Controller('v1/data')
export class DataController {
  constructor(private dataService: DataService) {}

  @ApiOperation({ description: 'Retrieve cache keys' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a list of cached record keys',
  })
  @ApiResponse({
    status: 503,
    description: 'Unavailable service',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  getKeys(): Promise<Partial<Data | '_id'>[]> {
    return this.dataService.getKeys();
  }

  @ApiOperation({
    description:
      'Retrieve existing record that is associated with specified key if there is any, or create a random one',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieve existing record or create a random one',
  })
  @ApiResponse({
    status: 503,
    description: 'Unavailable service',
  })
  @ApiParam({
    name: 'key',
    description: 'Data key, constructed from 24 hex characters',
    example: '607f2a243c738ebcd789eb67',
    required: true,
  })
  @Get('/:key')
  @HttpCode(HttpStatus.OK)
  getDataByKey(@Param('key') key: string): Promise<Data> {
    return this.dataService.getDataByKey(key);
  }

  @ApiOperation({
    description: 'Create a record',
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created',
  })
  @ApiResponse({
    status: 503,
    description: 'Unavailable service',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createData(@Body() createDataDto: dataDto): Promise<Data> {
    return this.dataService.createData(createDataDto);
  }

  @ApiOperation({
    description: 'Update a cached record',
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Record does not exists',
  })
  @ApiResponse({
    status: 503,
    description: 'Unavailable service',
  })
  @ApiParam({
    name: 'key',
    description: 'Data key, constructed from 24 hex characters',
    example: '607f2a243c738ebcd789eb67',
    required: true,
  })
  @Patch('/:key')
  @HttpCode(HttpStatus.OK)
  updateData(
    @Param('key') key: string,
    @Body() updateDataDto: dataDto,
  ): Promise<Data> {
    return this.dataService.updateDataByKey(key, updateDataDto);
  }

  @ApiOperation({
    description: 'Delete a cached record',
  })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Record does not exists',
  })
  @ApiResponse({
    status: 503,
    description: 'Unavailable service',
  })
  @Delete('/')
  @HttpCode(HttpStatus.NO_CONTENT)
  flushData(): Promise<void> {
    return this.dataService.flushData();
  }

  @ApiOperation({
    description: 'Remove all the cached records',
  })
  @ApiResponse({
    status: 204,
    description: 'Cache flushed successfully',
  })
  @ApiResponse({
    status: 503,
    description: 'Unavailable service',
  })
  @ApiParam({
    name: 'key',
    description: 'Data key, constructed from 24 hex characters',
    example: '607f2a243c738ebcd789eb67',
    required: true,
  })
  @Delete('/:key')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteData(@Param('key') key: string): Promise<void> {
    return this.dataService.deleteDataByKey(key);
  }
}
