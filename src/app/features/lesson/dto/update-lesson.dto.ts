import { Types } from 'mongoose';

type Group = {
  _id: string;
}

export class UpdateLessonDTO {
  name?: string;
  description?: string;
  teacherId?: Types.ObjectId;
  secretaryId?: Types.ObjectId;
  group: string;
  attendance?: {
    studentId: Types.ObjectId;
    isPresent: boolean;
  }[];
  offerValue?: number;
}
