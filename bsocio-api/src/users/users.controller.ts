import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create admin user' })
  // Keep open initially to bootstrap admin; later we can protect it or convert to seed script.
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);

    // trigger post-signup actions (log + magic link email) asynchronously
    this.authService.handleNewUserSignup(user).catch((err) => {
      console.error('Post-signup actions failed:', err);
    });

    return user;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List users (protected)' })
  async findAll() {
    return this.usersService.findAll();
  }
}
