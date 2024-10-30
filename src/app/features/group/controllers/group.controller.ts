import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from '../services/group.service';
import { UpdateGroupDTO } from '../dto/update.group.dto';
import { CreateGroupDTO } from '../dto/create-group.dto';
import { FilterParams } from 'src/app/shared/utils/filter-params';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { Roles } from '../../auth/decorators/role.decorator';
import { Role } from '../../auth/enums/role.enum';

@Controller('groups')
@Roles(Role.EBDAdmin, Role.Super, Role.EBDSecretary, Role.EBDTeacher)
@UseGuards(JwtAuthGuard, RoleGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  async getAll(@Query() options: FilterParams) {
    return await this.groupService.getAll(options);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.groupService.getById(id);
  }

  @Get(':id/teachers')
  async getTeachersByGroupId(@Param('id') id: string) {
    return await this.groupService.getTeachersByGroupId(id);
  }

  @Get(':id/students')
  async getStudentsByGroupId(@Param('id') id: string) {
    return await this.groupService.getStudentsByGroupId(id);
  }

  @Get(':id/secretaries')
  async getSecretariesByGroupId(@Param('id') id: string) {
    return await this.groupService.getSecretariesByGroupId(id);
  }

  @Post()
  async create(@Body() group: CreateGroupDTO) {
    return await this.groupService.create(group);
  }

  @Patch(':id')
  async findByIdAndUpdate(
    @Param('id') id: string,
    @Body() dto: UpdateGroupDTO,
  ) {
    return await this.groupService.findByIdAndUpdate(id, dto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.groupService.delete(id);
  }
}
