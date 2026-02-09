import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsNotPastDate', async: false })
export class IsNotPastDateConstraint implements ValidatorConstraintInterface {
  validate(dateString: string, args: ValidationArguments) {
    if (!dateString) return true;
    
    const inputDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return inputDate >= today;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Publication date cannot be in the past';
  }
}

export enum NewsCategoryDto {
  PRESS_RELEASE = 'PRESS_RELEASE',
  MEDIA_COVERAGE = 'MEDIA_COVERAGE',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  IMPACT_STORY = 'IMPACT_STORY',
  PARTNERSHIP = 'PARTNERSHIP',
}

export enum NewsStatusDto {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export class CreateNewsDto {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  title!: string;

  @ApiProperty()
  @IsString()
  author!: string;

  @ApiProperty({ enum: NewsCategoryDto })
  @IsEnum(NewsCategoryDto)
  category!: NewsCategoryDto;

  @ApiProperty({ example: '2026-01-20' })
  @IsDateString()
  @Validate(IsNotPastDateConstraint)
  publicationDate!: string;

  @ApiProperty()
  @IsString()
  featuredImage!: string;

  @ApiProperty({ example: 'Short summary (2–3 sentences)' })
  @IsString()
  excerpt!: string;

  @ApiProperty({ description: 'Markdown supported' })
  @IsString()
  content!: string;

  @ApiPropertyOptional({ example: ['impact', 'birthday heroes'] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ enum: NewsStatusDto })
  @IsEnum(NewsStatusDto)
  status!: NewsStatusDto;
}
