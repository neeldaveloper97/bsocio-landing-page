import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  private monthRange(year: number, month: number) {
    return {
      start: new Date(year, month - 1, 1),
      end: new Date(year, month, 1),
    };
  }

  private getMonthName(month: number): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[month - 1];
  }

  async getOverview(year: number, month: number) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-indexed

    // Determine if we're viewing current period or historical data
    const isCurrentYear = year === currentYear;
    const isCurrentMonth = isCurrentYear && month === currentMonth;

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const weekStart = new Date(todayStart);
    weekStart.setDate(todayStart.getDate() - todayStart.getDay());

    const thisMonth = this.monthRange(year, month);
    const lastMonth = this.monthRange(
      month === 1 ? year - 1 : year,
      month === 1 ? 12 : month - 1,
    );

    /* ---------------- SIGNUPS ---------------- */

    // For historical periods (past year or past month), show 0 for today/thisWeek
    // since those are relative to "now" and wouldn't make sense for past periods
    const [total, todayCount, thisWeekCount, thisMonthCount, lastMonthCount] =
      await Promise.all([
        this.prisma.user.count(),
        // Only count "today" if viewing current month
        isCurrentMonth
          ? this.prisma.user.count({ where: { createdAt: { gte: todayStart } } })
          : Promise.resolve(0),
        // Only count "this week" if viewing current month
        isCurrentMonth
          ? this.prisma.user.count({ where: { createdAt: { gte: weekStart } } })
          : Promise.resolve(0),
        this.prisma.user.count({
          where: { createdAt: { gte: thisMonth.start, lt: thisMonth.end } },
        }),
        this.prisma.user.count({
          where: { createdAt: { gte: lastMonth.start, lt: lastMonth.end } },
        }),
      ]);

    const growthPercent =
      lastMonthCount === 0
        ? 100
        : Number(
            (
              ((thisMonthCount - lastMonthCount) / lastMonthCount) *
              100
            ).toFixed(2),
          );

    /* ---------------- SIGNUP TREND ---------------- */

    const signupTrend = await this.prisma.$queryRaw<
      { date: Date; count: number }[]
    >(Prisma.sql`
      SELECT DATE("createdAt") AS date, COUNT(*)::int AS count
      FROM "User"
      WHERE "createdAt" >= ${thisMonth.start}
        AND "createdAt" < ${thisMonth.end}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `);

    /* ---------------- MONTHLY SIGNUPS (All 12 months) ---------------- */

    const monthlySignups: { month: string; value: number }[] = [];
    for (let m = 1; m <= 12; m++) {
      const range = this.monthRange(year, m);
      const count = await this.prisma.user.count({
        where: { createdAt: { gte: range.start, lt: range.end } },
      });
      monthlySignups.push({
        month: this.getMonthName(m).substring(0, 3),
        value: count,
      });
    }

    /* ---------------- BIRTHDAYS ---------------- */

    const birthdayTotal = await this.prisma.$queryRaw<
      { count: number }[]
    >(Prisma.sql`
      SELECT COUNT(*)::int AS count
      FROM "User"
      WHERE "dob" IS NOT NULL
        AND EXTRACT(MONTH FROM "dob") = ${month}
    `);

    const birthdaysByWeekday = await this.prisma.$queryRaw<
      { weekday: number; count: number }[]
    >(Prisma.sql`
      SELECT EXTRACT(DOW FROM "dob")::int AS weekday,
             COUNT(*)::int AS count
      FROM "User"
      WHERE "dob" IS NOT NULL
        AND EXTRACT(MONTH FROM "dob") = ${month}
      GROUP BY weekday
      ORDER BY weekday ASC
    `);

    const weekdayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    // Build calendar with all 7 days (even if 0)
    const birthdayCalendar = weekdayNames.map((name, index) => {
      const found = birthdaysByWeekday.find((b) => b.weekday === index);
      return {
        dayName: name,
        count: found?.count ?? 0,
      };
    });

    /* ---------------- FINAL RESPONSE ---------------- */

    return {
      signups: {
        total,
        today: todayCount,
        thisWeek: thisWeekCount,
        thisMonth: thisMonthCount,
        lastMonth: lastMonthCount,
        growthPercent,
        monthlyTotal: thisMonthCount,
        monthlyPeriod: `${this.getMonthName(month)} ${year}`,
      },
      signupTrend: signupTrend.map((t) => ({
        date: t.date.toISOString().slice(0, 10),
        count: t.count,
      })),
      monthlySignups,
      birthdays: {
        totalThisMonth: birthdayTotal[0]?.count ?? 0,
        calendar: birthdayCalendar,
      },
    };
  }
}
