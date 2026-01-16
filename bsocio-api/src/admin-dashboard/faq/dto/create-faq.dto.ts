import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString, Min } from 'class-validator';

export enum FaqStateDto {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum FaqStatusDto {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum FaqVisibilityDto {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum FaqCategoryDto {
  GENERAL = 'GENERAL',
  REWARDS = 'REWARDS',
  GETTING_STARTED = 'GETTING_STARTED',
  IMPACT = 'IMPACT',
}

export class CreateFaqDto {
  @ApiProperty({ example: 'What exactly is Bsocio Like Bill Gates Movement?' })
  @IsString()
  question!: string;

  @ApiProperty({ example: 'Bsocio is a movement focused on ...' })
  @IsString()
  answer!: string;

  @ApiProperty({ enum: FaqCategoryDto, example: FaqCategoryDto.GENERAL })
  @IsEnum(FaqCategoryDto)
  category!: FaqCategoryDto;

  @ApiProperty({
    enum: FaqStateDto,
    example: FaqStateDto.PUBLISHED,
    default: FaqStateDto.DRAFT,
  })
  @IsEnum(FaqStateDto)
  state!: FaqStateDto;

  @ApiProperty({
    enum: FaqStatusDto,
    example: FaqStatusDto.ACTIVE,
    default: FaqStatusDto.ACTIVE,
  })
  @IsEnum(FaqStatusDto)
  status!: FaqStatusDto;

  @ApiProperty({
    enum: FaqVisibilityDto,
    example: FaqVisibilityDto.PUBLIC,
    default: FaqVisibilityDto.PUBLIC,
  })
  @IsEnum(FaqVisibilityDto)
  visibility!: FaqVisibilityDto;

  @ApiProperty({
    example: 1,
    description: 'Display order in the list (lower = earlier)',
  })
  @IsInt()
  @Min(0)
  sortOrder!: number;
}
