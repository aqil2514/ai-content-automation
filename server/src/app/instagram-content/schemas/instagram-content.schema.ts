import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { InstagramTopic } from './instagram-topic.schema';

@Schema({ timestamps: true })
export class InstagramContent extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'InstagramTopic' })
  topic: InstagramTopic;

  @Prop() caption: string;
  @Prop() imageUrl: string;
  @Prop({
    enum: ['pending', 'approved', 'rejected', 'published'],
    default: 'pending',
  })
  status: string;

  @Prop() scheduledAt: Date;
  @Prop() publishedAt: Date;
  @Prop({ type: Object }) metadata: Record<string, any>;

  @Prop() instagramPostUrl: string;
  @Prop() instagramPostId: string;

  @Prop() rejectionReason: string;
}

export const InstagramContentSchema =
  SchemaFactory.createForClass(InstagramContent);
