import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum UserRoleDto {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum GenderDto {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export class CreateUserDto {
  @ApiProperty({ example: 'admin@bsocio.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'StrongPassword123!', required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ enum: UserRoleDto, default: UserRoleDto.USER })
  @IsEnum(UserRoleDto)
  role!: UserRoleDto;

  @ApiProperty({
    example: '1996-01-01',
    description: 'ISO-8601 date format',
  })
  @IsDateString()
  dob!: string;

  @ApiPropertyOptional({ enum: GenderDto, example: 'MALE' })
  @IsOptional()
  @IsEnum(GenderDto)
  gender?: GenderDto;

  @ApiProperty({ example: true })
  @IsBoolean()
  isTermsAccepted!: boolean;
}
