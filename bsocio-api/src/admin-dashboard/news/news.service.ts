import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateNewsDto) {
    return this.prisma.newsArticle.create({
      data: {
        ...dto,
        publicationDate: new Date(dto.publicationDate),
      },
    });
  }

  list(status?: string, category?: string) {
    const where: any = {};
    if (status) where.status = status as any;
    if (category) where.category = category as any;

    return this.prisma.newsArticle.findMany({
      where,
      orderBy: { publicationDate: 'desc' },
    });
  }

  getById(id: string) {
    return this.prisma.newsArticle.findUnique({ where: { id } });
  }

  update(id: string, dto: CreateNewsDto) {
    return this.prisma.newsArticle.update({
      where: { id },
      data: {
        ...dto,
        publicationDate: new Date(dto.publicationDate),
      },
    });
  }

  archive(id: string) {
    return this.prisma.newsArticle.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
  }
}
