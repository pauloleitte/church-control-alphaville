import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};
@Schema(schemaOptions)
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop()
  avatarUrl: string;

  @Prop()
  roles: string[]

  @Prop()
  genre: string;

  @Prop()
  tokens: string[]

}

export const UserSchema = SchemaFactory.createForClass(User);
