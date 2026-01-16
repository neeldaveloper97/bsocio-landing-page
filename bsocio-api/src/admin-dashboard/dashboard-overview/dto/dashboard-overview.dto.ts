import { ApiProperty } from '@nestjs/swagger';

export class DashboardMetricsDto {
  @ApiProperty({ example: 42 })
  totalSignUps!: number;

  @ApiProperty({ example: 3 })
  newSignUpsToday!: number;

  @ApiProperty({ example: 12 })
  monthlySignUps!: number;

  @ApiProperty({ example: 7 })
  usersWithBirthdaysThisMonth!: number;
}

export class ActivityItemDto {
  @ApiProperty({ example: 'USER_LOGIN' })
  type!: string;

  @ApiProperty({ example: 'User Login' })
  title!: string;

  @ApiProperty({ example: 'Super Administrator logged in', required: false })
  message?: string;

  @ApiProperty({ example: '2026-01-16T10:30:00.000Z' })
  createdAt!: string;
}

export class DashboardOverviewResponseDto {
  @ApiProperty({ type: DashboardMetricsDto })
  metrics!: DashboardMetricsDto;

  @ApiProperty({ type: [ActivityItemDto] })
  recentActivity!: ActivityItemDto[];
}
