import { Module } from '@nestjs/common';
import { FaqModule } from './faq/faq.module';
import { DashboardOverviewModule } from './dashboard-overview/dashboard-overview.module';
import { AdminActivityModule } from './activity/admin-activity.module';
import { LegalDocumentsModule } from './legal-documents/legal-documents.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    FaqModule,
    DashboardOverviewModule,
    AdminActivityModule,
    LegalDocumentsModule,
    AnalyticsModule,
  ],
  controllers: [],
  providers: [],
  exports: [AdminActivityModule],
})
export class AdminDashboardModule {}
