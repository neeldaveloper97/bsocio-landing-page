import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

function getUtcRangeForLocalDay(tzOffsetMinutes: number) {
  // tzOffsetMinutes: minutes to add to local time to get UTC (JS Date.getTimezoneOffset style)
  const now = new Date();

  // Convert "now" into "local" by subtracting offset, then take local day start, then convert back to UTC
  const localNowMs = now.getTime() - tzOffsetMinutes * 60_000;
  const localNow = new Date(localNowMs);

  const localStart = new Date(localNow);
  localStart.setHours(0, 0, 0, 0);

  const localEnd = new Date(localStart);
  localEnd.setDate(localEnd.getDate() + 1);

  // Convert local boundaries back to UTC
  const startUtc = new Date(localStart.getTime() + tzOffsetMinutes * 60_000);
  const endUtc = new Date(localEnd.getTime() + tzOffsetMinutes * 60_000);

  return { startUtc, endUtc };
}

function getUtcRangeForLocalMonth(tzOffsetMinutes: number) {
  const now = new Date();

  const localNowMs = now.getTime() - tzOffsetMinutes * 60_000;
  const localNow = new Date(localNowMs);

  const localStart = new Date(
    localNow.getFullYear(),
    localNow.getMonth(),
    1,
    0,
    0,
    0,
    0,
  );
  const localEnd = new Date(
    localNow.getFullYear(),
    localNow.getMonth() + 1,
    1,
    0,
    0,
    0,
    0,
  );

  const startUtc = new Date(localStart.getTime() + tzOffsetMinutes * 60_000);
  const endUtc = new Date(localEnd.getTime() + tzOffsetMinutes * 60_000);

  return { startUtc, endUtc, localMonth: localNow.getMonth() }; // 0-11
}

@Injectable()
export class DashboardOverviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(tzOffsetMinutes: number, activityTake: number) {
    const { startUtc: dayStartUtc, endUtc: dayEndUtc } =
      getUtcRangeForLocalDay(tzOffsetMinutes);
    const {
      startUtc: monthStartUtc,
      endUtc: monthEndUtc,
      localMonth,
    } = getUtcRangeForLocalMonth(tzOffsetMinutes);

    // Birthdays this month: simplest approach is using a date range across the month,
    // but birthdays repeat yearly. With birthDate stored, we filter by month using raw SQL.
    // This is Postgres-specific and efficient.
    const birthdaysThisMonthResult: Array<{ count: bigint }> = await this.prisma
      .$queryRaw`
        SELECT COUNT(*)::bigint AS count
        FROM "User"
        WHERE "dob" IS NOT NULL
          AND EXTRACT(MONTH FROM "dob") = ${localMonth + 1}
      `;
    const usersWithBirthdaysThisMonth = Number(
      birthdaysThisMonthResult[0]?.count ?? 0n,
    );

    const [totalSignUps, newSignUpsToday, monthlySignUps, recentActivity] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({
          where: { createdAt: { gte: dayStartUtc, lt: dayEndUtc } },
        }),
        this.prisma.user.count({
          where: { createdAt: { gte: monthStartUtc, lt: monthEndUtc } },
        }),
        this.prisma.adminActivity.findMany({
          orderBy: { createdAt: 'desc' },
          take: activityTake,
          select: { type: true, title: true, message: true, createdAt: true },
        }),
      ]);

    return {
      metrics: {
        totalSignUps,
        newSignUpsToday,
        monthlySignUps,
        usersWithBirthdaysThisMonth,
      },
      recentActivity: recentActivity.map((a) => ({
        type: a.type,
        title: a.title,
        message: a.message ?? undefined,
        createdAt: a.createdAt.toISOString(),
      })),
    };
  }
}
