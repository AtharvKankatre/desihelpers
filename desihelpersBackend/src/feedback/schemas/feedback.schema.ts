import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ required: true })
  seekerId: string;

  @Prop()
  reviewerId: string; // Optional if not logged in

  @Prop()
  reviewerName: string; // For anonymous or quick display

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  feedback: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
