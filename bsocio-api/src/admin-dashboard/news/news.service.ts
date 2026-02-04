import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminActivityService } from '../activity/admin-activity.service';
import { AdminActivityType } from '@prisma/client';
import { CreateNewsDto } from './dto/create-news.dto';

@Injectable()
export class NewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: AdminActivityService,
  ) {}

  async create(dto: CreateNewsDto, actorId?: string) {
    const article = await this.prisma.newsArticle.create({
      data: {
        ...dto,
        publicationDate: new Date(dto.publicationDate),
      },
    });

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

    return { items, total, skip: actualSkip, take: actualTake };
  }

  getById(id: string) {
    return this.prisma.newsArticle.findUnique({ where: { id } });
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

    return this.prisma.newsArticle.delete({ where: { id } });
  }
}
