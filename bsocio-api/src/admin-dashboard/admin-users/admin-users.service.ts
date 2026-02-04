import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role, AdminActivityType } from '@prisma/client';

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) { }

  async getAllUsers(query: { search?: string; role?: Role; page?: number; limit?: number }) {
    const { search, role, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        // { name: { contains: search, mode: 'insensitive' } }, // User model doesn't have name? Check schema?
        // Schema has 'id', 'email'. No 'name'. 'adminActivities' have 'actor' but user table seems to be auth only?
        // Wait, 'Nominee' has name. 'ContactInquiry' has fullName.
        // User model (Step 41) has: id, email, password, role, dob, oauthProvider, gender, invitationLink, phone.
        // NO NAME in User model? That's odd.
        // Ah, maybe usage is purely email based? Or name is in a profile relation?
        // Looking at schema: User has no name. Okay. Search email only.
      ];
    }

    if (role) {
      where.role = role;
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          isPermanentUser: true,
          oauthProvider: true,
          isTermsAccepted: true,
          dob: true,
          isPhoneVerified: true,
          gender: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async exportUsers(query: { search?: string; role?: Role }) {
    const { search, role } = query;
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        isPermanentUser: true,
        oauthProvider: true,
        isTermsAccepted: true,
        dob: true,
        isPhoneVerified: true,
        gender: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const header = [
      'ID',
      'Email',
      'Role',
      'Created At',
      'Is Permanent User',
      'OAuth Provider',
      'Terms Accepted',
      'DOB',
      'Phone Verified',
      'Gender',
    ].join(',');

    const rows = users.map((user) => {
      return [
        user.id,
        user.email,
        user.role,
        user.createdAt ? user.createdAt.toISOString() : '',
        user.isPermanentUser,
        user.oauthProvider || '',
        user.isTermsAccepted,
        user.dob ? user.dob.toISOString() : '',
        user.isPhoneVerified,
        user.gender || '',
      ]
        .map((field) => {
          const stringValue = String(field ?? '');
          if (
            stringValue.includes(',') ||
            stringValue.includes('"') ||
            stringValue.includes('\n')
          ) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(',');
    });

    return [header, ...rows].join('\n');
  }

  private getDateFilter(filter?: string): Date | undefined {
    if (!filter) return undefined;

    const now = new Date();
    switch (filter) {
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return undefined;
    }
  }

  async exportSystemLogs(params: {
    filter?: string;
    type?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    const { filter, type, search, sortBy, sortOrder, page, limit } = params;

    const dateFrom = this.getDateFilter(filter);

    const where: any = {
      ...(type && type !== 'all'
        ? { type: type as AdminActivityType }
        : { type: { not: AdminActivityType.USER_LOGIN } }),
      actor: {
        role: {
          not: Role.USER,
        },
      },
      ...(dateFrom ? { createdAt: { gte: dateFrom } } : {}),
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    const sortField = sortBy || 'createdAt';
    const order = sortOrder === 'asc' ? 'asc' : 'desc';

    const findOptions: any = {
      where,
      include: {
        actor: {
          select: {
            email: true,
            role: true,
          },
        },
      },
      orderBy: { [sortField as string]: order },
    };

    if (page && limit) {
      findOptions.skip = (page - 1) * limit;
      findOptions.take = +limit;
    }

    const activities: any[] = await this.prisma.adminActivity.findMany(findOptions);

    const header = [
      'ID',
      'Type',
      'Title',
      'Message',
      'Admin Email',
      'Admin Name',
      'Created At',
    ].join(',');

    const rows = activities.map((a) => {
      return [
        a.id,
        a.type,
        a.title,
        a.message || '',
        a.actor?.email ?? 'System',
        a.actor?.email
          ? a.actor.email.split('@')[0].charAt(0).toUpperCase() +
          a.actor.email.split('@')[0].slice(1)
          : 'System',
        a.createdAt ? a.createdAt.toISOString() : '',
      ]
        .map((field) => {
          const stringValue = String(field ?? '');
          if (
            stringValue.includes(',') ||
            stringValue.includes('"') ||
            stringValue.includes('\n')
          ) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(',');
    });

    return [header, ...rows].join('\n');
  }

  async createUser(dto: any) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('Email already exists');

    // Basic hash creation if password provided
    const bcrypt = await import('bcrypt');
    const passwordHash = dto.password ? await bcrypt.hash(dto.password, 12) : null;
    const { randomUUID } = await import('crypto');

    return this.prisma.user.create({
      data: {
        id: randomUUID(),
        email: dto.email,
        password: passwordHash,
        role: dto.role,
        dob: new Date(dto.dob),
        gender: dto.gender,
        isTermsAccepted: dto.isTermsAccepted || true, // Admins creating users might skip terms?
        isPermanentUser: true,
      },
      select: { id: true, email: true, role: true, createdAt: true },
    });
  }

  async updateUserRole(userId: string, role: Role, currentUserId: string) {
    if (userId === currentUserId) {
      throw new BadRequestException('You cannot change your own role');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        isPermanentUser: true,
      },
    });
  }

  async deleteUser(userId: string, currentUserId: string) {
    // Prevent admin from deleting themselves
    if (userId === currentUserId) {
      throw new BadRequestException('You cannot delete your own account');
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Delete related records first to avoid foreign key constraint violations
    // Delete magic links
    await this.prisma.magicLink.deleteMany({
      where: { userId },
    });

    // Delete admin activities
    await this.prisma.adminActivity.deleteMany({
      where: { actorId: userId },
    });

    // Now delete the user
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return {
      success: true,
      message: `User ${user.email} has been deleted successfully`,
    };
  }
}
