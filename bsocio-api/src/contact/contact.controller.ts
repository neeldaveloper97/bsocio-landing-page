import { Body, Controller, Post, Get, Query, Param, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiOperation,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ListContactQueryDto } from './dto/list-contact.query.dto';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly service: ContactService) { }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post()
  @ApiOperation({ summary: 'Submit contact inquiry' })
  @ApiCreatedResponse({
    description: 'Contact inquiry submitted successfully',
    schema: {
      example: {
        id: 'ckxyz...',
        status: 'NEW',
        createdAt: '2026-01-16T12:00:00.000Z',
      },
    },
  })
  async submit(@Body() dto: CreateContactDto) {
    const inquiry = await this.service.create(dto);
    return {
      id: inquiry.id,
      status: inquiry.status,
      createdAt: inquiry.createdAt,
    };
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'COMMUNICATIONS_ADMIN')
  @Get()
  @ApiOperation({ summary: 'List contact inquiries (admin)' })
  @ApiOkResponse({
    schema: {
      example: {
        total: 2,
        skip: 0,
        take: 20,
        items: [
          {
            id: 'ck...',
            reason: 'GENERAL_INQUIRY',
            fullName: 'John Doe',
            email: 'john@example.com',
            country: 'India',
            status: 'NEW',
            createdAt: '2026-01-16T12:00:00.000Z',
          },
        ],
      },
    },
  })
  list(@Query() query: ListContactQueryDto) {
    return this.service.list(query);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'COMMUNICATIONS_ADMIN')
  @Get(':id')
  @ApiOperation({ summary: 'Get contact inquiry by ID (admin)' })
  @ApiParam({ name: 'id' })
  get(@Param('id') id: string) {
    return this.service.getById(id);
  }
}
