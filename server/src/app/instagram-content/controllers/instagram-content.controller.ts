import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { InstagramContentService } from '../services/instagram-content/content.service';
import { UpdateStatusDto } from '../dto/update-status.dto';
import { InstagramContentDbService } from '../services/instagram-content/db.service';
import { InstagramContentPublishService } from '../services/instagram-content/publish.service';

@Controller('instagram/contents')
export class InstagramContentController {
  constructor(
    private readonly contentService: InstagramContentService,
    private readonly dbService: InstagramContentDbService,
    private readonly publishService: InstagramContentPublishService
  ) {}

  @Post('generate')
  generate() {
    return this.contentService.generateContent();
  }

  @Get()
  findAll() {
    return this.dbService.findAll();
  }

  @Get('status')
  findByStatus(@Query('value') status: string) {
    return this.dbService.findByStatus(status);
  }

  @Get('pending')
  findPending() {
    return this.dbService.findPending();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dbService.findOne(id);
  }

  @Put(':id/approve')
  approve(@Param('id') id: string) {
    return this.dbService.approve(id);
  }

  @Put(':id/reject')
  reject(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.dbService.reject(id, dto.rejectionReason);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.dbService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dbService.remove(id);
  }

  @Put(':id/publish')
  publishToInstagram(@Param('id') id: string) {
    return this.publishService.publishToInstagram(id);
  }
}
