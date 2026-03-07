import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadBase64(base64Image: string, folder: string): Promise<string> {
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Image}`,
      {
        folder,
        resource_type: 'image',
      },
    );
    return result.secure_url;
  }
}