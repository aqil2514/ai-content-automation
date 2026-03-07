import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { InstagramCategoryService } from '../services/instagram-category.service';
import { InstagramCategory } from '../schemas/instagram-category.schema';

@Controller('instagram/categories')
export class InstagramCategoryController {
  constructor(private readonly categoryService: InstagramCategoryService) {}

  @Post()
  create(@Body() data: Partial<InstagramCategory>) {
    return this.categoryService.create(data);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('active')
  findActive() {
    return this.categoryService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<InstagramCategory>) {
    return this.categoryService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}