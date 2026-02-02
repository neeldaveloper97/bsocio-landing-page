import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { CampaignProcessor } from './campaign.processor';
import { MailModule } from '../../../lib/mail/mail.module';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'campaign',
        }),
        MailModule,
    ],
    providers: [CampaignProcessor],
    exports: [BullModule],
})
export class CampaignQueueModule { }
