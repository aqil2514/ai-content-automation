import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InstagramContent } from '../../schemas/instagram-content.schema';
import { Model } from 'mongoose';

@Injectable()
export class InstagramContentDbService {
  constructor(
    @InjectModel(InstagramContent.name)
    private readonly contentModel: Model<InstagramContent>,
  ) {}

    async findAll(): Promise<InstagramContent[]> {
      return this.contentModel.find().populate('topic').exec();
    }
  
    async findByStatus(status: string): Promise<InstagramContent[]> {
      return this.contentModel.find({ status }).populate('topic').exec();
    }
  
    async findOne(id: string): Promise<InstagramContent> {
      return this.contentModel.findById(id).populate('topic').exec();
    }
  
    async updateStatus(id: string, status: string): Promise<InstagramContent> {
      return this.contentModel
        .findByIdAndUpdate(id, { status }, { returnDocument:"after" })
        .exec();
    }
  
    async remove(id: string): Promise<InstagramContent> {
      return this.contentModel.findByIdAndDelete(id).exec();
    }
  
    async approve(id: string): Promise<InstagramContent> {
      return this.contentModel
        .findByIdAndUpdate(id, { status: 'approved' }, { returnDocument: "after" })
        .populate('topic')
        .exec();
    }
  
    async reject(id: string, rejectionReason: string): Promise<InstagramContent> {
      return this.contentModel
        .findByIdAndUpdate(
          id,
          { status: 'rejected', rejectionReason },
          { returnDocument:"after" },
        )
        .populate('topic')
        .exec();
    }
  
    async findPending(): Promise<InstagramContent[]> {
      return this.contentModel
        .find({ status: 'pending' })
        .populate('topic')
        .exec();
    }
  
}
