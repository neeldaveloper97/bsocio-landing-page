import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateUserRoleDto {
    @ApiProperty({ enum: Role, description: 'The new role to assign to the user' })
    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;
}
