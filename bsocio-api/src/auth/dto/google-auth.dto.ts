import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthDto {
  @ApiProperty({ description: 'Google ID token from frontend' })
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

export class GoogleUserDto {
  @ApiProperty({ description: 'User email from Google' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User name from Google' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User profile picture URL', required: false })
  @IsString()
  @IsOptional()
  picture?: string;

  @ApiProperty({ description: 'Google user ID' })
  @IsString()
  @IsNotEmpty()
  googleId: string;
}
