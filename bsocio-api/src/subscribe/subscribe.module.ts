import { Module } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { SubscribeController } from './subscribe.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../lib/mail/mail.module';

@Module({
    imports: [PrismaModule, MailModule],
    controllers: [SubscribeController],
    providers: [SubscribeService],
})
export class SubscribeModule { }
