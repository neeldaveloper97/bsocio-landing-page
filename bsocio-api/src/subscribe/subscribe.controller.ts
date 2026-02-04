import { Controller, Post, Body } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('subscribe')
@Controller('subscribe')
export class SubscribeController {
    constructor(private readonly subscribeService: SubscribeService) { }

    @Post()
    @ApiOperation({ summary: 'Subscribe to newsletter' })
    @ApiResponse({ status: 201, description: 'Subscription successful' })
    @ApiResponse({ status: 400, description: 'Invalid email' })
    subscribe(@Body() subscribeDto: SubscribeDto) {
        return this.subscribeService.subscribe(subscribeDto);
    }
}
