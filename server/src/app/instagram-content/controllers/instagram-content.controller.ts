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
import { InstagramContentService } from '../services/instagram-content.service';
import { UpdateStatusDto } from '../dto/update-status.dto';

@Controller('instagram/contents')
export class InstagramContentController {
  constructor(private readonly contentService: InstagramContentService) {}

  @Post('generate')
  generate() {
    return this.contentService.generateContent();
  }

  @Get()
  findAll() {
    return this.contentService.findAll();
  }

  @Get('status')
  findByStatus(@Query('value') status: string) {
    return this.contentService.findByStatus(status);
  }

  @Get('pending')
  findPending() {
    return this.contentService.findPending();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @Put(':id/approve')
  approve(@Param('id') id: string) {
    return this.contentService.approve(id);
  }

  @Put(':id/reject')
  reject(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.contentService.reject(id, dto.rejectionReason);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.contentService.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }

  @Put(':id/publish')
  publishToInstagram(@Param('id') id: string) {
    return this.contentService.publishToInstagram(id);
  }
}
