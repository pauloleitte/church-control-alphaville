/* eslint-disable no-debugger */
import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterParams } from '../../../shared/utils/filter-params';
import { CreateDepartmentDTO } from '../dto/create-department.dto';
import { UpdateDepartmentDTO } from '../dto/update-department.dto';
import { Department } from '../schema/department.schema';

@Injectable()
export class DepartmentService {
  LIMIT = 10;
  constructor(
    @InjectModel('Department')
    private readonly departmentModel: Model<Department>,
  ) {}
  async getAll(options: FilterParams) {
    let { sort, page, name } = options;

    page = page ?? 1;

    const findQuery = this.departmentModel
      .find({
        name: { $regex: name ?? '', $options: 'i' },
      })
      .sort({ name: sort })
      .skip((page - 1) * this.LIMIT)
      .limit(this.LIMIT)
      .select('-__v')
      .populate([
        { path: 'members', strictPopulate: false },
        { path: 'notices', strictPopulate: false },
      ])
      .select('-__v');
    const departments = await findQuery;
    const totalPage = departments.length;
    const total = await this.departmentModel.count();
    const totalPages = Math.ceil(total / this.LIMIT);

    return {
      departments,
      total,
      totalPage,
      page: parseInt(page as any),
      totalPages,
    };
  }

  async getById(id: string) {
    return await await this.departmentModel
      .findById(id)
      .select('-__v')
      .populate([
        { path: 'members', strictPopulate: false },
        { path: 'notices', strictPopulate: false },
      ]);
  }

  async delete(id: string) {
    return await this.departmentModel.findByIdAndDelete(id);
  }

  async create(department: CreateDepartmentDTO) {
    return await this.departmentModel.create(department);
  }
  async findByIdAndUpdate(id: string, dto: UpdateDepartmentDTO) {
    try {
      const exist = await this.departmentModel.findById(id);
      if (exist) {
        return await this.departmentModel
          .findByIdAndUpdate(id, { $set: dto }, { new: true })
          .select('-__v')
          .populate([
            { path: 'members', strictPopulate: false },
            { path: 'notices', strictPopulate: false },
          ])
          .exec();
      }
      throw new BadRequestException('department does not exist');
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
