import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { EventStatus } from './create-event.dto';

export class ListEventQueryDto {
  @ApiPropertyOptional({
    description: 'Filter events by time',
    enum: ['upcoming', 'past', 'all'],
    default: 'all',
  })
  @IsOptional()
  @IsString()
  filter?: 'upcoming' | 'past' | 'all';

  @ApiPropertyOptional({
    description: 'Filter by event status',
    enum: EventStatus,
  })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiPropertyOptional({
    description: 'Sort by field',
    default: 'eventDate',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
