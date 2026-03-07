import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InstagramContentService } from './instagram-content/content.service';

@Injectable()
export class InstagramSchedulerService {
  private readonly logger = new Logger(InstagramSchedulerService.name);

  constructor(private contentService: InstagramContentService) {}

  // Setiap hari jam 01.00 → generate content
  @Cron('0 1 * * *')
  async handleGenerateContent() {
    this.logger.log('Scheduler: Generating content...');
    try {
      const content = await this.contentService.generateContent();
      this.logger.log(`Content generated: ${content._id}`);
    } catch (error) {
      this.logger.error(`Failed to generate content: ${error.message}`);
    }
  }

  // Setiap hari jam 09.00 → publish semua yang approved
  @Cron('0 9 * * *')
  async handlePublishApprovedContent() {
    this.logger.log('Scheduler: Publishing approved content...');
    try {
      const approvedContents = await this.contentService.findByStatus('approved');

      if (approvedContents.length === 0) {
        this.logger.log('No approved content to publish');
        return;
      }

      for (const content of approvedContents) {
        try {
          await this.contentService.publishToInstagram(content._id.toString());
          this.logger.log(`Published content: ${content._id}`);
        } catch (error) {
          this.logger.error(`Failed to publish content ${content._id}: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`Scheduler publish error: ${error.message}`);
    }
  }
}