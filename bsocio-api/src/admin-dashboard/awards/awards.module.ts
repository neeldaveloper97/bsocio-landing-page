import { Module } from '@nestjs/common';
import { AwardsController } from './awards.controller';
import { AwardsService } from './awards.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdminActivityModule } from '../activity/admin-activity.module';

@Module({
  imports: [PrismaModule, AdminActivityModule],
  controllers: [AwardsController],
  providers: [AwardsService],
  exports: [AwardsService],
})
export class AwardsModule {}
