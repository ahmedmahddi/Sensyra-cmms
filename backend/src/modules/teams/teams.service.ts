import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTeamDto, organizationId: string) {
    return this.prisma.team.create({
      data: {
        ...dto,
        organizationId,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.team.findMany({
      where: { organizationId, deletedAt: null },
      include: {
        members: {
          include: { user: { select: { id: true, firstName: true, lastName: true } } },
        },
        _count: { select: { workOrders: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, organizationId: string) {
    const team = await this.prisma.team.findFirst({
      where: { id, organizationId, deletedAt: null },
      include: {
        members: {
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        },
        workOrders: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async update(id: string, dto: UpdateTeamDto, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.team.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.team.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async addMember(teamId: string, dto: AddTeamMemberDto, organizationId: string) {
    await this.findOne(teamId, organizationId);

    // Verify user exists in the same org
    const user = await this.prisma.user.findFirst({
      where: { id: dto.userId, organizationId },
    });
    if (!user) throw new NotFoundException('User not found in organization');

    // Check if already a member
    const existingMembership = await this.prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: dto.userId } },
    });
    if (existingMembership) throw new ConflictException('User is already a team member');

    return this.prisma.teamMember.create({
      data: {
        teamId,
        userId: dto.userId,
        role: dto.role,
      },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async removeMember(teamId: string, userId: string, organizationId: string) {
    await this.findOne(teamId, organizationId);

    const membership = await this.prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });
    if (!membership) throw new NotFoundException('Team member not found');

    return this.prisma.teamMember.delete({
      where: { teamId_userId: { teamId, userId } },
    });
  }
}
