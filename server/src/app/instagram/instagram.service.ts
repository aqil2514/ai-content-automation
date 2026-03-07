import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class InstagramService {
  private accessToken: string;
  private businessAccountId: string;
  private apiUrl = 'https://graph.facebook.com/v19.0';

  constructor(private configService: ConfigService) {
    this.accessToken = this.configService.get<string>('INSTAGRAM_ACCESS_TOKEN');
    this.businessAccountId = this.configService.get<string>('INSTAGRAM_BUSINESS_ACCOUNT_ID');
  }

  async publishPost(imageUrl: string, caption: string): Promise<{ postId: string; postUrl: string }> {
    // Step 1: Upload media (buat container)
    const containerResponse = await axios.post(
      `${this.apiUrl}/${this.businessAccountId}/media`,
      {
        image_url: imageUrl,
        caption,
        access_token: this.accessToken,
      },
    );

    const containerId = containerResponse.data.id;
    console.info(`Media container created: ${containerId}`);

    // Step 2: Tunggu container siap
    await this.waitForContainer(containerId);

    // Step 3: Publish container
    const publishResponse = await axios.post(
      `${this.apiUrl}/${this.businessAccountId}/media_publish`,
      {
        creation_id: containerId,
        access_token: this.accessToken,
      },
    );

    const postId = publishResponse.data.id;

    // Step 4: Ambil URL post
    const postUrl = await this.getPostUrl(postId);

    return { postId, postUrl };
  }

  private async waitForContainer(containerId: string): Promise<void> {
    const maxRetries = 10;
    const delay = 3000; // 3 detik

    for (let i = 0; i < maxRetries; i++) {
      const statusResponse = await axios.get(
        `${this.apiUrl}/${containerId}`,
        {
          params: {
            fields: 'status_code',
            access_token: this.accessToken,
          },
        },
      );

      const status = statusResponse.data.status_code;
      console.info(`Container status: ${status}`);

      if (status === 'FINISHED') return;
      if (status === 'ERROR') throw new Error('Media container failed');

      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    throw new Error('Media container timed out');
  }

  private async getPostUrl(postId: string): Promise<string> {
    const response = await axios.get(`${this.apiUrl}/${postId}`, {
      params: {
        fields: 'permalink',
        access_token: this.accessToken,
      },
    });

    return response.data.permalink;
  }
}