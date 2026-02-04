import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn, IsNumberString } from 'class-validator';

export class ListAdminUsersDto {
  @ApiPropertyOptional({
    description: 'Filter by role',
    enum: ['SUPER_ADMIN', 'CONTENT_ADMIN', 'COMMUNICATIONS_ADMIN', 'ANALYTICS_VIEWER', 'all'],
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: ['active', 'inactive', 'all'],
  })
  @IsOptional()
  @IsIn(['active', 'inactive', 'all'])
  status?: 'active' | 'inactive' | 'all';

  @ApiPropertyOptional({
    description: 'Search by name or email',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Number of items to skip',
    default: 0,
  })
  @IsOptional()
  @IsNumberString()
  skip?: string;

  @ApiPropertyOptional({
    description: 'Number of items to take',
    default: 10,
  })
  @IsOptional()
  @IsNumberString()
  take?: string;

  @ApiPropertyOptional({
    description: 'Sort by field',
    default: 'createdAt',
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
}
