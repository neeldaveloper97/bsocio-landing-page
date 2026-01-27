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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';

@ApiTags('admin-dashboard: news')
@ApiBearerAuth('access-token')
@Controller('admin-dashboard/news')
export class NewsController {
  constructor(private readonly service: NewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create news article' })
  create(@Body() dto: CreateNewsDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List news articles' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'category', required: false })
  list(@Query('status') status?: string, @Query('category') category?: string) {
    return this.service.list(status, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get news article by id' })
  get(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update news article' })
  update(@Param('id') id: string, @Body() dto: CreateNewsDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive news article' })
  archive(@Param('id') id: string) {
    return this.service.archive(id);
  }
}
