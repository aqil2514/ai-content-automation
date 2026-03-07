import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InstagramContent } from '../../schemas/instagram-content.schema';
import { InstagramTopicService } from '../instagram-topic.service';
import { GeminiService } from 'src/ai/gemini/gemini.service';
import { ImagenService } from 'src/ai/imagen/imagen.service';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { InstagramTopic } from '../../schemas/instagram-topic.schema';

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
    You are a professional Instagram content creator and anime enthusiast.
    Create an engaging Instagram caption for the topic: "${topicTitle}"
    
    Requirements:
    - Length 150-300 characters
    - Casual and friendly English
    - Write as if this caption accompanies a beautiful anime illustration
    - Can be an inspirational quote, short storytelling, or call to interaction
    - Add 5-10 relevant hashtags at the end (mix of general and anime-related)
    - Use aesthetic and fitting emojis
    
    Respond with the caption only.
  `;
    const caption = await this.aiService.generateText(captionPrompt);
    return caption;
  }

  async generateImagePrompt(topicTitle: string): Promise<string> {
    const prompt = `
    Create an English image generation prompt for an Instagram post about: "${topicTitle}"

    The image must follow this exact style:
    - High quality anime illustration, similar to Genshin Impact or premium anime game art style
    - Female anime character with detailed design: colorful unique hair with accessories, expressive large eyes, beautiful facial features
    - Character outfit must match the scene and topic (can be casual, fantasy, traditional, formal, seasonal, etc.)
    - Dramatic and cinematic lighting (golden hour, magical glow, sunlight rays, candlelight, etc.)
    - Highly detailed and expansive background that matches the topic (landscape, fantasy world, cityscape, nature, etc.)
    - Vivid colors with high saturation, rich and vibrant color palette
    - Dynamic composition with character in foreground and stunning scenery in background
    - Sparkles, light particles, or magical effects where appropriate
    - Square format 1:1, Instagram ready

    Respond with the image prompt only in English, maximum 120 words.
  `;

    const imagePrompt = await this.aiService.generateText(prompt);
    return imagePrompt.trim();
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

    await this.topicService.markAsUsed(topic._id.toString());

    const content = await this.contentModel.create({
      topic: topic._id,
      caption: caption.trim(),
      imageUrl,
      status: 'pending',
    });

    return content;
  }
}
