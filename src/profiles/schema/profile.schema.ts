import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/shared/model/role.model';

@Schema()
export class Profile extends Document {
  @Prop({ required: true, unique: true })
  code: Role;

  @Prop({ required: true })
  name: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
