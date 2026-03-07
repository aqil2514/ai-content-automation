import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InstagramCategory } from '../schemas/instagram-category.schema';
import { Model } from 'mongoose';

@Injectable()
export class InstagramCategoryService {
  constructor(
    @InjectModel(InstagramCategory.name)
    private categoryModel: Model<InstagramCategory>,
  ) {}

  async create(data: Partial<InstagramCategory>): Promise<InstagramCategory> {
    const category = new this.categoryModel(data);

    return category.save();
  }

  async findAll(): Promise<InstagramCategory[]> {
    return this.categoryModel.find().exec();
  }

  async findActive(): Promise<InstagramCategory[]> {
    return this.categoryModel.find({ isActive: true }).exec();
  }

  async findOne(id: string): Promise<InstagramCategory> {
    return this.categoryModel.findById(id).exec();
  }

  async update(
    id: string,
    data: Partial<InstagramCategory>,
  ): Promise<InstagramCategory> {
    return this.categoryModel
      .findByIdAndUpdate(id, data, { returnDocument: 'after' })
      .exec();
  }

  async remove(id: string): Promise<InstagramCategory> {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }
}
