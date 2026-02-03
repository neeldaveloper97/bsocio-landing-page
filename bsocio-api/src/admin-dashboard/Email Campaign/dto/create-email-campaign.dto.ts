import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum EmailAudienceDto {
  ALL_USERS = 'ALL_USERS',
  SEGMENTED_USERS = 'SEGMENTED_USERS',
  MANUAL_SELECTION = 'MANUAL_SELECTION',
}

export enum EmailSendTypeDto {
  NOW = 'NOW',
  SCHEDULED = 'SCHEDULED',
}

export class CreateEmailCampaignDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  name!: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  subject!: string;

  @ApiProperty({ description: 'HTML or Markdown email content' })
  @IsString()
  content!: string;

  @ApiProperty({ enum: EmailAudienceDto })
  @IsEnum(EmailAudienceDto)
  audience!: EmailAudienceDto;

  @ApiProperty({ enum: EmailSendTypeDto })
  @IsEnum(EmailSendTypeDto)
  sendType!: EmailSendTypeDto;

  @ApiPropertyOptional({ example: '2026-01-20T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiPropertyOptional({ description: 'Filters for segmented audience' })
  @IsOptional()
  filters?: Record<string, any>;

  @ApiPropertyOptional({ description: 'List of user IDs for manual selection' })
  @IsOptional()
  targetUserIds?: string[];
}
