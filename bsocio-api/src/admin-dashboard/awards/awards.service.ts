import { Injectable, NotFoundException, Inject, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminActivityService } from '../activity/admin-activity.service';
import { AdminActivityType } from '@prisma/client';
import { CreateAwardCategoryDto } from './dto/create-award-category.dto';
import { UpdateAwardCategoryDto } from './dto/update-award-category.dto';
import { CreateNomineeDto } from './dto/create-nominee.dto';
import { UpdateNomineeDto } from './dto/update-nominee.dto';
import { CreateCeremonyDto } from './dto/create-ceremony.dto';
import { UpdateCeremonyDto } from './dto/update-ceremony.dto';
import Redis from 'ioredis';

@Injectable()
export class AwardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityService: AdminActivityService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) { }

  private async invalidateCache() {
    // Invalidate everything related to awards
    /*const keys = await this.redis.keys('awards:*');
    if (keys.length > 0) {
      await this.redis.del(keys);
    }*/
  }

  // ==================== Award Categories ====================

  async createCategory(dto: CreateAwardCategoryDto, actorId?: string) {
    const existing = await this.prisma.awardCategory.findFirst({
      where: {
        name: { equals: dto.name, mode: 'insensitive' },
      },
    });

    if (existing) {
      throw new ConflictException('An award category with this name already exists.');
    }

    const category = await this.prisma.awardCategory.create({
      data: {
        name: dto.name,
        description: dto.description,
        icon: dto.icon,
        color: dto.color,
        status: dto.status || 'ACTIVE',
      },
    });

    await this.invalidateCache();

    await this.activityService.log({
      type: AdminActivityType.SYSTEM,
      title: 'Award Category Created',
      message: `Created award category: "${dto.name}"`,
      actorId,
    });

    return category;
  }

  async listCategories(status?: string, skip?: number, take?: number, search?: string) {
    const cacheKey = `awards:categories:list:${JSON.stringify({ status, skip, take, search })}`;
    /*const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached); */

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const actualSkip = skip ?? 0;
    const actualTake = take ?? 20;

    const [items, total] = await Promise.all([
      this.prisma.awardCategory.findMany({
        where,
        include: {
          _count: {
            select: { nominees: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: actualSkip,
        take: actualTake,
      }),
      this.prisma.awardCategory.count({ where }),
    ]);

    const result = { items, total, skip: actualSkip, take: actualTake };
    // await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 60);

    return result;
  }

  async getCategoryById(id: string) {
    const cacheKey = `awards:categories:detail:${id}`;
    /*const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached); */

    const category = await this.prisma.awardCategory.findUnique({
      where: { id },
      include: {
        nominees: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Award category not found');
    }

    // await this.redis.set(cacheKey, JSON.stringify(category), 'EX', 300);
    return category;
  }

  async updateCategory(
    id: string,
    dto: UpdateAwardCategoryDto,
    actorId?: string,
  ) {
    const currentCategory = await this.getCategoryById(id);

    // Check duplicate if name changes
    if (dto.name && dto.name !== currentCategory.name) {
      const existing = await this.prisma.awardCategory.findFirst({
        where: {
          name: { equals: dto.name, mode: 'insensitive' },
          id: { not: id },
        },
      });

      if (existing) {
        throw new ConflictException(
          'An award category with this name already exists.',
        );
      }
    }

    const category = await this.prisma.awardCategory.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description && { description: dto.description }),
        ...(dto.icon !== undefined && { icon: dto.icon }),
        ...(dto.color !== undefined && { color: dto.color }),
        ...(dto.status && { status: dto.status }),
      },
    });

    await this.invalidateCache();

    await this.activityService.log({
      type: AdminActivityType.SYSTEM,
      title: 'Award Category Updated',
      message: `Updated award category: "${category.name}"`,
      actorId,
    });

    return category;
  }

  async deleteCategory(id: string, actorId?: string) {
    const category = await this.getCategoryById(id);

    await this.prisma.awardCategory.delete({ where: { id } });

    await this.invalidateCache();

    await this.activityService.log({
      type: AdminActivityType.SYSTEM,
      title: 'Award Category Deleted',
      message: `Deleted award category: "${category.name}"`,
      actorId,
    });

    return {
      message: 'Award category deleted successfully',
      deletedCategory: category,
    };
  }

  // ==================== Nominees ====================

  async createNominee(dto: CreateNomineeDto, actorId?: string) {
    const existing = await this.prisma.nominee.findFirst({
      where: {
        name: { equals: dto.name, mode: 'insensitive' },
        categoryId: dto.categoryId, // Direct match (ID)
        organization: { equals: dto.organization, mode: 'insensitive' },
      },
    });

    if (existing) {
      throw new ConflictException(
        'A nominee with this name and organization already exists in this category.',
      );
    }

    const nominee = await this.prisma.nominee.create({
      data: {
        name: dto.name,
        title: dto.title,
        organization: dto.organization,
        categoryId: dto.categoryId,
        imageUrl: dto.imageUrl,
        about: dto.about,
        keyAchievements: dto.keyAchievements || [],
        impactStory: dto.impactStory,
        quote: dto.quote,
        status: dto.status || 'PENDING',
        isWinner: dto.isWinner || false,
      },
      include: {
        category: true,
      },
    });

    await this.invalidateCache();

    await this.activityService.log({
      type: AdminActivityType.SYSTEM,
      title: 'Nominee Created',
      message: `Created nominee: "${dto.name}" for category "${nominee.category.name}"`,
      actorId,
    });

    return nominee;
  }

  async listNominees(
    categoryId?: string,
    status?: string,
    isWinner?: boolean,
    skip?: number,
    take?: number,
    search?: string,
  ) {
    const cacheKey = `awards:nominees:list:${JSON.stringify({ categoryId, status, isWinner, skip, take, search })}`;
    /*const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);*/

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;
    if (isWinner !== undefined) where.isWinner = isWinner;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { organization: { contains: search, mode: 'insensitive' } },
      ];
    }

    const actualSkip = skip ?? 0;
    const actualTake = take ?? 20;

    const [items, total] = await Promise.all([
      this.prisma.nominee.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: actualSkip,
        take: actualTake,
      }),
      this.prisma.nominee.count({ where }),
    ]);

    const result = { items, total, skip: actualSkip, take: actualTake };
    // await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 60);

    return result;
  }

  async getNomineeById(id: string) {
    const cacheKey = `awards:nominees:detail:${id}`;
    /*const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);*/

    const nominee = await this.prisma.nominee.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!nominee) {
      throw new NotFoundException('Nominee not found');
    }

    // await this.redis.set(cacheKey, JSON.stringify(nominee), 'EX', 300);
    return nominee;
  }

  async updateNominee(id: string, dto: UpdateNomineeDto, actorId?: string) {
    const nominee = await this.getNomineeById(id);

    // If critical fields change, check duplicates
    const newName = dto.name ?? nominee.name;
    const newCategory = dto.categoryId ?? nominee.categoryId;
    const newOrg = dto.organization ?? nominee.organization;

    const isChanged =
      dto.name || dto.categoryId || dto.organization;

    if (isChanged) {
      const existing = await this.prisma.nominee.findFirst({
        where: {
          name: { equals: newName, mode: 'insensitive' },
          categoryId: newCategory,
          organization: { equals: newOrg, mode: 'insensitive' },
          id: { not: id },
        },
      });

      if (existing) {
        throw new ConflictException(
          'A nominee with this name and organization already exists in this category.',
        );
      }
    }

    const updatedNominee = await this.prisma.nominee.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.organization !== undefined && {
          organization: dto.organization,
        }),
        ...(dto.categoryId && { categoryId: dto.categoryId }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.about !== undefined && { about: dto.about }),
        ...(dto.keyAchievements !== undefined && {
          keyAchievements: dto.keyAchievements,
        }),
        ...(dto.impactStory !== undefined && { impactStory: dto.impactStory }),
        ...(dto.quote !== undefined && { quote: dto.quote }),
        ...(dto.status && { status: dto.status }),
        ...(dto.isWinner !== undefined && { isWinner: dto.isWinner }),
      },
      include: {
        category: true,
      },
    });

    await this.invalidateCache();

    await this.activityService.log({
      type: AdminActivityType.SYSTEM,
      title: 'Nominee Updated',
      message: `Updated nominee: "${updatedNominee.name}"`,
      actorId,
    });

    return updatedNominee;
  }

  async deleteNominee(id: string, actorId?: string) {
    const nominee = await this.getNomineeById(id);

    await this.prisma.nominee.delete({ where: { id } });

    await this.invalidateCache();

    await this.activityService.log({
      type: AdminActivityType.SYSTEM,
      title: 'Nominee Deleted',
      message: `Deleted nominee: "${nominee.name}"`,
      actorId,
    });

    return { message: 'Nominee deleted successfully', deletedNominee: nominee };
  }

  // ==================== Ceremonies ====================

  async createCeremony(dto: CreateCeremonyDto, actorId?: string) {
    const ceremony = await this.prisma.ceremony.create({
      data: {
        title: dto.title,
        date: new Date(dto.date),
        location: dto.location,
        venue: dto.venue,
        description: dto.description,
        imageUrl: dto.imageUrl,
        status: dto.status || 'UPCOMING',
      },
    });

    await this.invalidateCache();

    await this.activityService.log({
      type: AdminActivityType.SYSTEM,
      title: 'Ceremony Created',
      message: `Created ceremony: "${dto.title}"`,
      actorId,
    });

    return ceremony;
  }

  async listCeremonies(status?: string) {
    const cacheKey = `awards:ceremonies:list:${status || 'all'}`;
    /*const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached); */

    const where: any = {};
    if (status) where.status = status;

    const result = await this.prisma.ceremony.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    // await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 60);
    return result;
  }

  async getCeremonyById(id: string) {
    const cacheKey = `awards:ceremonies:detail:${id}`;
    /*const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached); */

    const ceremony = await this.prisma.ceremony.findUnique({ where: { id } });

    if (!ceremony) {
      throw new NotFoundException('Ceremony not found');
    }

    // await this.redis.set(cacheKey, JSON.stringify(ceremony), 'EX', 300);
    return ceremony;
  }

  async updateCeremony(id: string, dto: UpdateCeremonyDto, actorId?: string) {
    await this.getCeremonyById(id);

    const ceremony = await this.prisma.ceremony.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.date && { date: new Date(dto.date) }),
        ...(dto.location && { location: dto.location }),
        ...(dto.venue !== undefined && { venue: dto.venue }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.status && { status: dto.status }),
      },
    });

    await this.invalidateCache();

    await this.activityService.log({
      type: AdminActivityType.SYSTEM,
      title: 'Ceremony Updated',
      message: `Updated ceremony: "${ceremony.title}"`,
      actorId,
    });

    return ceremony;
  }

  async deleteCeremony(id: string, actorId?: string) {
    const ceremony = await this.getCeremonyById(id);

    await this.prisma.ceremony.delete({ where: { id } });

    await this.invalidateCache();

    await this.activityService.log({
      type: AdminActivityType.SYSTEM,
      title: 'Ceremony Deleted',
      message: `Deleted ceremony: "${ceremony.title}"`,
      actorId,
    });

    return {
      message: 'Ceremony deleted successfully',
      deletedCeremony: ceremony,
    };
  }

  // ==================== Special Guests ====================

  async createSpecialGuest(dto: any, actorId?: string) {
    const existing = await this.prisma.specialGuest.findFirst({
      where: {
        name: { equals: dto.name, mode: 'insensitive' },
      },
    });

    if (existing) {
      throw new ConflictException('A special guest with this name already exists.');
    }

    const guest = await this.prisma.specialGuest.create({
      data: {
        name: dto.name,
        title: dto.title,
        bio: dto.bio,
        imageUrl: dto.imageUrl,
        status: dto.status || 'ACTIVE',
      },
    });

    await this.invalidateCache();

    await this.activityService.log({
      type: AdminActivityType.SYSTEM,
      title: 'Special Guest Created',
      message: `Created special guest: "${dto.name}"`,
      actorId,
    });

    return guest;
  }

  async listSpecialGuests(
    status?: string,
    skip?: number,
    take?: number,
    search?: string,
  ) {
    const cacheKey = `awards:guests:list:${JSON.stringify({ status, skip, take, search })}`;
    /*const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);*/

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ];
    }

    const actualSkip = skip ?? 0;
    const actualTake = take ?? 20;

    const [items, total] = await Promise.all([
      this.prisma.specialGuest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: actualSkip,
        take: actualTake,
      }),
      this.prisma.specialGuest.count({ where }),
    ]);

    const result = { items, total, skip: actualSkip, take: actualTake };
    // await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 60);

    return result;
  }

  async getSpecialGuestById(id: string) {
    const cacheKey = `awards:guests:detail:${id}`;
    /*const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached); */

    const guest = await this.prisma.specialGuest.findUnique({ where: { id } });

    if (!guest) {
      throw new NotFoundException('Special guest not found');
    }

    // await this.redis.set(cacheKey, JSON.stringify(guest), 'EX', 300);
    return guest;
  }

  async updateSpecialGuest(id: string, dto: any, actorId?: string) {
    const guest = await this.getSpecialGuestById(id);

    if (dto.name && dto.name !== guest.name) {
      const existing = await this.prisma.specialGuest.findFirst({
        where: {
          name: { equals: dto.name, mode: 'insensitive' },
          id: { not: id },
        },
      });

      if (existing) {
        throw new ConflictException('A special guest with this name already exists.');
      }
    }

    const updatedGuest = await this.prisma.specialGuest.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.status && { status: dto.status }),
      },
    });

    await this.invalidateCache();

    await this.activityService.log({
      type: AdminActivityType.SYSTEM,
      title: 'Special Guest Updated',
      message: `Updated special guest: "${updatedGuest.name}"`,
      actorId,
    });

    return updatedGuest;
  }

  async deleteSpecialGuest(id: string, actorId?: string) {
    const guest = await this.getSpecialGuestById(id);

    await this.prisma.specialGuest.delete({ where: { id } });

    await this.invalidateCache();

    await this.activityService.log({
      type: AdminActivityType.SYSTEM,
      title: 'Special Guest Deleted',
      message: `Deleted special guest: "${guest.name}"`,
      actorId,
    });

    return {
      message: 'Special guest deleted successfully',
      deletedGuest: guest,
    };
  }

  // ==================== Statistics ====================

  async getStatistics() {
    const cacheKey = 'awards:statistics';
    /*const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);*/

    const [totalCategories, totalNominees, activeAwards, upcomingCeremonies] =
      await Promise.all([
        this.prisma.awardCategory.count({
          where: { status: 'ACTIVE' },
        }),
        this.prisma.nominee.count(),
        this.prisma.nominee.count({
          where: { status: 'APPROVED' },
        }),
        this.prisma.ceremony.count({
          where: { status: 'UPCOMING' },
        }),
      ]);

    const result = {
      totalCategories,
      totalNominees,
      activeAwards,
      upcomingCeremonies,
    };

    // await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 60);
    return result;
  }
}
