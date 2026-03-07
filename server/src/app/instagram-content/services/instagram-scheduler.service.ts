import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InstagramContentService } from './instagram-content/content.service';
import { InstagramContentDbService } from './instagram-content/db.service';
import { InstagramContentPublishService } from './instagram-content/publish.service';

@Injectable()
export class InstagramSchedulerService {
  private readonly logger = new Logger(InstagramSchedulerService.name);

  constructor(
    private contentService: InstagramContentService,
    private dbService: InstagramContentDbService,
    private publishService: InstagramContentPublishService,
  ) {}

  // Generate content 3x sehari: jam 07.00, 12.00, 17.00
  @Cron('0 7 * * *')
  @Cron('0 12 * * *')
  @Cron('0 17 * * *')
  async handleGenerateContent() {
    this.logger.log('Scheduler: Generating content...');
    try {
      const content = await this.contentService.generateContent();
      this.logger.log(`Content generated: ${content._id}`);
    } catch (error) {
      this.logger.error(`Failed to generate content: ${error.message}`);
    }
  }

  @Cron('0 9 * * *')
  async handleMorningPublish() {
    await this.publishOneApprovedContent();
  }

  @Cron('0 19 * * *')
  async handleEveningPublish() {
    await this.publishOneApprovedContent();
  }

  private async publishOneApprovedContent() {
    this.logger.log('Scheduler: Publishing approved content...');
    try {
      const approvedContents = await this.dbService.findByStatus('approved');

      if (approvedContents.length === 0) {
        this.logger.log('No approved content to publish');
        return;
      }

      // Ambil 1 konten terlama yang sudah approved (FIFO)
      const content = approvedContents[0];

      await this.publishService.publishToInstagram(content._id.toString());
      this.logger.log(`Published content: ${content._id}`);
    } catch (error) {
      this.logger.error(`Scheduler publish error: ${error.message}`);
    }
  }
}