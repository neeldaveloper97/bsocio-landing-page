import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';

export enum AwardCategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class CreateAwardCategoryDto {
  @ApiProperty({ example: 'Birthday Heroes' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example:
      'Individuals who have made exceptional impact through birthday giving',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: '🎂' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: '#3B82F6' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({
    enum: AwardCategoryStatus,
    default: AwardCategoryStatus.ACTIVE,
  })
  @IsEnum(AwardCategoryStatus)
  @IsOptional()
  status?: AwardCategoryStatus;
}
