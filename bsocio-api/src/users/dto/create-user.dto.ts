import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
} from 'class-validator';

export enum UserRoleDto {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class CreateUserDto {
  @ApiProperty({ example: 'admin@bsocio.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ enum: UserRoleDto, default: UserRoleDto.ADMIN })
  @IsEnum(UserRoleDto)
  role!: UserRoleDto;

  @ApiProperty({
    example: '1996-01-01',
    description: 'ISO-8601 date format',
  })
  @IsDateString()
  dob!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isTermsAccepted!: boolean;
}
