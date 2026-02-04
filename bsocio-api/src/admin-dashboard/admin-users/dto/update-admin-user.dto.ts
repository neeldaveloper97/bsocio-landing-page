import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateAdminUserDto {
  @ApiPropertyOptional({
    description: 'User role',
    enum: Role,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    description: 'Whether user is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
