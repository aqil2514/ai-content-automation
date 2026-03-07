import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InstagramContent } from '../schemas/instagram-content.schema';
import { InstagramTopicService } from './instagram-topic.service';
import { GeminiService } from 'src/ai/gemini/gemini.service';
import { ImagenService } from 'src/ai/imagen/imagen.service';
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service';
import { InstagramService } from 'src/app/instagram/instagram.service';

@Injectable()
export class InstagramContentService {
  constructor(
    @InjectModel(InstagramContent.name)
    private contentModel: Model<InstagramContent>,
    private topicService: InstagramTopicService,
    private aiService: GeminiService,
    private imagenService: ImagenService,
    private cloudinaryService: CloudinaryService,
    private instagramService: InstagramService,
  ) {}

  async generateContent(): Promise<InstagramContent> {
    const unusedTopics = await this.topicService.findUnused();
    if (unusedTopics.length === 0) {
      throw new Error('No unused topics available.');
    }

    const topic = unusedTopics[Math.floor(Math.random() * unusedTopics.length)];

    // Generate caption
    const captionPrompt = `
      Kamu adalah content creator Instagram profesional.
      Buat caption Instagram yang menarik untuk topik: "${topic.title}"
      - Panjang 150-300 karakter
      - Bahasa Indonesia santai dan friendly
      - Tambahkan 5-10 hashtag relevan di akhir
      - Gunakan emoji yang sesuai
      Respond hanya dengan caption saja.
    `;
    const caption = await this.aiService.generateText(captionPrompt);

    // Generate image prompt
    const imagePromptText = `
      Buat prompt bahasa Inggris untuk generate gambar Instagram
      yang relevan dengan topik: "${topic.title}"
      Respond hanya dengan prompt gambarnya saja, maksimal 100 kata.
    `;
    const imagePrompt = await this.aiService.generateText(imagePromptText);

    // Generate gambar via Imagen
    const base64Image = await this.imagenService.generateImage(imagePrompt.trim());

    // Upload ke Cloudinary
    const imageUrl = await this.cloudinaryService.uploadBase64(
      base64Image,
      'instagram-content',
    );

    // Simpan content
    const content = await this.contentModel.create({
      topic: topic._id,
      caption: caption.trim(),
      imageUrl,
      status: 'pending',
    });

    await this.topicService.markAsUsed(topic._id.toString());

    return content;
  }

  async findAll(): Promise<InstagramContent[]> {
    return this.contentModel.find().populate('topic').exec();
  }

  async findByStatus(status: string): Promise<InstagramContent[]> {
    return this.contentModel.find({ status }).populate('topic').exec();
  }

  async findOne(id: string): Promise<InstagramContent> {
    return this.contentModel.findById(id).populate('topic').exec();
  }

  async updateStatus(id: string, status: string): Promise<InstagramContent> {
    return this.contentModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<InstagramContent> {
    return this.contentModel.findByIdAndDelete(id).exec();
  }

  async approve(id: string): Promise<InstagramContent> {
    return this.contentModel
      .findByIdAndUpdate(id, { status: 'approved' }, { new: true })
      .populate('topic')
      .exec();
  }

  async reject(id: string, rejectionReason: string): Promise<InstagramContent> {
    return this.contentModel
      .findByIdAndUpdate(
        id,
        { status: 'rejected', rejectionReason },
        { new: true },
      )
      .populate('topic')
      .exec();
  }

  async findPending(): Promise<InstagramContent[]> {
    return this.contentModel
      .find({ status: 'pending' })
      .populate('topic')
      .exec();
  }

  async publishToInstagram(id: string): Promise<InstagramContent> {
    const content = await this.contentModel.findById(id).exec();

    if (!content) throw new Error('Content not found');
    if (content.status !== 'approved') {
      throw new Error('Content must be approved before publishing');
    }
    if (!content.imageUrl) {
      throw new Error('Content must have an image before publishing');
    }

    const { postId, postUrl } = await this.instagramService.publishPost(
      content.imageUrl,
      content.caption,
    );

    return this.contentModel.findByIdAndUpdate(
      id,
      {
        status: 'published',
        instagramPostId: postId,
        instagramPostUrl: postUrl,
        publishedAt: new Date(),
      },
      { new: true },
    ).exec();
  }
}
