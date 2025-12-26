import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('teams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER')
  create(@Body() createTeamDto: CreateTeamDto, @CurrentUser() user: User) {
    return this.teamsService.create(createTeamDto, user.organizationId);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.teamsService.findAll(user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.teamsService.findOne(id, user.organizationId);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto, @CurrentUser() user: User) {
    return this.teamsService.update(id, updateTeamDto, user.organizationId);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.teamsService.remove(id, user.organizationId);
  }

  @Post(':id/members')
  @Roles('ADMIN', 'MANAGER')
  addMember(@Param('id') id: string, @Body() dto: AddTeamMemberDto, @CurrentUser() user: User) {
    return this.teamsService.addMember(id, dto, user.organizationId);
  }

  @Delete(':id/members/:userId')
  @Roles('ADMIN', 'MANAGER')
  removeMember(@Param('id') id: string, @Param('userId') userId: string, @CurrentUser() user: User) {
    return this.teamsService.removeMember(id, userId, user.organizationId);
  }
}
