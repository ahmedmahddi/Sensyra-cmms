import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { MovementType, Prisma } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePartDto, organizationId: string) {
    if (dto.barcode) {
      const existing = await this.prisma.part.findFirst({
        where: { barcode: dto.barcode, organizationId },
      });
      if (existing) throw new BadRequestException('Barcode already exists');
    }

    return this.prisma.part.create({
      data: {
        ...dto,
        organizationId,
      },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.part.findMany({
      where: { organizationId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, organizationId: string) {
    const part = await this.prisma.part.findFirst({
      where: { id, organizationId },
      include: {
        stockMovements: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!part) throw new NotFoundException('Part not found');
    return part;
  }

  async update(id: string, dto: UpdatePartDto, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.part.update({
      where: { id },
      data: dto,
    });
  }

  async adjustStock(id: string, dto: AdjustStockDto, organizationId: string) {
    const part = await this.findOne(id, organizationId);

    let newQuantity = part.quantity;
    if (dto.type === MovementType.IN) {
      newQuantity += dto.quantity;
    } else if (dto.type === MovementType.OUT) {
      if (part.quantity < dto.quantity) throw new BadRequestException('Insufficient stock');
      newQuantity -= dto.quantity;
    } else if (dto.type === MovementType.ADJUSTMENT) {
      newQuantity = dto.quantity; // Set absolute value
    }

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create movement record
      await tx.stockMovement.create({
        data: {
          partId: id,
          type: dto.type,
          quantity: dto.quantity, // For adjustment this might be ambiguous, usually diff, but let's store raw input or diff
          // Actually for logic above:
          // IN: +qty
          // OUT: -qty
          // ADJUSTMENT: new total.
          // Movement table usually tracks the *change* or the *absolute* depending on design.
          // Schema says "quantity", "beforeQty", "afterQty".
          // Let's calculated the change for the 'quantity' field if type is adjustment.

          beforeQty: part.quantity,
          afterQty: newQuantity,

          notes: dto.notes,
          referenceType: dto.referenceType,
          referenceId: dto.referenceId,
        },
      });

      // Update part
      return tx.part.update({
        where: { id },
        data: { quantity: newQuantity },
      });
    });
  }
  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId);
    return this.prisma.part.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
