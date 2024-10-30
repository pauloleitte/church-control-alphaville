import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Lesson } from '../schemas/lesson.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterParams } from '../../../shared/utils/filter-params';
import { CreateLessonDTO } from '../dto/create-lesson.dto';
import { UpdateLessonDTO } from '../dto/update-lesson.dto';
import { GroupService } from '../../group/services/group.service';

@Injectable()
export class LessonService {
  private readonly LIMIT = 10;

  constructor(
    @InjectModel('Lesson') private readonly lessonModel: Model<Lesson>,
    private readonly groupService: GroupService,
  ) {}

  async getAll(options: FilterParams) {
    try {
      let { sort, page, name, userId, groupId, date } = options;

      if (date) {
        return await this.getLessonsByDate(options);
      }

      if (userId) {
        return await this.getLessonsByUserId(options);
      }

      if (groupId) {
        return await this.getLessonsByGroupId(options);
      }

      page = Number(page) ?? 1;

      const total = await this.lessonModel.countDocuments();
      const totalPages = Math.ceil(total / this.LIMIT);

      if (totalPages === 0) {
        return {
          lessons: [],
          total: 0,
          totalPage: 0,
          page: 0,
          totalPages: 0,
        };
      }

      const lessons = await this.lessonModel
        .find({
          name: { $regex: name ?? '', $options: 'i' },
        })
        .sort({ name: sort })
        .skip((page - 1) * this.LIMIT)
        .limit(this.LIMIT)
        .populate('group', 'name')
        .populate('teacher', 'name email phone')
        .populate('secretary', 'name email phone')
        .select('-__v')
        .lean();

      const totalPage = lessons.length;

      return {
        lessons,
        total,
        totalPage,
        page,
        totalPages,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching lessons',
        error.message,
      );
    }
  }

  async getOne(id: string) {
    try {
      const lesson = await this.lessonModel
        .findById(id)
        .populate('group', 'name')
        .populate('teacher', 'name email phone')
        .populate('secretary', 'name email phone')
        .lean();
      if (!lesson) {
        throw new NotFoundException(`lesson with ID ${id} not found`);
      }
      return lesson;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching lesson',
        error.message,
      );
    }
  }

  async create(createLessonDTO: CreateLessonDTO) {
    try {
      const lesson = new this.lessonModel(createLessonDTO);
      const lessonSaved = await lesson.save();

      const group = await this.groupService.getById(createLessonDTO.group);
      const lessons = group.lessons.map((lesson) => lesson['_id'].toString());

      const isLessonExistsInGroup = group.lessons.find(
        (lesson) => lesson['_id'].toString() === lessonSaved._id.toString(),
      );

      if (!isLessonExistsInGroup) {
        await this.groupService.findByIdAndUpdate(createLessonDTO.group, {
          lessons: [lessonSaved._id.toString(), ...lessons],
        });
      }

      return lessonSaved;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating lesson',
        error.message,
      );
    }
  }

  async update(id: string, dto: UpdateLessonDTO) {
    try {
      const updatedLesson = await this.lessonModel.findByIdAndUpdate(id, dto, {
        new: true,
      });
      if (!updatedLesson) {
        throw new NotFoundException(`Lesson with ID ${id} not found`);
      }

      const group = await this.groupService.getById(dto.group);
      const lessons = group.lessons.map((lesson) => lesson['_id'].toString());

      const isLessonExistsInGroup = group.lessons.find(
        (lesson) => lesson['_id'].toString() === updatedLesson._id.toString(),
      );

      if (!isLessonExistsInGroup) {
        await this.groupService.findByIdAndUpdate(dto.group, {
          lessons: [dto['_id'].toString(), ...lessons],
        });
      }

      return updatedLesson;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating lesson',
        error.message,
      );
    }
  }

  async delete(id: string) {
    try {
      const deletedLesson = await this.lessonModel.findByIdAndRemove(id);
      if (!deletedLesson) {
        throw new NotFoundException(`Lesson with ID ${id} not found`);
      }
      const group = await this.groupService.getById(
        deletedLesson.group.toString(),
      );
      const lessons = group.lessons.map((lesson) => lesson['_id'].toString());

      const isLessonExistsInGroup = group.lessons.find(
        (lesson) => lesson['_id'].toString() === deletedLesson._id.toString(),
      );

      if (!isLessonExistsInGroup) {
        await this.groupService.findByIdAndUpdate(
          deletedLesson.group.toString(),
          {
            lessons: lessons.filter((lesson) => lesson !== id),
          },
        );
      }
      return deletedLesson;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error deleting lesson',
        error.message,
      );
    }
  }

  async getLessonsByGroupId(params: FilterParams) {
    params.page = Number(params.page) ?? 1;
    try {
      const lessons = await this.lessonModel
        .find({ group: params.groupId })
        .populate('group', 'name')
        .populate('teacher', 'name email phone')
        .populate('secretary', 'name email phone')
        .sort({ name: params.sort })
        .skip((params.page - 1) * this.LIMIT)
        .limit(this.LIMIT)
        .select('-__v')
        .lean();

      const total = lessons.length;
      const totalPages = Math.ceil(total / this.LIMIT);
      const totalPage = lessons.length;

      return {
        lessons,
        total,
        totalPage,
        page: params.page,
        totalPages,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching lessons',
        error.message,
      );
    }
  }

  async getLessonsByUserId(params: FilterParams) {
    params.page = Number(params.page) ?? 1;
    try {
      const lessons = await this.lessonModel
        .find({
          $or: [{ teacher: params.userId }, { secretary: params.userId }],
        })
        .populate('group', 'name')
        .populate('teacher', 'name email phone')
        .populate('secretary', 'name email phone')
        .sort({ name: params.sort })
        .skip((params.page - 1) * this.LIMIT)
        .limit(this.LIMIT)
        .select('-__v')
        .lean();

      const total = lessons.length;
      const totalPages = Math.ceil(total / this.LIMIT);
      const totalPage = lessons.length;

      return {
        lessons,
        total,
        totalPage,
        page: params.page,
        totalPages,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching lessons',
        error.message,
      );
    }
  }

  async getLessonsByDate(params: FilterParams) {
    params.page = Number(params.page) ?? 1;
    const startOfDay = new Date(params.date + 'T00:00:00.000Z');
    const endOfDay = new Date(params.date + 'T23:59:59.999Z');
    try {
      const lessons = await this.lessonModel
        .find({ date: { $gte: startOfDay, $lte: endOfDay } })
        .populate('group', 'name')
        .populate('teacher', 'name email phone')
        .populate('secretary', 'name email phone')
        .sort({ name: params.sort })
        .skip((params.page - 1) * this.LIMIT)
        .limit(this.LIMIT)
        .select('-__v')
        .lean();

      const total = lessons.length;
      const totalPages = Math.ceil(total / this.LIMIT);
      const totalPage = lessons.length;

      return {
        lessons,
        total,
        totalPage,
        page: params.page,
        totalPages,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error fetching lessons',
        error.message,
      );
    }
  }
}
