import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ListEventQueryDto } from './dto/list-event-query.dto';
import { EventsService } from './events.service';

@ApiTags('admin-dashboard: events')
@Controller('admin-dashboard/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  create(@Body() dto: CreateEventDto, @Request() req: any) {
    return this.eventsService.create(dto, req.user?.userId);
  }

  @Get()
  @ApiOperation({ summary: 'List events with optional filters' })
  list(@Query() query: ListEventQueryDto) {
    return this.eventsService.list(
      query.filter,
      query.status,
      query.sortBy,
      query.sortOrder,
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get event statistics' })
  @ApiOkResponse({
    description:
      'Event statistics including upcoming, past, and total attendees',
    schema: {
      type: 'object',
      properties: {
        upcomingEvents: { type: 'number', example: 12 },
        pastEvents: { type: 'number', example: 28 },
        totalAttendees: { type: 'number', example: 156420 },
      },
    },
  })
  getStatistics() {
    return this.eventsService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  get(@Param('id') id: string) {
    return this.eventsService.getById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Patch(':id')
  @ApiOperation({ summary: 'Update an event' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Request() req: any,
  ) {
    return this.eventsService.update(id, dto, req.user?.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'CONTENT_ADMIN')
  @ApiBearerAuth('access-token')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.delete(id, req.user?.userId);
  }
}
