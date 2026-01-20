import { Module } from '@nestjs/common';
import { FaqModule } from './faq/faq.module';
import { DashboardOverviewModule } from './dashboard-overview/dashboard-overview.module';
import { AdminActivityModule } from './activity/admin-activity.module';
import { LegalDocumentsModule } from './legal-documents/legal-documents.module';

@Module({
  imports: [
    FaqModule,
    DashboardOverviewModule,
    AdminActivityModule,
    LegalDocumentsModule,
  ],
  controllers: [],
  providers: [],
  exports: [AdminActivityModule],
})
export class AdminDashboardModule {}
