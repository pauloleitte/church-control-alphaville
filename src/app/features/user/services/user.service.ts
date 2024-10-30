import { HttpStatus, Injectable } from '@nestjs/common';
import { BadRequestException, HttpException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BcryptService } from '../../../shared/services/bcrypt.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../schemas/user.shema';
import { FilterParams } from '../../../shared/utils/filter-params';
import { Role } from '../../auth/enums/role.enum';
import { LessonService } from '../../lesson/services/lesson.service';

@Injectable()
export class UserService {
  LIMIT = 10;
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private bcryptService: BcryptService,
    private lessonService: LessonService,
  ) {}

  async getAll(options: FilterParams) {
    let { sort, page, name, role } = options;

    if (role) {
      return await this.getUserByRole(role);
    }

    page = page ?? 1;

    const findQuery = this.userModel
      .find({
        name: { $regex: name ?? '', $options: 'i' },
      })
      .sort({ name: sort })
      .skip((page - 1) * this.LIMIT)
      .limit(this.LIMIT)
      .select('-password -__v');

    const users = await findQuery;

    users.filter((user) => {
      //remove super users from list
      if (user.roles.includes(Role.Super)) {
        users.splice(users.indexOf(user), 1);
      }
    });

    const totalPage = users.length;
    const total = await this.userModel.count();
    const totalPages = Math.ceil(total / this.LIMIT);

    return {
      users,
      total,
      totalPage,
      page: parseInt(page as any),
      totalPages,
    };
  }

  async getUsers() {
    return await this.userModel.find().select('-password -__v');
  }

  async getById(id: string) {
    return await this.userModel.findById(id).select('-password -__v');
  }

  async getByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async create(user: CreateUserDto) {
    const userExist = await this.getByEmail(user.email);

    if (userExist) {
      throw new BadRequestException('already registered user');
    }

    await this.userModel.create({
      name: user.name,
      email: user.email,
      phone: user.phone,
      genre: user.genre,
      roles: user.roles,
      avatarUrl: '',
      tokens: [''],
      password: await this.bcryptService.encrypt(user.password),
    });

    return {
      status: HttpStatus.CREATED,
      message: 'user created',
    };
  }

  async findByIdAndUpdate(id: string, user: UpdateUserDto) {
    const exist = await this.userModel.findById(id);
    if (exist) {
      user.password
        ? (user.password = await this.bcryptService.encrypt(user.password))
        : (user.password = exist.password);

      //check if user change or remove SECRETARY_ROLE or TEACHER_ROLE
      if (
        exist.roles.includes(Role.EBDSecretary) ||
        exist.roles.includes(Role.EBDTeacher)
      ) {
        if (
          !user.roles.includes(Role.EBDSecretary) &&
          !user.roles.includes(Role.EBDTeacher)
        ) {
          const result = await this.lessonService.getAll({ userId: id });
          if (result.lessons.length > 0) {
            throw new HttpException(
              'user has lessons',
              HttpStatus.BAD_REQUEST,
              {
                cause: new Error('user has lessons'),
              },
            );
          }
        }
      }
      return await this.userModel
        .findByIdAndUpdate(id, { $set: user }, { new: true })
        .select('-password -__v');
    }
    throw new BadRequestException('user does not exist');
  }

  async delete(id: string) {
    const result = await this.lessonService.getAll({ userId: id });

    if (result.lessons.length > 0) {
      throw new HttpException('user has lessons', HttpStatus.BAD_REQUEST, {
        cause: new Error('user has lessons'),
      });
    }
    await this.userModel.findByIdAndDelete(id);
    return {
      status: HttpStatus.OK,
      message: 'user deleted',
    };
  }

  async getUserByRole(role: string) {
    return await this.userModel
      .find({ roles: role })
      .select('-password -__v -avatarUrl -tokens');
  }
}
