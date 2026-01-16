import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminActivityType } from '@prisma/client';

@Injectable()
export class AdminActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    type: AdminActivityType;
    title: string;
    message?: string;
    actorId?: string;
  }) {
    return this.prisma.adminActivity.create({
      data: {
        type: params.type,
        title: params.title,
        message: params.message,
        actorId: params.actorId,
      },
    });
  }
}
