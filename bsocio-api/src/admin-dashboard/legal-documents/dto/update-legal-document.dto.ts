import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum LegalDocumentTypeDto {
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  TERMS_OF_USE = 'TERMS_OF_USE',
}

export enum LegalDocumentStateDto {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export class UpdateLegalDocumentDto {
  @ApiProperty({ example: 'Privacy Policy' })
  @IsString()
  title!: string;

  @ApiProperty({
    example: '# Privacy Policy\n\nYour privacy matters...',
    description: 'Markdown or HTML content',
  })
  @IsString()
  content!: string;

  @ApiProperty({
    example: 'Updated data retention section',
    required: false,
  })
  @IsOptional()
  @IsString()
  versionNotes?: string;

  @ApiProperty({ example: '2026-01-20' })
  @IsDateString()
  effectiveDate!: string;

  @ApiProperty({
    enum: LegalDocumentStateDto,
    example: LegalDocumentStateDto.DRAFT,
  })
  @IsEnum(LegalDocumentStateDto)
  state!: LegalDocumentStateDto;
}
