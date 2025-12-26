import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAssetDto, organizationId: string) {
    const existing = await this.prisma.asset.findUnique({
      where: {
        organizationId_assetTag: {
          organizationId,
          assetTag: dto.assetTag,
        },
      },
    });
    if (existing) throw new ConflictException('Asset Tag already exists');

    return this.prisma.asset.create({
      data: {
        ...dto,
        organizationId,
      },
      include: {
        location: true,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.asset.findMany({
      where: { organizationId, deletedAt: null },
      include: {
        location: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, organizationId: string) {
    const asset = await this.prisma.asset.findFirst({
      where: { id, organizationId, deletedAt: null },
      include: {
        location: true,
        workOrders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, number: true, title: true, status: true, priority: true },
        },
      },
    });

    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  async update(id: string, dto: UpdateAssetDto, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.asset.update({
      where: { id },
      data: dto,
      include: {
        location: true,
      },
    });
  }

  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.asset.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
