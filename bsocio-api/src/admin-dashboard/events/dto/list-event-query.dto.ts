import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumberString, IsIn } from 'class-validator';
import { EventStatus } from './create-event.dto';

export class ListEventQueryDto {
  @ApiPropertyOptional({
    description: 'Filter events by time',
    enum: ['upcoming', 'past', 'all'],
    default: 'all',
  })
  @IsOptional()
  @IsIn(['upcoming', 'past', 'all'])
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
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Number of items to skip',
    default: 0,
  })
  @IsOptional()
  @IsNumberString()
  skip?: string;

  @ApiPropertyOptional({
    description: 'Number of items to take',
    default: 20,
  })
  @IsOptional()
  @IsNumberString()
  take?: string;

  @ApiPropertyOptional({
    description: 'Search query',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
