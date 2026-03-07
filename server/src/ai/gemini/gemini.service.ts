import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    this.genAI = new GoogleGenerativeAI(
      this.configService.get<string>('GOOGLE_GEMINI_API_KEY'),
    );
  }

  async generateText(prompt: string) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);

    return result.response.text();
  }
}
