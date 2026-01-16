import { Module } from '@nestjs/common';
import { AdminActivityService } from './admin-activity.service';

@Module({
  providers: [AdminActivityService],
  exports: [AdminActivityService],
})
export class AdminActivityModule {}
