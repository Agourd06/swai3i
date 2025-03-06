import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from '../common/enums/users.enum';
import * as bcrypt from 'bcryptjs';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  adress: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.PARTICIPANT
  })
  role: UserRole;

  @Prop({ type: String, required: false })
  bio?: string;

  @Prop({ type: [String], default: [] })
  subjects?: string[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  favoriteTeachers?: Types.ObjectId[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); 
  }
  next();
});