import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Notice } from '../../notice/schemas/notice.schemas';
import { Visitor } from '../../visitor/schema/visitor.schema';
import { Prayer } from '../../prayer/schemas/prayer.schemas';

export type CeremonyDocument = Ceremony & Document;

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};
@Schema(schemaOptions)
export class Ceremony {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Visitor' }],
  })
  visitors: Visitor;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notice' }],
  })
  notices: Notice;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prayer' }],
  })
  prayers: Prayer;

  @Prop({ default: new Date() })
  date: Date;
}

export const CeremonySchema = SchemaFactory.createForClass(Ceremony);
