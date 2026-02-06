import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminActivityType, Role } from '@prisma/client';

@Injectable()
export class AdminActivityService {
  constructor(private readonly prisma: PrismaService) { }

  async log(params: {
    type: AdminActivityType;
    title: string;
    message?: string;
    actorId?: string;
  }) {
    return this.prisma.adminActivity.create({
      data: {
        type: params.type,
        title: params.title,
        message: params.message,
        actorId: params.actorId,
      },
    });
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

  async getActivities(params: {
    skip?: number;
    take?: number;
    filter?: string;
    type?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    includeLogin?: boolean;
  }) {
    const { skip = 0, take = 10, filter, type, search, sortBy, sortOrder, includeLogin = false } = params;

    const dateFrom = this.getDateFilter(filter);

    // Only get activities from admin role users
    // Exclude USER_LOGIN type by default unless includeLogin is true or type filter is set
    const where: any = {
      // Exclude USER_LOGIN type unless specifically filtered or includeLogin is true
      ...(type && type !== 'all'
        ? { type: type as AdminActivityType }
        : includeLogin 
          ? {} 
          : { type: { not: AdminActivityType.USER_LOGIN } }),
      // Only include activities from users with admin roles (exclude USER role)
      actor: {
        role: {
          not: Role.USER,
        },
      },
      ...(dateFrom ? { createdAt: { gte: dateFrom } } : {}),
    };

    // Search by title or message
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy based on sortBy and sortOrder params
    const validSortFields = ['createdAt'];
    const sortField = validSortFields.includes(sortBy || '')
      ? sortBy
      : 'createdAt';
    const order = sortOrder === 'asc' ? 'asc' : 'desc';

    const [activities, total] = await Promise.all([
      this.prisma.adminActivity.findMany({
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
        skip,
        take,
      }),
      this.prisma.adminActivity.count({ where }),
    ]);

    return {
      activities: activities.map((a) => ({
        id: a.id,
        type: a.type,
        title: a.title,
        message: a.message ?? undefined,
        adminEmail: a.actor?.email ?? 'System',
        adminName: a.actor?.email
          ? a.actor.email.split('@')[0].charAt(0).toUpperCase() +
          a.actor.email.split('@')[0].slice(1)
          : 'System',
        createdAt: a.createdAt.toISOString(),
      })),
      total,
    };
  }

  /**
   * Get activity statistics for dashboard
   * Returns counts for: login activity, content changes, email campaigns
   */
  async getStats() {
    const [
      totalLogs,
      loginActivity,
      contentChanges,
      emailCampaigns,
    ] = await Promise.all([
      // Total logs (excluding USER_LOGIN from non-admin users)
      this.prisma.adminActivity.count({
        where: {
          actor: {
            role: { not: Role.USER },
          },
        },
      }),
      // Login activity count
      this.prisma.adminActivity.count({
        where: {
          type: AdminActivityType.USER_LOGIN,
          actor: {
            role: { not: Role.USER },
          },
        },
      }),
      // Content changes (FAQ, NEWS, LEGAL, EVENT, AWARD, NOMINEE, CEREMONY, SPECIAL_GUEST - CREATED, UPDATED, DELETED, ARCHIVED)
      this.prisma.adminActivity.count({
        where: {
          type: {
            in: [
              AdminActivityType.FAQ_CREATED,
              AdminActivityType.FAQ_UPDATED,
              AdminActivityType.FAQ_ARCHIVED,
              AdminActivityType.NEWS_CREATED,
              AdminActivityType.NEWS_UPDATED,
              AdminActivityType.NEWS_ARCHIVED,
              AdminActivityType.LEGAL_CREATED,
              AdminActivityType.LEGAL_UPDATED,
              AdminActivityType.EVENT_CREATED,
              AdminActivityType.EVENT_UPDATED,
              AdminActivityType.EVENT_DELETED,
              AdminActivityType.AWARD_CATEGORY_CREATED,
              AdminActivityType.AWARD_CATEGORY_UPDATED,
              AdminActivityType.AWARD_CATEGORY_DELETED,
              AdminActivityType.NOMINEE_CREATED,
              AdminActivityType.NOMINEE_UPDATED,
              AdminActivityType.NOMINEE_DELETED,
              AdminActivityType.CEREMONY_CREATED,
              AdminActivityType.CEREMONY_UPDATED,
              AdminActivityType.CEREMONY_DELETED,
              AdminActivityType.SPECIAL_GUEST_CREATED,
              AdminActivityType.SPECIAL_GUEST_UPDATED,
              AdminActivityType.SPECIAL_GUEST_DELETED,
            ],
          },
          actor: {
            role: { not: Role.USER },
          },
        },
      }),
      // Email campaigns count - using SYSTEM type or we can add EMAIL_CAMPAIGN types later
      this.prisma.adminActivity.count({
        where: {
          type: AdminActivityType.SYSTEM,
          actor: {
            role: { not: Role.USER },
          },
        },
      }),
    ]);

    return {
      totalLogs,
      loginActivity,
      contentChanges,
      emailCampaigns,
    };
  }
}
