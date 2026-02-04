import { Module } from '@nestjs/common';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersService } from './admin-users.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { RolesGuard } from '../../auth/roles.guard';

@Module({
  imports: [PrismaModule],
  controllers: [AdminUsersController],
  providers: [AdminUsersService, RolesGuard],
  exports: [AdminUsersService],
})
export class AdminUsersModule {}
