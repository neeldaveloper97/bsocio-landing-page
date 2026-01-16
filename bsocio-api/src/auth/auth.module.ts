import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AdminDashboardModule } from 'src/admin-dashboard/admin-dashboard.module';

@Module({
  imports: [
    UsersModule,
    AdminDashboardModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
