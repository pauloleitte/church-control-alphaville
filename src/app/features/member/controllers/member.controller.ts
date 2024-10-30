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
import { CreateMemberDTO } from '../dto/create-member.dto';
import { UpdateMemberDTO } from '../dto/update-member.dto';
import { MemberService } from '../services/member.service';
import { FilterParams } from '../../../shared/utils/filter-params';

@Controller('members')
@UseGuards(JwtAuthGuard)
export class MemberController {
  constructor(private service: MemberService) {}

  @Get('birthday-of-month')
  async getBirthdayOfMonth() {
    return this.service.getBirthdayOfMonth();
  }

  @Get('birthday-of-week')
  async getBirthdayOfWeek() {
    return this.service.getBirthdayOfWeek();
  }

  @Get()
  async getAll(@Query() options: FilterParams) {
    return this.service.getAll(options);
  }

  @Get('findAll')
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() member: CreateMemberDTO) {
    return this.service.create(member);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() member: UpdateMemberDTO) {
    return this.service.findByIdAndUpdate(id, member);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.service.findByIdAndDelete(id);
  }
}
