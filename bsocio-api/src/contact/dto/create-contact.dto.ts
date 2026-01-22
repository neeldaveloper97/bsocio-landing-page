import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum ContactReasonDto {
  MEDIA_PRESS = 'MEDIA_PRESS',
  PARTNERSHIPS = 'PARTNERSHIPS',
  REPORT_SCAM = 'REPORT_SCAM',
  GENERAL_INQUIRY = 'GENERAL_INQUIRY',
}

export class CreateContactDto {
  @ApiProperty({ enum: ContactReasonDto })
  @IsEnum(ContactReasonDto)
  reason!: ContactReasonDto;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  fullName!: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+1 (555) 123-4567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'India' })
  @IsString()
  country!: string;

  @ApiProperty({
    example: 'I would like to inquire about partnerships...',
  })
  @IsString()
  @MinLength(10)
  message!: string;
}
