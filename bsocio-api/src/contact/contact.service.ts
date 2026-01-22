import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ListContactQueryDto } from './dto/list-contact.query.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    return this.prisma.contactInquiry.create({
      data: {
        reason: dto.reason,
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        country: dto.country,
        message: dto.message,
      },
    });
  }

  // 🔐 Admin: list inquiries
  async list(query: ListContactQueryDto) {
    const skip = query.skip ?? 0;
    const take = query.take ?? 20;

    const where = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.reason ? { reason: query.reason } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.contactInquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.contactInquiry.count({ where }),
    ]);

    return {
      items,
      total,
      skip,
      take,
    };
  }

  // 🔐 Admin: get single inquiry
  async getById(id: string) {
    const inquiry = await this.prisma.contactInquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      throw new NotFoundException('Contact inquiry not found');
    }

    return inquiry;
  }
}
