import { Injectable } from '@nestjs/common';
import { InstagramContent } from '../../schemas/instagram-content.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InstagramService } from 'src/app/instagram/instagram.service';

@Injectable()
export class InstagramContentPublishService {
  constructor(
    @InjectModel(InstagramContent.name)
    private readonly contentModel: Model<InstagramContent>,
    private instagramService: InstagramService,
  ) {}

  private async getContent(id: string): Promise<InstagramContent> {
    const content = await this.contentModel.findById(id).exec();

    if (!content) throw new Error('Content not found');
    if (content.status !== 'approved') {
      throw new Error('Content must be approved before publishing');
    }
    if (!content.imageUrl) {
      throw new Error('Content must have an image before publishing');
    }

    return content;
  }

  private async updateContentDb(
    id: string,
    postId: string,
    postUrl: string,
  ): Promise<InstagramContent> {
    return this.contentModel
      .findByIdAndUpdate(
        id,
        {
          status: 'published',
          instagramPostId: postId,
          instagramPostUrl: postUrl,
          publishedAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async publishToInstagram(id: string): Promise<InstagramContent> {
    const content = await this.getContent(id);

    const { postId, postUrl } = await this.instagramService.publishPost(
      content.imageUrl,
      content.caption,
    );

    return await this.updateContentDb(id, postId, postUrl);
  }
}
