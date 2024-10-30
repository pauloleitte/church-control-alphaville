import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { LessonService } from '../services/lesson.service';
import { CreateLessonDTO } from '../dto/create-lesson.dto';
import { UpdateLessonDTO } from '../dto/update-lesson.dto';
import { FilterParams } from '../../../shared/utils/filter-params';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/role.decorator';
import { Role } from '../../auth/enums/role.enum';
import { RoleGuard } from '../../auth/guards/role.guard';

@Controller('lessons')
@UseGuards(JwtAuthGuard, RoleGuard)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get()
  @Roles(Role.EBDSecretary, Role.EBDTeacher, Role.EBDAdmin, Role.Super)
  async getAll(@Query() filterParams: FilterParams) {
    return this.lessonService.getAll(filterParams);
  }

  @Roles(Role.EBDAdmin, Role.Super)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.lessonService.getOne(id);
  }

  @Roles(Role.EBDAdmin, Role.Super)
  @Post()
  async create(@Body() createLessonDTO: CreateLessonDTO) {
    return this.lessonService.create(createLessonDTO);
  }

  @Roles(Role.EBDSecretary, Role.EBDTeacher, Role.EBDAdmin, Role.Super)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLessonDTO: UpdateLessonDTO,
  ) {
    return this.lessonService.update(id, updateLessonDTO);
  }

  @Roles(Role.EBDAdmin, Role.Super)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.lessonService.delete(id);
  }
}
