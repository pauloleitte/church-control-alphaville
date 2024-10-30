import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group } from '../schemas/group.schema';
import { FilterParams } from '../../../shared/utils/filter-params';
import { CreateGroupDTO } from '../dto/create-group.dto';
import { UpdateGroupDTO } from '../dto/update.group.dto';

@Injectable()
export class GroupService {
  LIMIT = 50;
  constructor(
    @InjectModel('Group')
    private readonly groupModel: Model<Group>,
  ) {}

  async getAll(options: FilterParams) {
    let { sort, page, name, userId } = options;

    if (userId) {
      return await this.getGroupsIdByUserId(userId);
    }

    page = page ?? 1;

    const findQuery = this.groupModel
      .find({
        name: { $regex: name ?? '', $options: 'i' },
      })
      .sort({ name: sort })
      .skip((page - 1) * this.LIMIT)
      .limit(this.LIMIT)
      .select('-__v')
      .populate('lessons', 'name description offerValue')
      .populate('students', 'name')
      .populate('teachers', 'name email phone')
      .populate('secretaries', 'name email phone')
      .select('-__v');
    const groups = await findQuery;
    const totalPage = groups.length;
    const total = await this.groupModel.count();
    const totalPages = Math.ceil(total / this.LIMIT);

    return {
      groups,
      total,
      totalPage,
      page: parseInt(page as any),
      totalPages,
    };
  }

  async getById(id: string) {
    return await await this.groupModel
      .findById(id)
      .select('-__v')
      .select('-__v')
      .populate('students', 'name')
      .populate('teachers', 'name email phone')
      .populate('secretaries', 'name email phone')
      .populate('lessons', 'name description offerValue')
      .exec();
  }

  async create(group: CreateGroupDTO) {
    return await this.groupModel.create(group);
  }

  async findByIdAndUpdate(id: string, dto: UpdateGroupDTO) {
    const exist = await this.groupModel.findById(id);
    if (exist) {
      return await this.groupModel
        .findByIdAndUpdate(id, { $set: dto }, { new: true })
        .select('-__v')
        .populate([
          { path: 'students', strictPopulate: false },
          { path: 'teachers', strictPopulate: false },
          { path: 'secretaries', strictPopulate: false },
        ])
        .exec();
    }
    throw new BadRequestException('group does not exist');
  }

  async getTeachersByGroupId(id: string) {
    return await this.groupModel
      .findById(id)
      .populate('teachers', 'name email phone')
      .select('teachers');
  }

  async getStudentsByGroupId(id: string) {
    return await this.groupModel
      .findById(id)
      .populate('students', 'name email phone')
      .select('students');
  }

  async getSecretariesByGroupId(id: string) {
    return await this.groupModel
      .findById(id)
      .populate('secretaries', 'name email phone')
      .select('secretaries');
  }

  async getGroupsIdByUserId(id: string) {
    const groups = await this.groupModel
      .find()
      .populate('lessons', 'name description offerValue')
      .populate('students', 'name')
      .populate('teachers', 'name email phone')
      .populate('secretaries', 'name email phone');
    return groups.filter((group) => {
      return (
        group.teachers.some((teacher) => teacher['_id'] == id) ||
        group.secretaries.some((secretary) => secretary['_id'] == id)
      );
    });
  }

  async delete(id: string) {
    return await this.groupModel.findByIdAndDelete(id);
  }
}
