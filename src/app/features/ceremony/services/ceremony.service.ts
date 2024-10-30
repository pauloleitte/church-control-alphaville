import {
  ISendFirebaseMessages,
  NotificationsService,
} from '../../../shared/services/notification.service';
import { FilterParams } from '../../../shared/utils/filter-params';
import { UserService } from '../../user/services/user.service';
/* eslint-disable no-debugger */
import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CeremonyOfDayDTO } from '../dto/ceremony-of-day.dto';
import { CreateCeremonyDTO } from '../dto/create-ceremony.dto';
import { UpdateCeremonyDTO } from '../dto/update-ceremony.dto';
import { Ceremony } from '../schema/ceremony.schema';

@Injectable()
export class CeremonyService {
  LIMIT = 10;

  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationsService,
    @InjectModel('Ceremony') private readonly ceremonyModel: Model<Ceremony>,
  ) {}
  async getAll(options: FilterParams) {
    let { sort, page, name } = options;

    page = page ?? 1;

    const findQuery = this.ceremonyModel
      .find({
        name: { $regex: name ?? '', $options: 'i' },
      })
      .sort({ name: sort })
      .skip((page - 1) * this.LIMIT)
      .limit(this.LIMIT)
      .select('-__v')
      .populate([
        { path: 'visitors', strictPopulate: false },
        { path: 'notices', strictPopulate: false },
        { path: 'prayers', strictPopulate: false },
      ])
      .select('-__v');
    const ceremonies = await findQuery;
    const totalPage = ceremonies.length;
    const total = await this.ceremonyModel.count();
    const totalPages = Math.ceil(total / this.LIMIT);

    return {
      ceremonies,
      total,
      totalPage,
      page: parseInt(page as any),
      totalPages,
    };
  }

  async getById(id: string) {
    return await await this.ceremonyModel
      .findById(id)
      .select('-__v')
      .populate([
        { path: 'visitors', strictPopulate: false },
        { path: 'notices', strictPopulate: false },
        { path: 'prayers', strictPopulate: false },
      ]);
  }

  async delete(id: string) {
    return await this.ceremonyModel.findByIdAndDelete(id);
  }

  async create(ceremony: CreateCeremonyDTO) {
    return await this.ceremonyModel.create(ceremony);
  }

  async findByIdAndUpdate(id: string, dto: UpdateCeremonyDTO) {
    try {
      const exist = await this.ceremonyModel.findById(id);
      if (exist) {
        const admins = (await this.userService.getUsers())?.filter((u) =>
          u.roles.includes('super'),
        );

        const messages: ISendFirebaseMessages[] = [];

        admins.forEach((admin) => {
          if (admin.tokens && admin.tokens.length > 0) {
            admin.tokens.forEach(async (t) => {
              messages.push({
                token: t,
                title: `Atualização`,
                message: `Aviso/Visitante em ${exist.name}`,
              });
            });
          }
        });

        const response = await this.notificationService.sendFirebaseMessages(
          messages,
        );
        console.log('RESPONSE FIREBASE MESSAGES', response);

        return await this.ceremonyModel
          .findByIdAndUpdate(id, { $set: dto }, { new: true })
          .select('-__v')
          .populate([
            { path: 'visitors', strictPopulate: false },
            { path: 'notices', strictPopulate: false },
            { path: 'prayers', strictPopulate: false },
          ])
          .exec();
      }
      throw new BadRequestException('ceremony does not exist');
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getCeremoniesOfDay(dto: CeremonyOfDayDTO) {
    const startOfDay = new Date(dto.date + 'T00:00:00.000Z');
    const endOfDay = new Date(dto.date + 'T23:59:59.999Z');
    const query = this.ceremonyModel
      .find({
        date: { $gte: startOfDay, $lte: endOfDay },
      })
      .populate([
        { path: 'visitors', strictPopulate: false },
        { path: 'notices', strictPopulate: false },
        { path: 'prayers', strictPopulate: false },
      ])
      .select('-__v');
    const ceremonies = await query;
    return { ceremonies };
  }
}
