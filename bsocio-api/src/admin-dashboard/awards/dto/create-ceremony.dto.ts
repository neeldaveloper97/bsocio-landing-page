import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsNotPastDate', async: false })
export class IsNotPastDateConstraint implements ValidatorConstraintInterface {
  validate(dateString: string, args: ValidationArguments) {
    if (!dateString) return true;
    
    const inputDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return inputDate >= today;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Ceremony date cannot be in the past';
  }
}

export enum CeremonyStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateCeremonyDto {
  @ApiProperty({ example: 'Bsocio Hero Gala 2025' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: '2025-06-15' })
  @IsDateString()
  @IsNotEmpty()
  @Validate(IsNotPastDateConstraint)
  date: string;

  @ApiProperty({ example: 'New York, United States' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiPropertyOptional({ example: 'The Waldorf Astoria' })
  @IsString()
  @IsOptional()
  venue?: string;

  @ApiPropertyOptional({
    example:
      'Annual gathering celebrating extraordinary impact and social responsibility',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/ceremony.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    enum: CeremonyStatus,
    default: CeremonyStatus.UPCOMING,
  })
  @IsEnum(CeremonyStatus)
  @IsOptional()
  status?: CeremonyStatus;
}
