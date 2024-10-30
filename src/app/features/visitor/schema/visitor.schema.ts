import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = Visitor & Document;

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};
@Schema(schemaOptions)
export class Visitor {
  @Prop()
  name: string;

  @Prop({ required: false })
  email: string;

  @Prop({ required: false })
  telephone: string;

  @Prop({ required: false })
  isChurchgoer: boolean;

  @Prop({ required: false })
  church: string;

  @Prop({ required: false })
  observations: string;
}

export const VisitorSchema = SchemaFactory.createForClass(Visitor);
