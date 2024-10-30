import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVisitorDTO } from '../dto/create-visitor.dto';
import { UpdateVisitorDTO } from '../dto/update-visitor.dto';
import { Visitor } from '../schema/visitor.schema';
import { FilterParams } from '../../../shared/utils/filter-params';

@Injectable()
export class VisitorService {
  LIMIT = 10;
  constructor(
    @InjectModel('Visitor') private readonly visitorModel: Model<Visitor>,
  ) {}

  async getAll(options: FilterParams) {
    let { sort, page, name } = options;
    page = page ?? 1;

    const visitors = await this.visitorModel
      .find({ name: { $regex: name ?? '', $options: 'i' } })
      .sort({ name: sort })
      .skip((page - 1) * this.LIMIT)
      .limit(this.LIMIT)
      .select('-__v')
      .populate([
        { path: 'visitors', strictPopulate: false },
        { path: 'notices', strictPopulate: false },
      ])
      .select('-__v');

    const total = await this.visitorModel.count();
    const totalPages = Math.ceil(total / this.LIMIT);

    return {
      visitors,
      total,
      totalPage: visitors.length,
      page: parseInt(page as any),
      totalPages,
    };
  }

  async getById(id: string) {
    return await this.visitorModel.findById(id);
  }

  async create(visitor: CreateVisitorDTO) {
    return await this.visitorModel.create(visitor);
  }

  async findByIdAndDelete(id: string) {
    return await this.visitorModel.findByIdAndDelete(id).exec();
  }

  async findByIdAndUpdate(id: string, visitor: UpdateVisitorDTO) {
    return this.visitorModel.findByIdAndUpdate(
      id,
      { $set: visitor },
      { new: true },
    );
  }

  async findAll() {
    const visitors = await this.visitorModel
      .find()
      .sort({ name: 'asc' })
      .select('-__v');
    const total = visitors.length;
    return { visitors, total };
  }
  async findByCreatedAtToday() {
    const startOfDay = new Date().setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);
    const visitors = await this.visitorModel
      .find({ created_at: { $gte: startOfDay, $lte: endOfDay } })
      .sort({ name: 1 })
      .select('-__v')
      .lean();
    const total = visitors.length;
    return { visitors, total };
  }
}
