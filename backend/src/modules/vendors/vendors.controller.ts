import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER')
  create(@Body() createVendorDto: CreateVendorDto, @CurrentUser() user: User) {
    return this.vendorsService.create(createVendorDto, user.organizationId);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.vendorsService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.vendorsService.findOne(id, user.organizationId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER')
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto, @CurrentUser() user: User) {
    return this.vendorsService.update(id, updateVendorDto, user.organizationId);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.vendorsService.remove(id, user.organizationId);
  }
}
