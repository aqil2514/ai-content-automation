import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PredictionServiceClient } from '@google-cloud/aiplatform';

@Injectable()
export class ImagenService {
  private client: PredictionServiceClient;
  private projectId: string;
  private location: string;

  constructor(private configService: ConfigService) {
    this.projectId = this.configService.get<string>('GOOGLE_CLOUD_PROJECT_ID');
    this.location = this.configService.get<string>('GOOGLE_CLOUD_LOCATION');

    this.client = new PredictionServiceClient({
      apiEndpoint: `${this.location}-aiplatform.googleapis.com`,
      keyFilename: this.configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS'),
    });
  }

  async generateImage(prompt: string): Promise<string> {
    const endpoint = `projects/${this.projectId}/locations/${this.location}/publishers/google/models/imagen-3.0-generate-002`;

    const [response] = await this.client.predict({
      endpoint,
      instances: [
        {
          structValue: {
            fields: {
              prompt: { stringValue: prompt },
            },
          },
        },
      ],
      parameters: {
        structValue: {
          fields: {
            sampleCount: { numberValue: 1 },
            aspectRatio: { stringValue: '1:1' }, // square untuk Instagram
          },
        },
      },
    });

    // Ambil base64 image dari response
    const base64Image =
      response.predictions[0].structValue.fields.bytesBase64Encoded.stringValue;

    return base64Image;
  }
}