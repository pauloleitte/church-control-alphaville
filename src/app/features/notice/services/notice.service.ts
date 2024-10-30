import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNoticeDTO } from '../dto/create-notice.dto';
import { UpdateNoticeDTO } from '../dto/update-notice.dto';
import { Notice } from '../schemas/notice.schemas';
import { FilterParams } from '../../../shared/utils/filter-params';

@Injectable()
export class NoticeService {
  LIMIT = 10;
  constructor(
    @InjectModel('Notice') private readonly noticeModel: Model<Notice>,
  ) {}

  async getAll(options: FilterParams) {
    let { sort, page, name } = options;

    page = page ?? 1;

    const findQuery = this.noticeModel
      .find(name ? { name: { $regex: name, $options: 'i' } } : {})
      .sort({ name: sort })
      .skip((page - 1) * this.LIMIT)
      .limit(this.LIMIT);

    const notices = await findQuery;
    const totalPage = notices.length;
    const total = await this.noticeModel.count();
    const totalPages = Math.ceil(total / this.LIMIT);

    return {
      notices,
      total,
      totalPage,
      page: parseInt(page as any),
      totalPages,
    };
  }

  async getById(id: string) {
    return await this.noticeModel.findById(id);
  }

  async create(notice: CreateNoticeDTO) {
    return await this.noticeModel.create(notice);
  }

  async findByIdAndDelete(id: string) {
    return await this.noticeModel.findByIdAndDelete(id).exec();
  }

  async findByIdAndUpdate(id: string, notice: UpdateNoticeDTO) {
    return await this.noticeModel.findByIdAndUpdate(
      id,
      { $set: notice },
      { new: true },
    );
  }

  async weeksAgenda() {
    const notices = (await this.noticeModel.find()).filter((notice) => {
      return notice.name.toLowerCase().includes('agenda');
    });
    return {
      notices,
    };
  }

  async findAll() {
    const findQuery = this.noticeModel
      .find()
      .sort({ name: 'asc' })
      .select('-__v');
    const notices = await findQuery;
    const total = await this.noticeModel.count();

    return {
      notices,
      total,
    };
  }
}
