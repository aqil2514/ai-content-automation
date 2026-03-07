import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class InstagramCategory extends Document {
  @Prop({ required: true }) name: string;
  @Prop() description: string;
  @Prop({ default: true }) isActive: boolean;
}

export const InstagramCategorySchema = SchemaFactory.createForClass(InstagramCategory);