import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminActivityType } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { AdminActivityService } from 'src/admin-dashboard/activity/admin-activity.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly adminActivityService: AdminActivityService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password)
      throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // 🔔 Log admin activity (non-blocking, safe)
    await this.adminActivityService.log({
      type: AdminActivityType.USER_LOGIN,
      title: 'User Login',
      message: `${user.email} logged in`,
      actorId: user.id,
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }
}
