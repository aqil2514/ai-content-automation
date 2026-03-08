import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InstagramCategoryService } from './instagram-category.service';
import { InstagramTopic } from '../schemas/instagram-topic.schema';
import { GeminiService } from 'src/ai/gemini/gemini.service';

@Injectable()
export class InstagramTopicService {
  constructor(
    @InjectModel(InstagramTopic.name)
    private topicModel: Model<InstagramTopic>,
    private categoryService: InstagramCategoryService,
    private geminiService: GeminiService,
  ) {}

  async generateTopics() {
    // Ambil semua category yang aktif
    const categories = await this.categoryService.findActive();

    if (categories.length === 0) {
      console.info('No active categories found');
      return;
    }

    // Generate 1 topic per category
    for (const category of categories) {
      const prompt = `
  You are a professional anime-themed Instagram content creator.
  Generate 1 specific, creative, and engaging Instagram content topic
  for the category: "${category.name}".
  ${category.description ? `Category context: ${category.description}` : ''}

  The topic must be:
  - Suitable for an anime illustration image post
  - Evocative and visual — something that can be beautifully depicted in anime art style
  - Specific enough to inspire a unique scene or character concept
  - Relevant to the category context

  Respond with the topic title only, no explanation.
`;

      const title = await this.geminiService.generateText(prompt);

      await this.topicModel.create({
        category: category._id,
        title: title.trim(),
        isUsed: false,
      });

      console.info(`Topic generated for category "${category.name}": ${title}`);
    }
  }

  async findAll(): Promise<InstagramTopic[]> {
    return this.topicModel.find().populate('category').exec();
  }

  async findUnused(): Promise<InstagramTopic[]> {
    return this.topicModel.find({ isUsed: false }).populate('category').exec();
  }

  async markAsUsed(id: string): Promise<InstagramTopic> {
    return this.topicModel
      .findByIdAndUpdate(id, { isUsed: true }, { returnDocument: "after" })
      .exec();
  }

  async remove(id: string): Promise<InstagramTopic> {
    return this.topicModel.findByIdAndDelete(id).exec();
  }
}
