import { Injectable, NotFoundException, Inject, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminActivityService } from '../activity/admin-activity.service';
import { AdminActivityType } from '@prisma/client';
import { CreateNewsDto } from './dto/create-news.dto';
import Redis from 'ioredis';

@Injectable()
export class NewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: AdminActivityService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) { }

  private async invalidateCache() {
    /*const keys = await this.redis.keys('news:*');
    if (keys.length > 0) {
      await this.redis.del(keys);
    }*/
  }

  async create(dto: CreateNewsDto, actorId?: string) {
    // 1. Check for duplicates (same title case-insensitive)
    const existing = await this.prisma.newsArticle.findFirst({
      where: {
        title: { equals: dto.title, mode: 'insensitive' },
      },
    });

    if (existing) {
      // 2. If it exists but is ARCHIVED, restore it (UnArchive)
      if (existing.status === 'ARCHIVED') {
        const restored = await this.prisma.newsArticle.update({
          where: { id: existing.id },
          data: {
            ...dto,
            publicationDate: new Date(dto.publicationDate),
            status: dto.status || 'DRAFT', // Bring it back to life
          },
        });

        await this.invalidateCache();

        await this.activityService.log({
          type: AdminActivityType.NEWS_UPDATED,
          title: 'News Unarchived',
          message: `Unarchived and updated news article: "${dto.title}"`,
          actorId,
        });

        return restored;
      }

      // 3. If it exists and is not ARCHIVED, block duplicate
      throw new ConflictException('A news article with this title already exists.');
    }

    const article = await this.prisma.newsArticle.create({
      data: {
        ...dto,
        publicationDate: new Date(dto.publicationDate),
      },
    });

    // Invalidate cache
    await this.invalidateCache();

    // Log activity
    await this.activityService.log({
      type: AdminActivityType.NEWS_CREATED,
      title: 'News Created',
      message: `Created news article: "${dto.title?.substring(0, 50)}..."`,
      actorId,
    });

    return article;
  }

  async list(
    status?: string,
    category?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    skip?: number,
    take?: number,
    search?: string,
  ) {
    // Generate cache key based on params
    const cacheKey = `news:list:${JSON.stringify({
      status, category, sortBy, sortOrder, skip, take, search
    })}`;

    // 1. Try to get from cache
    /*const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }*/

    const where: any = {};
    if (status) where.status = status as any;
    if (category) where.category = category as any;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy based on sortBy and sortOrder params
    const validSortFields = [
      'title',
      'category',
      'author',
      'publicationDate',
      'status',
      'views',
      'createdAt',
    ];
    const sortField = validSortFields.includes(sortBy || '')
      ? sortBy
      : 'publicationDate';
    const order = sortOrder === 'asc' ? 'asc' : 'desc';

    const actualSkip = skip ?? 0;
    const actualTake = take ?? 20;

    const [items, total] = await Promise.all([
      this.prisma.newsArticle.findMany({
        where,
        orderBy: { [sortField as string]: order },
        skip: actualSkip,
        take: actualTake,
      }),
      this.prisma.newsArticle.count({ where }),
    ]);

    const result = { items, total, skip: actualSkip, take: actualTake };

    // 2. Save to cache (TTL: 60 seconds)
    // await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 60);

    return result;
  }

  async getById(id: string) {
    const cacheKey = `news:detail:${id}`;

    // 1. Try cache
    /*const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }*/

    const article = await this.prisma.newsArticle.findUnique({ where: { id } });

    if (article) {
      // 2. Save cache (TTL: 5 mins for details)
      // await this.redis.set(cacheKey, JSON.stringify(article), 'EX', 300);
    }

    return article;
  }

  async update(id: string, dto: CreateNewsDto, actorId?: string) {
    const existing = await this.getById(id);
    const article = await this.prisma.newsArticle.update({
      where: { id },
      data: {
        ...dto,
        publicationDate: new Date(dto.publicationDate),
      },
    });

    // Invalidate cache
    await this.invalidateCache();

    // Log activity
    await this.activityService.log({
      type: AdminActivityType.NEWS_UPDATED,
      title: 'News Updated',
      message: `Updated news article: "${existing?.title?.substring(0, 50) || dto.title?.substring(0, 50)}..."`,
      actorId,
    });

    return article;
  }

  async archive(id: string, actorId?: string) {
    const existing = await this.getById(id);
    const article = await this.prisma.newsArticle.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });

    // Invalidate cache
    await this.invalidateCache();

    // Log activity
    await this.activityService.log({
      type: AdminActivityType.NEWS_ARCHIVED,
      title: 'News Archived',
      message: `Archived news article: "${existing?.title?.substring(0, 50)}..."`,
      actorId,
    });

    return article;
  }
  async delete(id: string) {
    const existing = await this.prisma.newsArticle.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('News article not found');

    await this.prisma.newsArticle.delete({ where: { id } });

    // Invalidate cache
    await this.invalidateCache();

    return existing;
  }
}
