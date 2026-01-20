import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { LegalDocumentsService } from './legal-documents.service';
import {
  UpdateLegalDocumentDto,
  LegalDocumentTypeDto,
} from './dto/update-legal-document.dto';

@ApiTags('admin-dashboard: legal')
@ApiBearerAuth('access-token')
@Controller('admin-dashboard/legal')
export class LegalDocumentsController {
  constructor(private readonly service: LegalDocumentsService) {}

  @Get(':type')
  @ApiOperation({ summary: 'Get legal document (privacy policy / terms)' })
  @ApiParam({ name: 'type', enum: LegalDocumentTypeDto })
  get(@Param('type') type: LegalDocumentTypeDto) {
    return this.service.get(type);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':type')
  @ApiOperation({ summary: 'Create or update legal document' })
  @ApiParam({ name: 'type', enum: LegalDocumentTypeDto })
  @ApiOkResponse({ description: 'Document saved successfully' })
  update(
    @Param('type') type: LegalDocumentTypeDto,
    @Body() dto: UpdateLegalDocumentDto,
  ) {
    return this.service.upsert(type, dto);
  }
}
