import { Module } from '@nestjs/common';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
import { AdminActivityService } from '../activity/admin-activity.service';

@Module({
  controllers: [FaqController],
  providers: [FaqService, AdminActivityService],
})
export class FaqModule {}
