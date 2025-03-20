import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EnrollmentStatus } from './enrollment-status.enum';
@Schema({ timestamps: true })
export class Enrollment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  student: Types.ObjectId;

  @Prop({ type: String, required: false })
  classroom?: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: String, enum: EnrollmentStatus, default: EnrollmentStatus.PENDING })
  status: EnrollmentStatus;

  @Prop({ type: Boolean, default: false })
  isPaid: boolean;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment); 