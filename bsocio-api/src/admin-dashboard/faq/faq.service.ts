import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { ListFaqQueryDto } from './dto/list-faq.query';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFaqDto) {
    return this.prisma.faq.create({ data: dto });
  }

  async list(query: any) {
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
    const take = 20;

    const [items, total] = await Promise.all([
      this.prisma.faq.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take,
      }),
      this.prisma.faq.count({ where }),
    ]);

    return { items, total, skip, take };
  }

  async getById(id: string) {
    const faq = await this.prisma.faq.findUnique({ where: { id } });
    if (!faq) throw new NotFoundException('FAQ not found');
    return faq;
  }

  async update(id: string, dto: UpdateFaqDto) {
    await this.getById(id);
    return this.prisma.faq.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.getById(id);
    await this.prisma.faq.delete({ where: { id } });
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

    return { ok: true };
  }

  async incrementViews(id: string) {
    await this.getById(id);
    return this.prisma.faq.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }
}
