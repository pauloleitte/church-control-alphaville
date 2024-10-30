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
import { FilterParams } from 'src/app/shared/utils/filter-params';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateVisitorDTO } from '../dto/create-visitor.dto';
import { UpdateVisitorDTO } from '../dto/update-visitor.dto';
import { VisitorService } from '../services/visitor.service';

@Controller('visitors')
@UseGuards(JwtAuthGuard)
export class VisitorController {
  constructor(private service: VisitorService) {}

  @Get()
  async getAll(@Query() options: FilterParams) {
    return this.service.getAll(options);
  }

  @Get('findAll')
  async findAll() {
    return this.service.findAll();
  }

  @Get('findByCreateAtToday')
  async findByCreatedAtToday() {
    return this.service.findByCreatedAtToday();
  }

  @Post()
  async create(@Body() visitor: CreateVisitorDTO) {
    return this.service.create(visitor);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() visitor: UpdateVisitorDTO) {
    return this.service.findByIdAndUpdate(id, visitor);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.service.findByIdAndDelete(id);
  }
}
