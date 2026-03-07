import { Controller, Get, Delete, Param, Post } from '@nestjs/common';
import { InstagramTopicService } from '../services/instagram-topic.service';

@Controller('instagram/topics')
export class InstagramTopicController {
  constructor(private readonly topicService: InstagramTopicService) {}

  @Post('generate')
  generate() {
    return this.topicService.generateTopics();
  }

  @Get()
  findAll() {
    return this.topicService.findAll();
  }

  @Get('unused')
  findUnused() {
    return this.topicService.findUnused();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicService.remove(id);
  }
}