import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminActivityService } from '../activity/admin-activity.service';
import { AdminActivityType } from '@prisma/client';
import {
  UpdateLegalDocumentDto,
  LegalDocumentTypeDto,
} from './dto/update-legal-document.dto';

@Injectable()
export class LegalDocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: AdminActivityService,
  ) {}

  async get(type: LegalDocumentTypeDto) {
    return this.prisma.legalDocument.findUnique({
      where: { type },
    });
  }

  async upsert(type: LegalDocumentTypeDto, dto: UpdateLegalDocumentDto, actorId?: string) {
    const result = await this.prisma.legalDocument.upsert({
      where: { type },
      update: {
        title: dto.title,
        content: dto.content,
        versionNotes: dto.versionNotes,
        effectiveDate: new Date(dto.effectiveDate),
        state: dto.state,
      },
      create: {
        type,
        title: dto.title,
        content: dto.content,
        versionNotes: dto.versionNotes,
        effectiveDate: new Date(dto.effectiveDate),
        state: dto.state,
      },
    });

    // Log activity
    await this.activityService.log({
      type: AdminActivityType.LEGAL_UPDATED,
      title: 'Legal Document Updated',
      message: `Updated ${type === LegalDocumentTypeDto.TERMS_OF_USE ? 'Terms of Service' : 'Privacy Policy'}: "${dto.title?.substring(0, 50)}..."`,
      actorId,
    });

    return result;
  }
}
