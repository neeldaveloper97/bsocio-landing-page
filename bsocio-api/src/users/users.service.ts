import { BadRequestException, Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateUserDto) {
    // Check for duplicates (case-insensitive)
    const existing = await this.prisma.user.findFirst({
      where: {
        email: { equals: dto.email, mode: 'insensitive' },
      },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    // Password is now optional - hash only if provided
    const passwordHash = dto.password ? await bcrypt.hash(dto.password, 12) : null;

    const user = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        email: dto.email,
        password: passwordHash,
        role: dto.role,
        dob: new Date(dto.dob),
        gender: dto.gender,
        isTermsAccepted: dto.isTermsAccepted,
      },
      select: { id: true, email: true, role: true, gender: true, createdAt: true },
    });

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, role: true, gender: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updatePhoneVerification(userId: string, phone: string, invitationLink: string) {
    // Get current user to check if they have all required fields
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    // For phone verification, we mark user as permanent regardless of other fields
    // Google OAuth users will be permanent after phone verification
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        phone,
        invitationLink,
        isPhoneVerified: true,
        isPermanentUser: true,
      },
      select: { id: true, email: true, role: true, phone: true, isPhoneVerified: true },
    });
  }
}
