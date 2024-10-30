import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { FilterParams } from '../../../shared/utils/filter-params';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateDepartmentDTO } from '../dto/create-department.dto';
import { UpdateDepartmentDTO } from '../dto/update-department.dto';
import { DepartmentService } from '../services/department.service';


@Controller('departments')
@UseGuards(JwtAuthGuard)
export class DepartmentController {
  constructor(private service: DepartmentService) {}

  @Get()
  async getAll(@Query() options: FilterParams) {
    return this.service.getAll(options);
  }

  @Post()
  create(@Body() department: CreateDepartmentDTO) {
    return this.service.create(department);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() department: UpdateDepartmentDTO) {
    return this.service.findByIdAndUpdate(id, department);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
