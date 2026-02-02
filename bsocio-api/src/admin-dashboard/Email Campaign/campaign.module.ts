import { Module } from '@nestjs/common';
import { MailModule } from '../../lib/mail/mail.module';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { CampaignQueueModule } from './queue/campaign-queue.module';

@Module({
  imports: [MailModule, CampaignQueueModule],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule { }
