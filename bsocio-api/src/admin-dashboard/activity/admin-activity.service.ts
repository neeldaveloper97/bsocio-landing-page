import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminActivityType } from '@prisma/client';

@Injectable()
export class AdminActivityService {
  constructor(private readonly prisma: PrismaService) {}

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
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { skip = 0, take = 10, filter, sortBy, sortOrder } = params;

    const dateFrom = this.getDateFilter(filter);

    const where = {
      type: {
        not: AdminActivityType.USER_LOGIN,
      },
      ...(dateFrom ? { createdAt: { gte: dateFrom } } : {}),
    };

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
}
