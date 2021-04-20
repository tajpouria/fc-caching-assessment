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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { Data } from 'src/schemas/data.schema';
import { DataService } from './data.service';
import { dataDto } from './dto/data.dto';

@ApiTags('data')
@Controller('v1/data')
export class DataController {
  constructor(private dataService: DataService) {}

  @ApiOperation({ description: 'Retrieve cache keys' })
  @ApiBearerAuth()
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
  @UseGuards(new AuthGuard())
  getKeys(): Promise<Partial<Data | '_id'>[]> {
    return this.dataService.getKeys();
  }

  @ApiOperation({
    description:
      'Retrieve existing record that is associated with specified key if there is any, or create a random one',
  })
  @ApiBearerAuth()
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
  @UseGuards(new AuthGuard())
  getDataByKey(@Param('key') key: string): Promise<Data> {
    return this.dataService.getDataByKey(key);
  }

  @ApiOperation({
    description: 'Create a record',
  })
  @ApiBearerAuth()
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
  @UseGuards(new AuthGuard())
  createData(@Body() createDataDto: dataDto): Promise<Data> {
    return this.dataService.createData(createDataDto);
  }

  @ApiOperation({
    description: 'Update a cached record',
  })
  @ApiBearerAuth()
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
  @UseGuards(new AuthGuard())
  updateData(
    @Param('key') key: string,
    @Body() updateDataDto: dataDto,
  ): Promise<Data> {
    return this.dataService.updateDataByKey(key, updateDataDto);
  }

  @ApiOperation({
    description: 'Delete a cached record',
  })
  @ApiBearerAuth()
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
  @UseGuards(new AuthGuard())
  flushData(): Promise<void> {
    return this.dataService.flushData();
  }

  @ApiOperation({
    description: 'Remove all the cached records',
  })
  @ApiBearerAuth()
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
  @UseGuards(new AuthGuard())
  deleteData(@Param('key') key: string): Promise<void> {
    return this.dataService.deleteDataByKey(key);
  }
}
