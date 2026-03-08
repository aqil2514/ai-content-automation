import { VertexAI } from '@google-cloud/vertexai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
  private vertexAI: VertexAI;

  constructor(private configService: ConfigService) {
    this.vertexAI = new VertexAI({
      project: this.configService.get<string>('GOOGLE_CLOUD_PROJECT_ID'),
      location: this.configService.get<string>('GOOGLE_CLOUD_LOCATION'),
    });
  }

  async generateText(prompt: string): Promise<string> {
    const model = this.vertexAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });

    const result = await model.generateContent(prompt);
    return result.response.candidates[0].content.parts[0].text;
  }
}