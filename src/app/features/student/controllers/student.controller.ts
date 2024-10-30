import { Controller, Get, Post, Delete, Param, Body, Query, Patch, UseGuards } from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { CreateStudentDTO } from '../dto/create-student.dto';
import { UpdateStudentDTO } from '../dto/update-student.dto';
import { FilterParams } from '../../../shared/utils/filter-params';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/role.decorator';
import { Role } from '../../auth/enums/role.enum';
import { RoleGuard } from '../../auth/guards/role.guard';

@Controller('students')
@Roles(Role.EBDAdmin, Role.Super)
@UseGuards(JwtAuthGuard, RoleGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async getAll(@Query() filterParams: FilterParams) {
    return this.studentService.getAll(filterParams);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.studentService.getOne(id);
  }

  @Post()
  async create(@Body() createStudentDTO: CreateStudentDTO) {
    return this.studentService.create(createStudentDTO);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStudentDTO: UpdateStudentDTO) {
    return this.studentService.update(id, updateStudentDTO);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.studentService.delete(id);
  }
}