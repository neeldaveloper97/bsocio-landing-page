import { Module } from '@nestjs/common';
import { LegalDocumentsController } from './legal-documents.controller';
import { LegalDocumentsService } from './legal-documents.service';
import { AdminActivityService } from '../activity/admin-activity.service';

@Module({
  controllers: [LegalDocumentsController],
  providers: [LegalDocumentsService, AdminActivityService],
})
export class LegalDocumentsModule {}
