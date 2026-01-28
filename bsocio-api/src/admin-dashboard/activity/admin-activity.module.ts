import { Module } from '@nestjs/common';
import { AdminActivityService } from './admin-activity.service';
import { AdminActivityController } from './admin-activity.controller';

@Module({
  controllers: [AdminActivityController],
  providers: [AdminActivityService],
  exports: [AdminActivityService],
})
export class AdminActivityModule {}
