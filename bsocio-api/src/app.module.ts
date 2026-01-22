import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    HealthModule,
    UsersModule,
    AuthModule,
    AdminDashboardModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
