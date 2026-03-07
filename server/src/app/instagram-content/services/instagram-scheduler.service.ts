import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InstagramContentService } from './instagram-content/content.service';
import { InstagramContentDbService } from './instagram-content/db.service';
import { InstagramContentPublishService } from './instagram-content/publish.service';
import { InstagramTopicService } from './instagram-topic.service';

@Injectable()
export class InstagramSchedulerService {
  private readonly logger = new Logger(InstagramSchedulerService.name);

  constructor(
    private contentService: InstagramContentService,
    private dbService: InstagramContentDbService,
    private publishService: InstagramContentPublishService,
    private topicService: InstagramTopicService,
  ) {}

  // @Cron('0 8 * * *')
  // async handleGenerateContentFirst() {
  //   await this.handleGenerateContent();
  // }

  // @Cron('30 8 * * *')
  // async handleGenerateContentSecond() {
  //   await this.handleGenerateContent();
  // }

  // @Cron('0 9 * * *')
  // async handleGenerateContentThird() {
  //   await this.handleGenerateContent();
  // }

  @Cron('0,30 7-19 * * *')
  async generateContent() {
    await this.handleGenerateContent();
  }

  private async handleGenerateContent() {
    this.logger.log('Scheduler: Generating content...');
    try {
      const content = await this.contentService.generateContent();
      this.logger.log(`Content generated: ${content._id}`);
    } catch (error) {
      this.logger.error(`Failed to generate content: ${error.message}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleMorningPublish() {
    await this.publishOneApprovedContent();
  }

  @Cron(CronExpression.EVERY_DAY_AT_5PM)
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

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async handleGenerateTopics() {
    this.logger.log('Scheduler: Generating topics...');
    try {
      await this.topicService.generateTopics();
      this.logger.log('Topics generated successfully');
    } catch (error) {
      this.logger.error(`Failed to generate topics: ${error.message}`);
    }
  }
}
