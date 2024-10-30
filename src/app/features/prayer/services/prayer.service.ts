import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePrayerDTO } from '../dto/create-prayer.dto';
import { UpdatePrayerDTO } from '../dto/update-prayer.dto';
import { Prayer } from '../schemas/prayer.schemas';
import { FilterParams } from '../../../shared/utils/filter-params';
import { UserService } from '../../user/services/user.service';
import {
  ISendFirebaseMessages,
  NotificationsService,
} from 'src/app/shared/services/notification.service';

@Injectable()
export class PrayerService {
  LIMIT = 10;
  constructor(
    @InjectModel('Prayer') private readonly prayerModel: Model<Prayer>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationsService,
  ) {}

  async getAll(options: FilterParams) {
    let { sort, page, name } = options;

    page = page ?? 1;

    const findQuery = this.prayerModel
      .find(name ? { name: { $regex: name, $options: 'i' } } : {})
      .sort({ name: sort })
      .skip((page - 1) * this.LIMIT)
      .limit(this.LIMIT);

    const prayers = await findQuery;
    const totalPage = prayers.length;
    const total = await this.prayerModel.count();
    const totalPages = Math.ceil(total / this.LIMIT);

    return {
      prayers,
      total,
      totalPage,
      page: parseInt(page as any),
      totalPages,
    };
  }

  async getById(id: string) {
    return await this.prayerModel.findById(id);
  }

  async create(prayer: CreatePrayerDTO) {
    const admins = (await this.userService.getUsers())?.filter((u) =>
      u.roles.includes('super'),
    );

    const messages: ISendFirebaseMessages[] = [];

    admins.forEach((admin) => {
      if (admin.tokens && admin.tokens.length > 0) {
        admin.tokens.forEach(async (t) => {
          messages.push({
            token: t,
            title: `Pedido de Oração`,
            message: `Novo pedido de oração criado`,
          });
        });
      }
    });

    const response = await this.notificationService.sendFirebaseMessages(
      messages,
    );
    console.log('RESPONSE FIREBASE MESSAGES', response);
    return await this.prayerModel.create(prayer);
  }

  async findByIdAndDelete(id: string) {
    return await this.prayerModel.findByIdAndDelete(id).exec();
  }

  async findByIdAndUpdate(id: string, prayer: UpdatePrayerDTO) {
    return await this.prayerModel.findByIdAndUpdate(
      id,
      { $set: prayer },
      { new: true },
    );
  }

  async findAll() {
    const findQuery = this.prayerModel
      .find()
      .sort({ name: 'asc' })
      .select('-__v');
    const prayers = await findQuery;
    const total = await this.prayerModel.count();

    return {
      prayers,
      total,
    };
  }
}
