import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmailCampaignDto } from './dto/create-email-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEmailCampaignDto) {
    if (dto.sendType === 'SCHEDULED' && !dto.scheduledAt) {
      throw new BadRequestException(
        'scheduledAt is required for scheduled campaigns',
      );
    }

    const campaign = await this.prisma.emailCampaign.create({
      data: {
        name: dto.name,
        subject: dto.subject,
        content: dto.content,
        audience: dto.audience,
        sendType: dto.sendType,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        status: dto.sendType === 'NOW' ? 'SENT' : 'SCHEDULED',
      },
    });

    // 🔌 Future: enqueue email job here (BullMQ / SQS / SES / SendGrid)

    return campaign;
  }

  list() {
    return this.prisma.emailCampaign.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  getById(id: string) {
    return this.prisma.emailCampaign.findUnique({ where: { id } });
  }

  async saveDraft(dto: CreateEmailCampaignDto) {
    return this.prisma.emailCampaign.create({
      data: {
        ...dto,
        status: 'DRAFT',
      },
    });
  }
}
