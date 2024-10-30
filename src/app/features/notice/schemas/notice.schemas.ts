import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoticeDocument = Notice & Document;

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};
@Schema(schemaOptions)
export class Notice {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const NoticeSchema = SchemaFactory.createForClass(Notice);
