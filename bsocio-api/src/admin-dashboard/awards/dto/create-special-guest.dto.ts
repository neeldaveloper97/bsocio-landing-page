import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';

export enum SpecialGuestStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class CreateSpecialGuestDto {
  @ApiProperty({ example: 'Dr. Jane Smith' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Keynote Speaker, Global Impact Leader' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example:
      'Dr. Jane Smith is a renowned philanthropist and social entrepreneur with over 20 years of experience in international development.',
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: 'https://example.com/guest-photo.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    enum: SpecialGuestStatus,
    default: SpecialGuestStatus.ACTIVE,
  })
  @IsEnum(SpecialGuestStatus)
  @IsOptional()
  status?: SpecialGuestStatus;
}
