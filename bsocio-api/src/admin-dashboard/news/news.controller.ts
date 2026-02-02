import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';

@ApiTags('admin-dashboard: news')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
@Controller('admin-dashboard/news')
export class NewsController {
  constructor(private readonly service: NewsService) { }

  @Post()
  @ApiOperation({ summary: 'Create news article' })
  create(@Body() dto: CreateNewsDto, @Request() req: any) {
    return this.service.create(dto, req.user?.userId);
  }

  @Get()
  @ApiOperation({ summary: 'List news articles' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description:
      'Field to sort by (title, category, author, publicationDate, status, views)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc or desc)',
  })
  list(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.service.list(status, category, sortBy, sortOrder);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get news article by id' })
  get(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update news article' })
  update(
    @Param('id') id: string,
    @Body() dto: CreateNewsDto,
    @Request() req: any,
  ) {
    return this.service.update(id, dto, req.user?.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive news article' })
  archive(@Param('id') id: string, @Request() req: any) {
    return this.service.archive(id, req.user?.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete news article' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
