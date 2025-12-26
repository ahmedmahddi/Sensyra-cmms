import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { InventoryService } from './inventory.service';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserPayload } from '../auth/dto/user-payload.dto';

@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@CurrentUser() user: UserPayload, @Body() createDto: CreatePartDto) {
    return this.inventoryService.create(createDto, user.organizationId);
  }

  @Get()
  findAll(@CurrentUser() user: UserPayload) {
    return this.inventoryService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    return this.inventoryService.findOne(id, user.organizationId);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() updateDto: UpdatePartDto,
  ) {
    return this.inventoryService.update(id, updateDto, user.organizationId);
  }

  @Post(':id/adjust')
  adjustStock(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() adjustDto: AdjustStockDto,
  ) {
    return this.inventoryService.adjustStock(id, adjustDto, user.organizationId);
  }
  @Delete(':id')
  remove(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    return this.inventoryService.remove(id, user.organizationId);
  }
}
