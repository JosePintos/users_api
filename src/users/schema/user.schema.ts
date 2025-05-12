import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Profile } from 'src/profiles/schema/profile.schema';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (v: string) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
      message: (props) => `${props.value} es un email inválido`,
    },
  })
  email: string;

  @Prop({ required: true })
  age: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Profile' }] })
  profiles: Profile[];
  // Se asume una entidad Perfil que contempla los niveles de privilegios de un usuario
}

export const UserSchema = SchemaFactory.createForClass(User);
