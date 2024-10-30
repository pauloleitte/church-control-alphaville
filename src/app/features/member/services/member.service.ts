import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMemberDTO } from '../dto/create-member.dto';
import { UpdateMemberDTO } from '../dto/update-member.dto';
import { Member } from '../schemas/member.schema';
import { FilterParams } from '../../../shared/utils/filter-params';
import * as moment from 'moment';
@Injectable()
export class MemberService {
  LIMIT = 10;

  constructor(
    @InjectModel('Member') private readonly memberModel: Model<Member>,
  ) {}

  async getAll(options: FilterParams) {
    let { sort, page, name } = options;

    page = page ?? 1;

    const query = this.memberModel
      .find(name ? { name: { $regex: name, $options: 'i' } } : {})
      .sort({ name: sort })
      .skip((page - 1) * this.LIMIT)
      .limit(this.LIMIT)
      .select('-__v');

    const members = await query;
    const totalPage = members.length;
    const total = await this.memberModel.count();
    const totalPages = Math.ceil(total / this.LIMIT);

    return {
      members,
      total,
      totalPage,
      page: parseInt(page as any),
      totalPages,
    };
  }

  async getById(id: string) {
    return await this.memberModel.findById(id);
  }

  async create(member: CreateMemberDTO) {
    return await this.memberModel.create(member);
  }

  async findByIdAndDelete(id: string) {
    return await this.memberModel.findByIdAndDelete(id).exec();
  }

  async findByIdAndUpdate(id: string, member: UpdateMemberDTO) {
    return await this.memberModel.findByIdAndUpdate(
      id,
      { $set: member },
      { new: true },
    );
  }

  async getBirthdayOfMonth() {
    const toDay = new Date();
    const members = await this.memberModel.find();
    return members.filter((member) => {
      if (member.birthday) {
        const memberBirthday = new Date(member.birthday);
        const birthdayMonth = memberBirthday.getUTCMonth();
        const todayMonth = toDay.getUTCMonth();
        if (birthdayMonth === todayMonth) {
          return true;
        }
      }
      return false;
    });
  }

  async getBirthdayOfWeek() {
    const members = await this.memberModel.find();
    const today = moment();
    const startOfWeek = today.clone().startOf('week');
    const endOfWeek = today.clone().endOf('week');
    return members.filter((member) => {
      if (member.birthday) {
        const memberBirthday = moment(member.birthday);
        return memberBirthday.isBetween(startOfWeek, endOfWeek, null, '[]');
      }
      return false;
    });
  }
  async findAll() {
    const findQuery = this.memberModel
      .find()
      .sort({ name: 'asc' })
      .select('-__v');
    const members = await findQuery;
    const total = await this.memberModel.count();

    return {
      members,
      total,
    };
  }
}
