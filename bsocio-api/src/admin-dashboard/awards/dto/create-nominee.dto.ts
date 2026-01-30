import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  MaxLength,
} from 'class-validator';

export enum NomineeStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class CreateNomineeDto {
  @ApiProperty({ example: 'Dr. Sarah Chen' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Founder, Global Food Initiative' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Global Food Initiative' })
  @IsString()
  @IsOptional()
  organization?: string;

  @ApiProperty({ example: 'clxy123abc456' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({ example: 'https://example.com/nominee.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: 'A visionary leader in global nutrition and food security',
  })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiPropertyOptional({
    example: [
      'Founded 3 community health centers',
      'Trained over 5,000 community health workers',
    ],
  })
  @IsArray()
  @IsOptional()
  keyAchievements?: string[];

  @ApiPropertyOptional({
    example:
      "Sarah's work has created sustainable healthcare that will help children build a healthier future",
  })
  @IsString()
  @IsOptional()
  impactStory?: string;

  @ApiPropertyOptional({
    example:
      'Every child deserves the nutrient they need to grow, thrive, and reach their full potential',
  })
  @IsString()
  @IsOptional()
  quote?: string;

  @ApiPropertyOptional({ enum: NomineeStatus, default: NomineeStatus.PENDING })
  @IsEnum(NomineeStatus)
  @IsOptional()
  status?: NomineeStatus;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isWinner?: boolean;
}
