import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { MailService } from '../lib/mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ListContactQueryDto } from './dto/list-contact.query.dto';

@Injectable()
export class ContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) { }

  async create(dto: CreateContactDto) {
    // 1-Day Debounce Rule: Check if same email + message sent in last 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existing = await this.prisma.contactInquiry.findFirst({
      where: {
        email: { equals: dto.email, mode: 'insensitive' },
        message: { equals: dto.message, mode: 'insensitive' },
        createdAt: { gte: oneDayAgo },
      },
    });

    if (existing) {
      throw new ConflictException(
        'You have already submitted this message recently. Please wait 24 hours before sending the same message again.',
      );
    }
    const inquiry = await this.prisma.contactInquiry.create({
      data: {
        reason: dto.reason,
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        country: dto.country,
        message: dto.message,
      },
    });

    // Send acknowledgement email
    try {
      await this.mailService.sendMail({
        to: dto.email,
        subject: 'We received your message - BSocio',
        html: `
          <h3>Hello ${dto.fullName},</h3>
          <p>Thank you for contacting BSocio regarding <strong>${dto.reason}</strong>.</p>
          <p>We have received your message and our team will get back to you shortly.</p>
          <br/>
          <p>Best regards,</p>
          <p>The BSocio Team</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send contact acknowledgement email:', error);
      // We don't throw here to avoid failing the inquiry creation
    }

    return inquiry;
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
