import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Student } from '../schemas/student.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterParams } from '../../../shared/utils/filter-params';
import { CreateStudentDTO } from '../dto/create-student.dto';
import { UpdateStudentDTO } from '../dto/update-student.dto';
import { GroupService } from '../../group/services/group.service';

@Injectable()
export class StudentService {
  private readonly LIMIT = 10;

  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    private readonly groupService: GroupService,
  ) {}

  async getAll(options: FilterParams) {
    try {
      let { sort, page, name } = options;

      page = Number(page) ?? 1;

      const total = await this.studentModel.countDocuments();
      const totalPages = Math.ceil(total / this.LIMIT);

      if (totalPages === 0) {
        return {
          students: [],
          total: 0,
          totalPage: 0,
          page: 0,
          totalPages: 0,
        };
      }

      const students = await this.studentModel
        .find({
          name: { $regex: name ?? '', $options: 'i' },
        })
        .sort({ name: sort })
        .skip((page - 1) * this.LIMIT)
        .limit(this.LIMIT)
        .populate('group', 'name description')
        .select('-__v')
        .lean();

      const totalPage = students.length;

      return {
        students,
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
    const student = await this.studentModel
      .findById(id)
      .populate('group', 'name')
      .select('-__v');
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async create(createStudentDTO: CreateStudentDTO) {
    const newStudent = new this.studentModel(createStudentDTO);
    const studentSaved = await newStudent.save();
    const group = await this.groupService.getById(createStudentDTO.group._id);
    const students = group.students.map((student) => student['_id'].toString());

    const isStudentExistsInGroup = group.students.find(
      (student) => student['_id'].toString() === studentSaved._id.toString(),
    );

    if (!isStudentExistsInGroup) {
      await this.groupService.findByIdAndUpdate(createStudentDTO.group._id, {
        students: [studentSaved._id.toString(), ...students],
      });
    }

    return studentSaved;
  }

  async update(id: string, updateStudentDTO: UpdateStudentDTO) {
    const studentExist = await this.studentModel.findById(id).exec();

    if (!studentExist)
      throw new NotFoundException(`Student with ID ${id} not found`);

    const updatedStudent = await this.studentModel
      .findByIdAndUpdate(id, updateStudentDTO, { new: true })
      .exec();

    if (
      studentExist.group['_id'].toString() !==
      updateStudentDTO.group._id.toString()
    ) {
      const oldGroup = await this.groupService.getById(
        studentExist.group['_id'].toString(),
      );
      const students = oldGroup.students.map((student) =>
        student['_id'].toString(),
      );

      await this.groupService.findByIdAndUpdate(oldGroup._id.toString(), {
        students: students.filter(
          (student) => student !== updatedStudent._id.toString(),
        ),
      });
    }

    if (updateStudentDTO.group) {
      const group = await this.groupService.getById(updateStudentDTO.group._id);

      const students = group.students.map((student) =>
        student['_id'].toString(),
      );

      const isStudentExistsInGroup = group.students.find(
        (student) =>
          student['_id'].toString() === updatedStudent._id.toString(),
      );

      if (!isStudentExistsInGroup) {
        await this.groupService.findByIdAndUpdate(updateStudentDTO.group._id, {
          students: [updatedStudent._id.toString(), ...students],
        });
      }
    }

    return updatedStudent;
  }

  async delete(id: string) {
    const deletedStudent = await this.studentModel.findByIdAndRemove(id).exec();
    if (!deletedStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    const group = await this.groupService.getById(
      deletedStudent.group.toString(),
    );
    const students = group.students.map((student) => student['_id'].toString());

    const isStudentExistsInGroup = group.students.find(
      (student) => student['_id'].toString() === deletedStudent._id.toString(),
    );

    if (!isStudentExistsInGroup) {
      await this.groupService.findByIdAndUpdate(
        deletedStudent.group.toString(),
        {
          students: students.filter(
            (student) => student !== deletedStudent._id.toString(),
          ),
        },
      );
    }

    return deletedStudent;
  }
}
