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
import { CreatePrayerDTO } from '../dto/create-prayer.dto';
import { UpdatePrayerDTO } from '../dto/update-prayer.dto';
import { PrayerService } from '../services/prayer.service';
import { FilterParams } from '../../../shared/utils/filter-params';

@Controller('prayers')
export class PrayerController {
  constructor(private service: PrayerService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Query() options: FilterParams) {
    return this.service.getAll(options);
  }

  @Get('findAll')
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() prayer: CreatePrayerDTO) {
    return this.service.create(prayer);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() prayer: UpdatePrayerDTO) {
    return this.service.findByIdAndUpdate(id, prayer);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.service.findByIdAndDelete(id);
  }
}
