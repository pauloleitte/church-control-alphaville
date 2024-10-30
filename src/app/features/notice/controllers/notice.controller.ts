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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateNoticeDTO } from '../dto/create-notice.dto';
import { UpdateNoticeDTO } from '../dto/update-notice.dto';
import { NoticeService } from '../services/notice.service';
import { FilterParams } from '../../../shared/utils/filter-params';

@Controller('notices')
@UseGuards(JwtAuthGuard)
export class NoticeController {
  constructor(private service: NoticeService) {}

  @Get()
  async getAll(@Query() options: FilterParams) {
    return this.service.getAll(options);
  }

  @Get('weeksAgenda')
  async weeksAgenda() {
    return this.service.weeksAgenda();
  }

  @Get('findAll')
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() notice: CreateNoticeDTO) {
    return this.service.create(notice);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() notice: UpdateNoticeDTO) {
    return this.service.findByIdAndUpdate(id, notice);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.service.findByIdAndDelete(id);
  }
}
