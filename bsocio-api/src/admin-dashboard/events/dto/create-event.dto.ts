import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
  IsDateString,
  IsUrl,
  MaxLength,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsNotPastDate', async: false })
export class IsNotPastDateConstraint implements ValidatorConstraintInterface {
  validate(dateString: string, args: ValidationArguments) {
    if (!dateString) return true; // Let @IsNotEmpty handle empty values
    
    const inputDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day
    
    return inputDate >= today;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Event date cannot be in the past';
  }
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum EventVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export class CreateEventDto {
  @ApiProperty({ example: 'Birthday Hero Festival - New York' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: '2026-02-15' })
  @IsDateString()
  @IsNotEmpty()
  @Validate(IsNotPastDateConstraint)
  eventDate: string;

  @ApiPropertyOptional({ example: '18:00' })
  @IsString()
  @IsOptional()
  eventTime?: string;

  @ApiProperty({ example: 'Central Park, New York' })
  @IsString()
  @IsNotEmpty()
  venue: string;

  @ApiPropertyOptional({ example: 5000 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  maxAttendees?: number;

  @ApiPropertyOptional({
    example: 'https://example.com/event-image.jpg',
  })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: 'Join us for an amazing festival celebrating heroes!',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: EventStatus, default: EventStatus.DRAFT })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @ApiPropertyOptional({
    enum: EventVisibility,
    default: EventVisibility.PUBLIC,
  })
  @IsEnum(EventVisibility)
  @IsOptional()
  visibility?: EventVisibility;
}
