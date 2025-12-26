import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { WorkOrderStatus } from '@prisma/client';

@Injectable()
export class WorkOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWorkOrderDto, creatorId: string, organizationId: string) {
    // Generate simple number for MVP (should be better in prod)
    const count = await this.prisma.workOrder.count({ where: { organizationId } });
    const number = `WO-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    return this.prisma.workOrder.create({
      data: {
        ...dto,
        number,
        organizationId,
        createdById: creatorId,
        status: WorkOrderStatus.OPEN,
      },
      include: {
        assignedTo: true,
        asset: true,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.workOrder.findMany({
      where: { organizationId, deletedAt: null },
      include: {
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        asset: { select: { id: true, name: true, assetTag: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, organizationId: string) {
    const workOrder = await this.prisma.workOrder.findFirst({
      where: { id, organizationId, deletedAt: null },
      include: {
        assignedTo: true,
        asset: true,
        tasks: true,
        parts: { include: { part: true } },
        comments: { include: { author: true }, orderBy: { createdAt: 'desc' } },
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!workOrder) throw new NotFoundException('Work Order not found');
    return workOrder;
  }

  async update(id: string, dto: UpdateWorkOrderDto, userId: string, organizationId: string) {
    const workOrder = await this.findOne(id, organizationId);

    // If status changing, log it
    if (dto.status && dto.status !== workOrder.status) {
      await this.prisma.workOrderStatusHistory.create({
        data: {
          workOrderId: id,
          fromStatus: workOrder.status,
          toStatus: dto.status,
          changedById: userId,
        },
      });
    }

    return this.prisma.workOrder.update({
      where: { id },
      data: dto,
      include: {
        assignedTo: true,
        asset: true,
      },
    });
  }
  async remove(id: string, userId: string, organizationId: string) {
    const workOrder = await this.findOne(id, organizationId);
    
    // Log the deletion
    await this.prisma.workOrderStatusHistory.create({
      data: {
        workOrderId: id,
        fromStatus: workOrder.status,
        toStatus: WorkOrderStatus.CANCELLED,
        changedById: userId,
        notes: 'Work Order Deleted',
      },
    });

    return this.prisma.workOrder.update({
      where: { id },
      data: { 
        deletedAt: new Date(),
        status: WorkOrderStatus.CANCELLED, // Optional: also mark as cancelled
      },
    });
  }
}
