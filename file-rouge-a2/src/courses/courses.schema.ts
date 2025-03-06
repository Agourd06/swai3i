import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum CourseType {
  PRIVATE = 'private',
  CLASSROOM = 'classroom',
  ONLINE = 'online',
}

@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  city: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  teacher: Types.ObjectId;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  duration: number;

  @Prop({ type: [String], enum: CourseType })
  courseType: CourseType[];

  @Prop({ type: String, required: false })
  location?: string;

  @Prop({ type: Number, required: false })
  maxStudents?: number;

  @Prop({ type: [{ 
    day: String,
    hour: Number,
    minute: Number
  }], required: true })
  timeSlots: {
    day: string;
    hour: number;
    minute: number;
  }[];

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course); 