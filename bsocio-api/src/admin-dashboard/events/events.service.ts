import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminActivityService } from '../activity/admin-activity.service';
import { AdminActivityType } from '@prisma/client';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: AdminActivityService,
  ) {}

  async create(dto: CreateEventDto, actorId?: string) {
    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        eventDate: new Date(dto.eventDate),
        eventTime: dto.eventTime,
        venue: dto.venue,
        maxAttendees: dto.maxAttendees,
        imageUrl: dto.imageUrl,
        description: dto.description,
        status: dto.status || 'DRAFT',
        visibility: dto.visibility || 'PUBLIC',
      },
    });

    // Log activity
    await this.activityService.log({
      type: AdminActivityType.EVENT_CREATED,
      title: 'Event Created',
      message: `Created event: "${dto.title}"`,
      actorId,
    });

    return event;
  }

  async list(
    filter?: 'upcoming' | 'past' | 'all',
    status?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    skip?: number,
    take?: number,
    search?: string,
  ) {
    const where: any = {};

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by time (upcoming or past)
    const now = new Date();
    if (filter === 'upcoming') {
      where.eventDate = { gte: now };
    } else if (filter === 'past') {
      where.eventDate = { lt: now };
    }

    // Search
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { venue: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy
    const validSortFields = [
      'title',
      'eventDate',
      'venue',
      'status',
      'createdAt',
      'updatedAt',
    ];
    const sortField = validSortFields.includes(sortBy || '')
      ? sortBy
      : 'eventDate';
    const order = sortOrder === 'asc' ? 'asc' : 'desc';

    const actualSkip = skip ?? 0;
    const actualTake = take ?? 20;

    const [items, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        orderBy: { [sortField as string]: order },
        skip: actualSkip,
        take: actualTake,
      }),
      this.prisma.event.count({ where }),
    ]);

    return { items, total, skip: actualSkip, take: actualTake };
  }

  async getById(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async update(id: string, dto: UpdateEventDto, actorId?: string) {
    // Check if event exists
    await this.getById(id);

    const event = await this.prisma.event.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.eventDate && { eventDate: new Date(dto.eventDate) }),
        ...(dto.eventTime !== undefined && { eventTime: dto.eventTime }),
        ...(dto.venue && { venue: dto.venue }),
        ...(dto.maxAttendees !== undefined && {
          maxAttendees: dto.maxAttendees,
        }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status && { status: dto.status }),
        ...(dto.visibility && { visibility: dto.visibility }),
      },
    });

    // Log activity
    await this.activityService.log({
      type: AdminActivityType.EVENT_UPDATED,
      title: 'Event Updated',
      message: `Updated event: "${event.title}"`,
      actorId,
    });

    return event;
  }

  async delete(id: string, actorId?: string) {
    const event = await this.getById(id);

    await this.prisma.event.delete({ where: { id } });

    // Log activity
    await this.activityService.log({
      type: AdminActivityType.EVENT_DELETED,
      title: 'Event Deleted',
      message: `Deleted event: "${event.title}"`,
      actorId,
    });

    return { message: 'Event deleted successfully', deletedEvent: event };
  }

  async getStatistics() {
    const now = new Date();

    const [upcomingEvents, pastEvents, totalAttendeesResult] =
      await Promise.all([
        // Count upcoming events
        this.prisma.event.count({
          where: {
            eventDate: { gte: now },
            status: 'PUBLISHED',
          },
        }),
        // Count past events
        this.prisma.event.count({
          where: {
            eventDate: { lt: now },
            status: 'PUBLISHED',
          },
        }),
        // Sum of all current attendees
        this.prisma.event.aggregate({
          _sum: {
            currentAttendees: true,
          },
        }),
      ]);

    return {
      upcomingEvents,
      pastEvents,
      totalAttendees: totalAttendeesResult._sum.currentAttendees || 0,
    };
  }

  async updateAttendeeCount(id: string, count: number) {
    const event = await this.getById(id);

    return this.prisma.event.update({
      where: { id },
      data: { currentAttendees: count },
    });
  }
}
