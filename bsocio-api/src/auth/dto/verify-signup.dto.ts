import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class VerifySignupDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+15551234567', description: 'US phone number with +1 country code' })
  @IsString()
  @Matches(/^\+1\d{10}$/, { message: 'Phone number must be a valid US number (+1 followed by 10 digits)' })
  phoneNumber!: string;

  @ApiProperty({ example: 'https://bsocio.com/invite/abc123' })
  @IsString()
  @MinLength(5)
  invitationLink!: string;
}
