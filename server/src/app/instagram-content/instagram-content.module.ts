import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InstagramContent,
  InstagramContentSchema,
} from './schemas/instagram-content.schema';
import {
  InstagramTopic,
  InstagramTopicSchema,
} from './schemas/instagram-topic.schema';
import {
  InstagramCategory,
  InstagramCategorySchema,
} from './schemas/instagram-category.schema';
import { InstagramCategoryController } from './controllers/instagram-category.controller';
import { InstagramCategoryService } from './services/instagram-category.service';
import { InstagramTopicService } from './services/instagram-topic.service';
import { InstagramTopicController } from './controllers/instagram-topic.controller';
import { InstagramContentController } from './controllers/instagram-content.controller';
import { InstagramContentService } from './services/instagram-content.service';
import { InstagramModule } from '../instagram/instagram.module';
import { InstagramSchedulerService } from './services/instagram-scheduler.service';
import { InstagramContentDbService } from './services/instagram-content/db.service';
import { InstagramContentPublishService } from './services/instagram-content/publish.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InstagramContent.name, schema: InstagramContentSchema },
      { name: InstagramTopic.name, schema: InstagramTopicSchema },
      { name: InstagramCategory.name, schema: InstagramCategorySchema },
    ]),

    InstagramModule
  ],
  controllers: [
    InstagramCategoryController,
    InstagramTopicController,
    InstagramContentController,
  ],
  providers: [
    InstagramCategoryService,
    InstagramTopicService,

    InstagramContentService,
    InstagramContentDbService,
    InstagramContentPublishService,

    InstagramSchedulerService
  ],
})
export class InstagramContentModule {}
