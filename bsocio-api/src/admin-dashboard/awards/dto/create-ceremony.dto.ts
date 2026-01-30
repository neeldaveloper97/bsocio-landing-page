import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';

export enum CeremonyStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateCeremonyDto {
  @ApiProperty({ example: 'Bsocio Hero Gala 2025' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: '2025-06-15' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'New York, United States' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({ example: 'The Waldorf Astoria' })
  @IsString()
  @IsOptional()
  venue?: string;

  @ApiPropertyOptional({
    example:
      'Annual gathering celebrating extraordinary impact and social responsibility',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/ceremony.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    enum: CeremonyStatus,
    default: CeremonyStatus.UPCOMING,
  })
  @IsEnum(CeremonyStatus)
  @IsOptional()
  status?: CeremonyStatus;
}
