import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAttachmentDto, uploadedById: string) {
    return this.prisma.attachment.create({
      data: {
        ...dto,
        uploadedById,
      },
    });
  }

  async findByWorkOrder(workOrderId: string) {
    return this.prisma.attachment.findMany({
      where: { workOrderId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByWorkRequest(workRequestId: string) {
    return this.prisma.attachment.findMany({
      where: { workRequestId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const attachment = await this.prisma.attachment.findFirst({
      where: { id, deletedAt: null },
    });

    if (!attachment) throw new NotFoundException('Attachment not found');
    return attachment;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.attachment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
