import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';

@ApiTags('admin-dashboard: news')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('admin-dashboard/news')
export class NewsController {
  constructor(private readonly service: NewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create news article' })
  create(@Body() dto: CreateNewsDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List news articles' })
  list(@Query('status') status?: string) {
    return this.service.list(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get news article by id' })
  get(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update news article' })
  update(@Param('id') id: string, @Body() dto: CreateNewsDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive news article' })
  archive(@Param('id') id: string) {
    return this.service.archive(id);
  }
}
