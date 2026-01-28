import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminActivityService } from './admin-activity.service';

@ApiTags('admin-dashboard: activity')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('admin-dashboard/activity')
export class AdminActivityController {
  constructor(private readonly service: AdminActivityService) {}

  @Get()
  @ApiOperation({
    summary: 'Get paginated admin activities (excludes user login)',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Number of records to skip',
    example: 0,
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of records to take (max 50)',
    example: 10,
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Time filter: 24h, week, month',
    enum: ['24h', 'week', 'month'],
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by (createdAt)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order (asc or desc)',
    enum: ['asc', 'desc'],
  })
  async getActivities(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('filter') filter?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    const skipNum = skip ? parseInt(skip, 10) : 0;
    const takeNum = take ? Math.min(Math.max(parseInt(take, 10), 1), 50) : 10;
    return this.service.getActivities({
      skip: skipNum,
      take: takeNum,
      filter,
      sortBy,
      sortOrder,
    });
  }
}
