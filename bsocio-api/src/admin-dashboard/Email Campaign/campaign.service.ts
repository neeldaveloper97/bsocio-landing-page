import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmailCampaignDto } from './dto/create-email-campaign.dto';

@Injectable()
export class CampaignService {
  private readonly logger = new Logger(CampaignService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('campaign') private readonly campaignQueue: Queue,
  ) { }

  async create(dto: CreateEmailCampaignDto) {
    this.logger.log(`Creating campaign: ${dto.name}, Type: ${dto.sendType}`);

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
        audience: dto.audience as any,
        sendType: dto.sendType as any,
        filters: dto.filters ? (dto.filters as any) : undefined,
        targetUserIds: dto.targetUserIds || [],
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        status: dto.sendType === 'NOW' ? 'SENT' : 'SCHEDULED', // Technically it's "PROCESSING" or "QUEUED", but keeping SENT for now or maybe "SCHEDULED" is better? Stick to original logic.
      },
    });

    this.logger.log(`Campaign created with ID: ${campaign.id}`);

    if (dto.sendType === 'NOW') {
      this.logger.log(
        `Queueing campaign ${campaign.id} for processing`,
      );
      const job = await this.campaignQueue.add('process-campaign', {
        campaignId: campaign.id,
      });
      this.logger.log(`Job added to queue with ID: ${job.id}`);
    }

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
        name: dto.name,
        subject: dto.subject,
        content: dto.content,
        audience: dto.audience as any,
        sendType: dto.sendType as any,
        filters: dto.filters ? (dto.filters as any) : undefined,
        targetUserIds: dto.targetUserIds || [],
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
        status: 'DRAFT',
      },
    });
  }
}
