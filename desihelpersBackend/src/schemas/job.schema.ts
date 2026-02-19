import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  location: string;

  @Prop()
  pay: string;

  @Prop()
  type: string; // Storing as string for now, can be ObjectId later

  @Prop({ default: false })
  isUrgent: boolean;

  @Prop()
  postedBy: string;

  @Prop()
  image: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
