import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLocationDto, organizationId: string) {
    await this.prisma.location
      .findFirst({
        where: { name: dto.name, organizationId },
      })
      .then((existing) => {
        if (existing) throw new BadRequestException('Location already exists');
      });
    // It's possible to have same name in different parents, but for now let's unique by org/name
    // Or actually schema might not enforce it but let's be careful.
    // Schema has @@unique not defined in snippet but likely unique name/org is good practice.

    return this.prisma.location.create({
      data: {
        ...dto,
        organizationId,
      },
      include: {
        parent: true,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.location.findMany({
      where: { organizationId },
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { assets: true, children: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, organizationId: string) {
    const location = await this.prisma.location.findFirst({
      where: { id, organizationId },
      include: {
        parent: true,
        children: true,
        assets: { take: 5 },
      },
    });

    if (!location) throw new NotFoundException('Location not found');
    return location;
  }

  async update(id: string, dto: UpdateLocationDto, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.location.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId);

    // Check for dependencies
    const childrenCount = await this.prisma.location.count({ where: { parentId: id } });
    const assetsCount = await this.prisma.asset.count({ where: { locationId: id } });

    if (childrenCount > 0 || assetsCount > 0) {
      throw new ConflictException(
        `Cannot delete location with ${childrenCount} sub-locations and ${assetsCount} assets`,
      );
    }

    return this.prisma.location.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
