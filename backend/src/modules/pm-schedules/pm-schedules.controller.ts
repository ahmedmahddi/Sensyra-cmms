import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PMSchedulesService } from './pm-schedules.service';
import { CreatePMScheduleDto } from './dto/create-pm-schedule.dto';
import { UpdatePMScheduleDto } from './dto/update-pm-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserPayload } from '../auth/dto/user-payload.dto';

@ApiTags('PM Schedules')
@ApiBearerAuth()
@Controller('pm-schedules')
@UseGuards(JwtAuthGuard)
export class PMSchedulesController {
  constructor(private readonly pmSchedulesService: PMSchedulesService) {}

  @Post()
  create(@CurrentUser() user: UserPayload, @Body() createDto: CreatePMScheduleDto) {
    return this.pmSchedulesService.create(createDto, user.organizationId);
  }

  @Get()
  findAll(@CurrentUser() user: UserPayload) {
    return this.pmSchedulesService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    return this.pmSchedulesService.findOne(id, user.organizationId);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
    @Body() updateDto: UpdatePMScheduleDto,
  ) {
    return this.pmSchedulesService.update(id, updateDto, user.organizationId);
  }

  @Delete(':id')
  remove(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    return this.pmSchedulesService.remove(id, user.organizationId);
  }
}
