import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('attachments')
@UseGuards(JwtAuthGuard)
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post()
  create(@Body() createAttachmentDto: CreateAttachmentDto, @CurrentUser() user: User) {
    return this.attachmentsService.create(createAttachmentDto, user.id);
  }

  @Get()
  findAll(
    @Query('workOrderId') workOrderId?: string,
    @Query('workRequestId') workRequestId?: string,
  ) {
    if (workOrderId) {
      return this.attachmentsService.findByWorkOrder(workOrderId);
    }
    if (workRequestId) {
      return this.attachmentsService.findByWorkRequest(workRequestId);
    }
    return [];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attachmentsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attachmentsService.remove(id);
  }
}
