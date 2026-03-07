import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InstagramContent } from '../schemas/instagram-content.schema';
import { InstagramTopicService } from './instagram-topic.service';
import { GeminiService } from 'src/ai/gemini/gemini.service';
import { ImagenService } from 'src/ai/imagen/imagen.service';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { InstagramService } from 'src/app/instagram/instagram.service';
import { InstagramTopic } from '../schemas/instagram-topic.schema';

@Injectable()
export class InstagramContentService {
  constructor(
    @InjectModel(InstagramContent.name)
    private contentModel: Model<InstagramContent>,
    private topicService: InstagramTopicService,
    private aiService: GeminiService,
    private imagenService: ImagenService,
    private cloudinaryService: CloudinaryService,
  ) {}

  private async getUnusedTopics(): Promise<InstagramTopic[]> {
    const unusedTopics = await this.topicService.findUnused();
    if (unusedTopics.length === 0) {
      throw new Error('No unused topics available.');
    }

    return unusedTopics;
  }

  private async generateCaption(topicTitle: string) {
    const captionPrompt = `
      Kamu adalah content creator Instagram profesional.
      Buat caption Instagram yang menarik untuk topik: "${topicTitle}"
      - Panjang 150-300 karakter
      - Bahasa Indonesia santai dan friendly
      - Tambahkan 5-10 hashtag relevan di akhir
      - Gunakan emoji yang sesuai
      Respond hanya dengan caption saja.
    `;
    const caption = await this.aiService.generateText(captionPrompt);

    return caption;
  }

  private async generateImagePrompt(topicTitle: string) {
    const imagePromptText = `
      Buat prompt bahasa Inggris untuk generate gambar Instagram
      yang relevan dengan topik: "${topicTitle}"
      Respond hanya dengan prompt gambarnya saja, maksimal 100 kata.
    `;
    const imagePrompt = await this.aiService.generateText(imagePromptText);

    return imagePrompt;
  }

  async generateContent(): Promise<InstagramContent> {
    const unusedTopics = await this.getUnusedTopics();

    const topic = unusedTopics[Math.floor(Math.random() * unusedTopics.length)];

    const [caption, imagePrompt] = await Promise.all([
      this.generateCaption(topic.title),
      this.generateImagePrompt(topic.title),
    ]);

    const base64Image = await this.imagenService.generateImage(
      imagePrompt.trim(),
    );

    const imageUrl = await this.cloudinaryService.uploadBase64(
      base64Image,
      'instagram-content',
    );

    const content = await this.contentModel.create({
      topic: topic._id,
      caption: caption.trim(),
      imageUrl,
      status: 'pending',
    });

    await this.topicService.markAsUsed(topic._id.toString());

    return content;
  }
}
