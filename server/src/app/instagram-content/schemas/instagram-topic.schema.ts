import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { InstagramCategory } from './instagram-category.schema';

@Schema({ timestamps: true })
export class InstagramTopic extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'InstagramCategory' })
  category: InstagramCategory;

  @Prop({ required: true }) title: string;
  @Prop({ default: false }) isUsed: boolean;
}

export const InstagramTopicSchema = SchemaFactory.createForClass(InstagramTopic);