import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/schemas/user.shema';
import { Group } from '../../group/schemas/group.schema';

export type LessonDocument = Lesson & Document;

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};
@Schema(schemaOptions)
export class Lesson {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: new Date() })
  date: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true })
  group: Group;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  teacher: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  secretary: User;

  @Prop([
    {
      studentId: mongoose.Schema.Types.ObjectId,
      studentName: String,
      isPresent: Boolean,
    },
  ])
  attendance: {
    studentId: mongoose.Schema.Types.ObjectId;
    studentName: string;
    isPresent: boolean;
  }[];

  @Prop({ required: false })
  offerValue: number;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
