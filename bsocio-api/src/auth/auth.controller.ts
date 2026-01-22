import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/users/dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password (JWT Bearer)' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login/Register with Google OAuth' })
  @ApiResponse({ status: 200, description: 'Google authentication successful' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  async googleAuth(@Body() dto: GoogleAuthDto) {
    return this.authService.googleAuth(dto.idToken);
  }

  @Post('google/callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Google OAuth callback with user data' })
  @ApiResponse({ status: 200, description: 'Google authentication successful' })
  async googleCallback(
    @Body() dto: { email: string; name: string; picture?: string; googleId: string },
  ) {
    return this.authService.googleAuthWithUserData(dto);
  }
}
