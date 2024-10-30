import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Member } from '../../member/schemas/member.schema';
import { Notice } from '../../notice/schemas/notice.schemas';

export type DepartmentDocument = Department & Document;

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};
@Schema(schemaOptions)
export class Department {
  @Prop({required: true})
  name: string;

  @Prop({required: true})
  description: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  })
  members: Member;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notice" }],
  })
  notices: Notice;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
