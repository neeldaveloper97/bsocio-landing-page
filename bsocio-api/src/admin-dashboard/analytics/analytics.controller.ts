import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics.query.dto';

@ApiTags('admin-dashboard: analytics')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ANALYTICS_VIEWER')
@Controller('admin-dashboard/analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) { }

  @Get('overview')
  @ApiOperation({ summary: 'Analytics dashboard overview' })
  overview(@Query() q: AnalyticsQueryDto) {
    const now = new Date();
    return this.service.getOverview(
      q.year ?? now.getFullYear(),
      q.month ?? now.getMonth() + 1,
    );
  }
}
