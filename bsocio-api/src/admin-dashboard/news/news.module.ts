import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { AdminActivityService } from '../activity/admin-activity.service';

@Module({
  controllers: [NewsController],
  providers: [NewsService, AdminActivityService],
})
export class NewsModule {}
