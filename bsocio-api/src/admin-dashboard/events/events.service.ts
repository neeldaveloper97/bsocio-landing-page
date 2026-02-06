import { Injectable, NotFoundException, Inject, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminActivityService } from '../activity/admin-activity.service';
import { AdminActivityType } from '@prisma/client';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import Redis from 'ioredis';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: AdminActivityService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) { }

  private async invalidateCache() {
    /*const keys = await this.redis.keys('events:*');
    if (keys.length > 0) {
      await this.redis.del(keys);
    }*/
  }

  async create(dto: CreateEventDto, actorId?: string) {
    // Check for duplicates: Title + Date + Time + Venue must be unique
    const existing = await this.prisma.event.findFirst({
      where: {
        title: { equals: dto.title, mode: 'insensitive' },
        eventDate: new Date(dto.eventDate),
        eventTime: dto.eventTime,
        venue: { equals: dto.venue, mode: 'insensitive' },
      },
    });

    if (existing) {
      throw new ConflictException(
        'An event with this title, date, time, and venue already exists.',
      );
    }

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

    // Invalidate cache
    await this.invalidateCache();

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
    // Generate cache key
    const cacheKey = `events:list:${JSON.stringify({
      filter, status, sortBy, sortOrder, skip, take, search
    })}`;

    // 1. Try cache
    /*const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }*/

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

    const result = { items, total, skip: actualSkip, take: actualTake };

    // 2. Save cache (TTL: 60s)
    // await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 60);

    return result;
  }

  async getById(id: string) {
    const cacheKey = `events:detail:${id}`;

    // 1. Try cache
    /*const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }*/

    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // 2. Save cache (TTL: 5m)
    // await this.redis.set(cacheKey, JSON.stringify(event), 'EX', 300);

    return event;
  }

  async update(id: string, dto: UpdateEventDto, actorId?: string) {
    // Check if event exists
    const event = await this.getById(id);

    // If any key field is changing, check for collisions
    const newTitle = dto.title ?? event.title;
    const newDate = dto.eventDate ? new Date(dto.eventDate) : event.eventDate;
    const newTime = dto.eventTime ?? event.eventTime;
    const newVenue = dto.venue ?? event.venue;

    const isKeyFieldChanged =
      dto.title || dto.eventDate || dto.eventTime || dto.venue;

    if (isKeyFieldChanged) {
      const existing = await this.prisma.event.findFirst({
        where: {
          title: { equals: newTitle, mode: 'insensitive' },
          eventDate: newDate,
          eventTime: newTime,
          venue: { equals: newVenue, mode: 'insensitive' },
          id: { not: id }, // Exclude self
        },
      });

      if (existing) {
        throw new ConflictException(
          'Another event with this title, date, time, and venue already exists.',
        );
      }
    }

    const updatedEvent = await this.prisma.event.update({
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

    // Invalidate cache
    await this.invalidateCache();

    // Log activity
    await this.activityService.log({
      type: AdminActivityType.EVENT_UPDATED,
      title: 'Event Updated',
      message: `Updated event: "${updatedEvent.title}"`,
      actorId,
    });

    return updatedEvent;
  }

  async delete(id: string, actorId?: string) {
    const event = await this.getById(id);

    await this.prisma.event.delete({ where: { id } });

    // Invalidate cache
    await this.invalidateCache();

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
    const cacheKey = 'events:statistics';

    // 1. Try cache
    /*const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }*/

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

    const result = {
      upcomingEvents,
      pastEvents,
      totalAttendees: totalAttendeesResult._sum.currentAttendees || 0,
    };

    // 2. Save cache (TTL: 60s)
    // await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 60);

    return result;
  }

  async updateAttendeeCount(id: string, count: number) {
    const event = await this.getById(id);

    const result = await this.prisma.event.update({
      where: { id },
      data: { currentAttendees: count },
    });

    // Invalidate cache
    await this.invalidateCache();

    return result;
  }
}
