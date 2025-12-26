import { Controller, Get, Post, Body, Patch, Param, UseGuards, Delete } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { WorkOrdersService } from './work-orders.service';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserPayload } from '../auth/dto/user-payload.dto';

@ApiTags('Work Orders')
@ApiBearerAuth()
@Controller('work-orders')
@UseGuards(JwtAuthGuard)
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Post()
  create(@CurrentUser() user: UserPayload, @Body() createDto: CreateWorkOrderDto) {
    return this.workOrdersService.create(createDto, user.userId, user.organizationId);
  }

  @Get()
  findAll(@CurrentUser() user: UserPayload) {
    return this.workOrdersService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    return this.workOrdersService.findOne(id, user.organizationId);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() updateDto: UpdateWorkOrderDto,
  ) {
    return this.workOrdersService.update(id, updateDto, user.userId, user.organizationId);
  }
  @Delete(':id')
  remove(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    return this.workOrdersService.remove(id, user.userId, user.organizationId);
  }
}
