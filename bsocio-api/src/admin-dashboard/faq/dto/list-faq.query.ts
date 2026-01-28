import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import {
  FaqCategoryDto,
  FaqStateDto,
  FaqStatusDto,
  FaqVisibilityDto,
} from './create-faq.dto';

export class ListFaqQueryDto {
  @ApiPropertyOptional({ enum: FaqStateDto })
  @IsOptional()
  @IsEnum(FaqStateDto)
  state?: FaqStateDto;

  @ApiPropertyOptional({ enum: FaqStatusDto })
  @IsOptional()
  @IsEnum(FaqStatusDto)
  status?: FaqStatusDto;

  @ApiPropertyOptional({ enum: FaqVisibilityDto })
  @IsOptional()
  @IsEnum(FaqVisibilityDto)
  visibility?: FaqVisibilityDto;

  @ApiPropertyOptional({ enum: FaqCategoryDto })
  @IsOptional()
  @IsEnum(FaqCategoryDto)
  category?: FaqCategoryDto;

  @ApiPropertyOptional({
    example: 'reward',
    description: 'Search in question/answer',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  take?: number;

  @ApiPropertyOptional({
    example: 'question',
    description: 'Field to sort by (question, category, status, createdAt)',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    example: 'asc',
    description: 'Sort order (asc or desc)',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
