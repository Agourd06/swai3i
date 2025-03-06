import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Classroom extends Document {
  @Prop({ required: true })
  course: string;

//   @Prop({ required: true })
//   schedule: Date;

  @Prop({ required: true })
  capacity: number;
}

export const ClassroomSchema = SchemaFactory.createForClass(Classroom);