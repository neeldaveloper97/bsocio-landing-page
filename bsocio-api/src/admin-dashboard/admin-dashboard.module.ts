import { Module } from '@nestjs/common';
import { FaqModule } from './faq/faq.module';
import { DashboardOverviewModule } from './dashboard-overview/dashboard-overview.module';
import { AdminActivityModule } from './activity/admin-activity.module';

@Module({
  imports: [FaqModule, DashboardOverviewModule, AdminActivityModule],
  controllers: [],
  providers: [],
  exports: [AdminActivityModule],
})
export class AdminDashboardModule {}
