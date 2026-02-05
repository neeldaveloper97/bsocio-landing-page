import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubscribeDto {
    @ApiProperty({ example: 'user@example.com', description: 'Email address to subscribe' })
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
