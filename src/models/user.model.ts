import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { emailValidator } from '../validators/email';

@Schema()
export class User extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: emailValidator,
      message: ({ value }) => `${value} is not a valid email address!`,
    },
  })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
