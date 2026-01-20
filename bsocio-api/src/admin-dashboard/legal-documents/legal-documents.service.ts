import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  UpdateLegalDocumentDto,
  LegalDocumentTypeDto,
} from './dto/update-legal-document.dto';

@Injectable()
export class LegalDocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(type: LegalDocumentTypeDto) {
    return this.prisma.legalDocument.findUnique({
      where: { type },
    });
  }

  async upsert(type: LegalDocumentTypeDto, dto: UpdateLegalDocumentDto) {
    return this.prisma.legalDocument.upsert({
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
  }
}
