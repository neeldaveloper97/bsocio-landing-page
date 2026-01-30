import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdminActivityModule } from '../activity/admin-activity.module';

@Module({
  imports: [PrismaModule, AdminActivityModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
