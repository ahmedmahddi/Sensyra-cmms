import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePMScheduleDto } from './dto/create-pm-schedule.dto';
import { UpdatePMScheduleDto } from './dto/update-pm-schedule.dto';

@Injectable()
export class PMSchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePMScheduleDto, organizationId: string) {
    // If nextDueDate is not provided, calculate it based on frequency (simplified)
    // For MVP we can rely on frontend or default to tomorrow if missing
    const nextDueDate = dto.nextDueDate ? new Date(dto.nextDueDate) : new Date();

    return this.prisma.pMSchedule.create({
      data: {
        ...dto,
        nextDueDate,
        organizationId,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.pMSchedule.findMany({
      where: { organizationId, deletedAt: null },
      include: {
        asset: { select: { id: true, name: true, assetTag: true } },
        procedure: { select: { id: true, name: true } },
        location: { select: { id: true, name: true } },
      },
      orderBy: { nextDueDate: 'asc' },
    });
  }

  async findOne(id: string, organizationId: string) {
    const schedule = await this.prisma.pMSchedule.findFirst({
      where: { id, organizationId, deletedAt: null },
      include: {
        asset: true,
        procedure: true,
        location: true,
      },
    });

    if (!schedule) throw new NotFoundException('PM Schedule not found');
    return schedule;
  }

  async update(id: string, dto: UpdatePMScheduleDto, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.pMSchedule.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.pMSchedule.update({
      where: { id },
      data: { 
        deletedAt: new Date(),
        isActive: false // Deactivating schedule makes sense
      },
    });
  }
}
