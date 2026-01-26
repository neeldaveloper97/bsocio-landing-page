import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AdminActivityType, OAuthProvider } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { AdminActivityService } from 'src/admin-dashboard/activity/admin-activity.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';

interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly adminActivityService: AdminActivityService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
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

    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Authenticate with Google ID Token
   * This validates the token with Google and creates/updates the user
   */
  async googleAuth(idToken: string) {
    try {
      // Verify the ID token with Google
      const googleUser = await this.verifyGoogleToken(idToken);

      if (!googleUser.email_verified) {
        throw new UnauthorizedException('Google email not verified');
      }

      return this.handleGoogleUser({
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        googleId: googleUser.sub,
      });
    } catch (error) {
      console.error('Google auth error:', error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  /**
   * Authenticate with Google user data (from frontend @react-oauth/google)
   * This is called after frontend gets user info from Google
   */
  async googleAuthWithUserData(userData: {
    email: string;
    name: string;
    picture?: string;
    googleId: string;
  }) {
    return this.handleGoogleUser(userData);
  }

  /**
   * Handle Google user - create or update and return tokens
   */
  private async handleGoogleUser(userData: {
    email: string;
    name: string;
    picture?: string;
    googleId: string;
  }) {
    const { email, name, picture, googleId } = userData;

    // Check if user exists by Google ID or email
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ oauthId: googleId }, { email: email }],
      },
    });

    if (!user) {
      // Create new user
      user = await this.prisma.user.create({
        data: {
          id: randomUUID(),
          email,
          oauthProvider: OAuthProvider.GOOGLE,
          oauthId: googleId,
          role: 'USER',
          dob: new Date('2000-01-01'), // Default DOB for OAuth users
          isTermsAccepted: true, // Assumed accepted via OAuth
          isPermanentUser: true,
        },
      });

      // Log new user registration
      await this.adminActivityService.log({
        type: AdminActivityType.SYSTEM,
        title: 'New Google User',
        message: `${email} registered via Google OAuth`,
        actorId: user.id,
      });
    } else if (!user.oauthId) {
      // Link Google account to existing email user
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          oauthProvider: OAuthProvider.GOOGLE,
          oauthId: googleId,
        },
      });

      await this.adminActivityService.log({
        type: AdminActivityType.SYSTEM,
        title: 'Google Account Linked',
        message: `${email} linked Google account`,
        actorId: user.id,
      });
    }

    // Log login activity
    await this.adminActivityService.log({
      type: AdminActivityType.USER_LOGIN,
      title: 'Google Login',
      message: `${user.email} logged in via Google`,
      actorId: user.id,
    });

    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isNewUser: !user.isPermanentUser,
      },
    };
  }

  /**
   * Refresh access token using a valid refresh token
   */
  async refreshToken(refreshToken: string) {
    try {
      // Verify the refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken);

      // Get the user
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      // Generate new tokens
      const tokens = await this.generateTokens(user);
      return {
        success: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Verify Google ID token
   */
  private async verifyGoogleToken(idToken: string): Promise<GoogleUserInfo> {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');

    // Verify token with Google's tokeninfo endpoint
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
    );

    if (!response.ok) {
      throw new UnauthorizedException('Invalid Google token');
    }

    const payload = await response.json();

    // Verify the token was issued for our app
    if (payload.aud !== clientId) {
      throw new UnauthorizedException('Token not issued for this application');
    }

    return payload as GoogleUserInfo;
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(user: {
    id: string;
    email: string;
    role: string;
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync({ sub: user.id }, { expiresIn: '30d' }),
    ]);

    return { accessToken, refreshToken };
  }
}
