import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { DashboardOverviewService } from './dashboard-overview.service';
import { DashboardOverviewResponseDto } from './dto/dashboard-overview.dto';

@ApiTags('admin-dashboard: overview')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('admin-dashboard/overview')
export class DashboardOverviewController {
  constructor(private readonly service: DashboardOverviewService) {}

  @Get()
  @ApiOperation({
    summary: 'Dashboard overview (metrics + recent activity feed)',
  })
  @ApiOkResponse({ type: DashboardOverviewResponseDto })
  @ApiQuery({
    name: 'tzOffsetMinutes',
    required: false,
    description:
      'Timezone offset in minutes (use JS Date.getTimezoneOffset()). Defaults to 0 (UTC).',
    example: -330,
  })
  @ApiQuery({
    name: 'activityTake',
    required: false,
    description: 'How many recent activity items to return',
    example: 10,
  })
  async overview(
    @Query('tzOffsetMinutes') tzOffsetMinutes?: string,
    @Query('activityTake') activityTake?: string,
  ) {
    const tz = tzOffsetMinutes ? parseInt(tzOffsetMinutes, 10) : 0;
    const take = activityTake
      ? Math.min(Math.max(parseInt(activityTake, 10), 1), 50)
      : 10;
    return this.service.getOverview(tz, take);
  }
}
