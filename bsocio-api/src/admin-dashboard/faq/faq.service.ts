import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminActivityService } from '../activity/admin-activity.service';
import { AdminActivityType } from '@prisma/client';
import { CreateFaqDto } from './dto/create-faq.dto';
import { ListFaqQueryDto } from './dto/list-faq.query';
import { UpdateFaqDto } from './dto/update-faq.dto';
import Redis from 'ioredis';

@Injectable()
export class FaqService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: AdminActivityService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) { }

  private async invalidateCache() {
    /*const keys = await this.redis.keys('faq:*');
    if (keys.length > 0) {
      await this.redis.del(keys);
    }*/
  }

  async create(dto: CreateFaqDto, actorId?: string) {
    const existing = await this.prisma.faq.findFirst({
      where: {
        question: { equals: dto.question, mode: 'insensitive' },
      },
    });

    if (existing) {
      throw new ConflictException('This FAQ question already exists.');
    }

    const faq = await this.prisma.faq.create({ data: dto });

    await this.invalidateCache();

    // Log activity
    await this.activityService.log({
      type: AdminActivityType.FAQ_CREATED,
      title: 'FAQ Created',
      message: `Created FAQ: "${dto.question?.substring(0, 50)}..."`,
      actorId,
    });

    return faq;
  }

  async list(query: any) {
    const cacheKey = `faq:list:${JSON.stringify(query)}`;
    /*const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);*/

    const where: any = {
      ...(query.state ? { state: query.state } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.visibility ? { visibility: query.visibility } : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(query.q
        ? {
          OR: [
            { question: { contains: query.q, mode: 'insensitive' } },
            { answer: { contains: query.q, mode: 'insensitive' } },
          ],
        }
        : {}),
    };

    const skip = query.skip ?? 0;
    const take = query.take ?? 20;

    // Build orderBy based on sortBy and sortOrder params
    const validSortFields = [
      'question',
      'category',
      'status',
      'createdAt',
      'views',
      'sortOrder',
    ];
    const sortBy = validSortFields.includes(query.sortBy)
      ? query.sortBy
      : 'sortOrder';
    const sortOrder = query.sortOrder === 'desc' ? 'desc' : 'asc';

    const orderBy: any[] =
      sortBy === 'sortOrder'
        ? [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
        : [{ [sortBy]: sortOrder }];

    const [items, total] = await Promise.all([
      this.prisma.faq.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      this.prisma.faq.count({ where }),
    ]);

    const result = { items, total, skip, take };
    // await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 60);

    return result;
  }

  async getById(id: string) {
    const cacheKey = `faq:detail:${id}`;
    /*const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);*/

    const faq = await this.prisma.faq.findUnique({ where: { id } });
    if (!faq) throw new NotFoundException('FAQ not found');

    // await this.redis.set(cacheKey, JSON.stringify(faq), 'EX', 300);
    return faq;
  }

  async update(id: string, dto: UpdateFaqDto, actorId?: string) {
    const existing = await this.getById(id);

    // Check duplicate if question changes
    if (dto.question && dto.question !== existing.question) {
      const duplicate = await this.prisma.faq.findFirst({
        where: {
          question: { equals: dto.question, mode: 'insensitive' },
          id: { not: id }, // Exclude self
        },
      });

      if (duplicate) {
        throw new ConflictException('This FAQ question already exists.');
      }
    }

    const faq = await this.prisma.faq.update({ where: { id }, data: dto });

    await this.invalidateCache();

    // Log activity
    await this.activityService.log({
      type: AdminActivityType.FAQ_UPDATED,
      title: 'FAQ Updated',
      message: `Updated FAQ: "${existing.question?.substring(0, 50)}..."`,
      actorId,
    });

    return faq;
  }

  async remove(id: string, actorId?: string) {
    const existing = await this.getById(id);
    await this.prisma.faq.delete({ where: { id } });

    await this.invalidateCache();

    // Log activity
    await this.activityService.log({
      type: AdminActivityType.FAQ_ARCHIVED,
      title: 'FAQ Deleted',
      message: `Deleted FAQ: "${existing.question?.substring(0, 50)}..."`,
      actorId,
    });

    return { ok: true };
  }

  /**
   * Reorder FAQs by providing an ordered list of IDs.
   * We set sortOrder = index (starting at 1).
   */
  async reorder(ids: string[]) {
    if (!ids.length) throw new BadRequestException('ids must not be empty');

    // Ensure all exist
    const found = await this.prisma.faq.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    const foundSet = new Set(found.map((x) => x.id));
    const missing = ids.filter((id) => !foundSet.has(id));
    if (missing.length)
      throw new BadRequestException(`Missing FAQ ids: ${missing.join(', ')}`);

    await this.prisma.$transaction(
      ids.map((id, idx) =>
        this.prisma.faq.update({
          where: { id },
          data: { sortOrder: idx + 1 },
        }),
      ),
    );

    await this.invalidateCache();

    return { ok: true };
  }

  async incrementViews(id: string) {
    // We update the DB but DO NOT invalidate cache.
    // View counts can be stale by a few minutes.
    const exists = await this.prisma.faq.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('FAQ not found');

    return this.prisma.faq.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }
}
