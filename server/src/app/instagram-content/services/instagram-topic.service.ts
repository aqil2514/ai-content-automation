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

  // Jalankan otomatis setiap hari jam 00.00
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
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
        Kamu adalah content creator Instagram profesional.
        Berikan 1 ide topik konten Instagram yang spesifik, menarik, dan relevan
        untuk kategori "${category.name}".
        ${category.description ? `Konteks kategori: ${category.description}` : ''}
        
        Respond hanya dengan judul topiknya saja, tanpa penjelasan tambahan.
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
      .findByIdAndUpdate(id, { isUsed: true }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<InstagramTopic> {
    return this.topicModel.findByIdAndDelete(id).exec();
  }
}
