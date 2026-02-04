import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ContactReasonDto } from './create-contact.dto';

export enum ContactStatusDto {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}

export class ListContactQueryDto {
  @ApiPropertyOptional({ enum: ContactStatusDto })
  @IsOptional()
  @IsEnum(ContactStatusDto)
  status?: ContactStatusDto;

  @ApiPropertyOptional({ enum: ContactReasonDto })
  @IsOptional()
  @IsEnum(ContactReasonDto)
  reason?: ContactReasonDto;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined && value !== '' ? parseInt(value, 10) : undefined))
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined && value !== '' ? parseInt(value, 10) : undefined))
  @IsInt()
  @Min(1)
  take?: number;
}
