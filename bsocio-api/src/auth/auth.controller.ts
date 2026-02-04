import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  ForbiddenException,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import * as ejs from 'ejs';
import * as path from 'path';
import { MailService } from 'src/lib/mail/mail.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/users/dto/login.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifySignupDto } from './dto/verify-signup.dto';
import { UsersService } from 'src/users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
  ) { }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password (JWT Bearer)' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password, dto.isAdminLogin);
  }

  @Get('magic/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify magic link token and return auth tokens' })
  async verifyMagic(@Query('token') token: string) {
    return this.authService.verifyMagicToken(token);
  }

  @Get('magic')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Magic link landing page (verifies token and renders a page)',
  })
  async magicLanding(
    @Query('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const frontend =
      process.env.FRONTEND_URL ||
      process.env.CORS_ORIGIN ||
      'http://localhost:3001';
    const cookieDomain = process.env.MAIL_DOMAIN || undefined; // e.g. specsto.online

    try {
      const result = await this.authService.verifyMagicToken(token);

      // set httpOnly cookies for access and refresh tokens
      const secure = process.env.NODE_ENV === 'production';
      const maxAge = 1000 * 60 * 60 * 24 * 30; // 30 days for refresh cookie

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 15, // 15 minutes
        domain: cookieDomain,
        path: '/',
      });
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        maxAge,
        domain: cookieDomain,
        path: '/',
      });

      // render success page and auto-redirect to frontend
      const templatePath = path.join(
        process.cwd(),
        'src',
        'lib',
        'agents',
        'med-optimize',
        'views',
        'magic-verify-success.ejs',
      );

      const html = await ejs.renderFile(templatePath, {
        frontend,
        email: result.user.email,
        redirectDelay: 3000,
      });

      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    } catch (err) {
      const templatePath = path.join(
        process.cwd(),
        'src',
        'lib',
        'agents',
        'med-optimize',
        'views',
        'magic-verify-failure.ejs',
      );
      const html = await ejs.renderFile(templatePath, {
        frontend,
        error: (err as Error).message,
      });
      res.setHeader('Content-Type', 'text/html');
      return res.status(401).send(html);
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Token refresh successful' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('verify-signup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify signup with phone number and invitation link' })
  @ApiResponse({ status: 200, description: 'Verification successful' })
  @ApiResponse({ status: 400, description: 'Invalid phone number or invitation link' })
  async verifySignup(@Body() dto: VerifySignupDto) {
    // Find user by email
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('User not found. Please sign up first.');
    }

    // Validate invitation link format (basic validation)
    if (!dto.invitationLink || dto.invitationLink.length < 5) {
      throw new BadRequestException('Invalid invitation link');
    }

    // Update user with phone and invitation link
    const updatedUser = await this.usersService.updatePhoneVerification(
      user.id,
      dto.phoneNumber,
      dto.invitationLink,
    );

    return {
      success: true,
      message: 'Verification successful',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        phone: updatedUser.phone,
        isPhoneVerified: updatedUser.isPhoneVerified,
      },
    };
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
    @Body()
    dto: {
      email: string;
      name: string;
      picture?: string;
      googleId: string;
      gender?: string;
      dob?: string;
      phone?: string;
      invitationLink?: string;
    },
  ) {
    return this.authService.googleAuthWithUserData(dto);
  }

  @Get('dev/magic-link')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'DEV: Get last unused magic link URL for an email (non-production only)',
  })
  async getDevMagicLink(@Query('email') email: string) {
    if (process.env.NODE_ENV === 'production')
      throw new ForbiddenException('Not allowed in production');
    return this.authService.getDevMagicLinkByEmail(email);
  }

  @Post('dev/send-test-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'DEV: Send a test email to the given address (non-production only)',
  })
  async sendTestEmail() {
    if (process.env.NODE_ENV === 'production')
      throw new ForbiddenException('Not allowed in production');

    const frontend =
      process.env.FRONTEND_URL ||
      process.env.CORS_ORIGIN ||
      'http://localhost:3001';
    const subject = `Test email from ${frontend}`;
    const text = `This is a test email from ${frontend} sent to vikramsahran72056@gmail.com`;

    const info = await this.mailService.sendMail({
      to: 'vikramsaharan72056@gmail.com',
      subject,
      text,
    } as any);

    return { success: true, info };
  }
}
