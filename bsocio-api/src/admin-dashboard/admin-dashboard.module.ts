import { Module } from '@nestjs/common';
import { FaqModule } from './faq/faq.module';
import { DashboardOverviewModule } from './dashboard-overview/dashboard-overview.module';
import { AdminActivityModule } from './activity/admin-activity.module';
import { LegalDocumentsModule } from './legal-documents/legal-documents.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NewsModule } from './news/news.module';
import { CampaignModule } from './Email Campaign/campaign.module';
import { EventsModule } from './events/events.module';
import { AwardsModule } from './awards/awards.module';
import { AdminUsersModule } from './admin-users/admin-users.module';

@Module({
  imports: [
    FaqModule,
    DashboardOverviewModule,
    AdminActivityModule,
    LegalDocumentsModule,
    AnalyticsModule,
    NewsModule,
    CampaignModule,
    AdminUsersModule,
    EventsModule,
    AwardsModule,
  ],
  controllers: [],
  providers: [],
  exports: [AdminActivityModule],
})
export class AdminDashboardModule { }
