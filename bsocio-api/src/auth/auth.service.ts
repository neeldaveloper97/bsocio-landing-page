import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AdminActivityType, OAuthProvider } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { AdminActivityService } from 'src/admin-dashboard/activity/admin-activity.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { MailService } from 'src/lib/mail/mail.service';

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
    private readonly mailService: MailService,
  ) { }

  async login(email: string, password: string, isAdminLogin?: boolean) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password)
      throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // 🔒 Enforce Admin Access Control
    if (isAdminLogin) {
      const allowedAdminRoles = [
        'SUPER_ADMIN',
        'CONTENT_ADMIN',
        'COMMUNICATIONS_ADMIN',
        'ANALYTICS_VIEWER',
      ];
      if (!allowedAdminRoles.includes(user.role)) {
        throw new ForbiddenException(
          'Access denied. Admin portal is restricted to authorized administrators.',
        );
      }
    }

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

  /**
   * Generate a short-lived magic link JWT and send to user's email.
   */
  async sendMagicLinkEmail(user: { id: string; email: string }) {
    // create a unique jti and persist as single-use record
    const jti = randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // sign token including jti so we can validate/consume it later
    const magicToken = await this.jwtService.signAsync(
      { sub: user.id, type: 'MAGIC', jti },
      { expiresIn: '15m' },
    );

    // persist magic link record
    await this.prisma.magicLink.create({
      data: {
        jti,
        userId: user.id,
        expiresAt,
        type: 'MAGIC',
      },
    });

    const environment = this.configService.get<string>('NODE_ENV');

    const backend =
      environment === 'production'
        ? this.configService.get<string>('BACKEND_URL_PROD') ||
        this.configService.get<string>('CORS_ORIGIN') ||
        'https://api.specsto.online'
        : this.configService.get<string>('BACKEND_URL_DEV') ||
        this.configService.get<string>('CORS_ORIGIN') ||
        'http://localhost:3001';
    const magicUrl = `${backend}/auth/magic?token=${encodeURIComponent(magicToken)}`;
    const subject = 'Your magic sign-in link (valid 15 minutes)';

    // use template mail for nicer HTML
    await this.mailService.sendTemplateMail({
      to: user.email,
      subject,
      template: 'magic-link',
      context: {
        magicUrl,
        expiresInMinutes: 15,
        email: user.email,
      },
      text: `Use this link to sign in: ${magicUrl} (expires in 15 minutes)`,
    });

    // Log magic URL for local/dev testing (do not log in production)
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`[DEV] Magic sign-in URL for ${user.email}: ${magicUrl}`);
    }
  }

  /**
   * Post-signup actions: log registration.
   * User will receive invitation link separately (not via email).
   */
  async handleNewUserSignup(user: { id: string; email: string }) {
    await this.adminActivityService.log({
      type: AdminActivityType.SYSTEM,
      title: 'New User Signup',
      message: `${user.email} registered via Email`,
      actorId: user.id,
    });

    // No magic link - invitation links are shared individually with customers
  }

  /**
   * Verify a magic token and return a full set of auth tokens.
   */
  async verifyMagicToken(token: string) {
    try {
      const payload: any = await this.jwtService.verifyAsync(token);
      if (!payload || payload.type !== 'MAGIC' || !payload.jti)
        throw new UnauthorizedException('Invalid magic link');

      // check persisted jti record
      const record = await this.prisma.magicLink.findUnique({
        where: { jti: payload.jti },
      });
      if (!record)
        throw new UnauthorizedException('Invalid or already used magic link');
      if (record.used)
        throw new UnauthorizedException('Magic link already used');
      if (record.expiresAt < new Date())
        throw new UnauthorizedException('Magic link expired');

      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');

      // mark as used (single-use)
      await this.prisma.magicLink.update({
        where: { jti: payload.jti },
        data: { used: true },
      });

      const { accessToken, refreshToken } = await this.generateTokens(user);
      return {
        success: true,
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, role: user.role },
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired magic link');
    }
  }

  /**
   * DEV helper: return a magic link URL for the last unused magic link for an email.
   * Only available in non-production.
   */
  async getDevMagicLinkByEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const record = await this.prisma.magicLink.findFirst({
      where: { userId: user.id, used: false },
      orderBy: { createdAt: 'desc' },
    });
    if (!record) throw new NotFoundException('No unused magic link found');

    const remainingSec = Math.max(
      0,
      Math.floor((record.expiresAt.getTime() - Date.now()) / 1000),
    );
    if (remainingSec <= 0) throw new BadRequestException('Magic link expired');

    const token = await this.jwtService.signAsync(
      { sub: user.id, type: 'MAGIC', jti: record.jti },
      { expiresIn: `${remainingSec}s` },
    );

    const frontend =
      this.configService.get<string>('FRONTEND_URL') ||
      this.configService.get<string>('CORS_ORIGIN') ||
      'http://localhost:3001';
    const magicUrl = `${frontend}/auth/magic?token=${encodeURIComponent(token)}`;

    return { magicUrl, expiresAt: record.expiresAt };
  }
}
