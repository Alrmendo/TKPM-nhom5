import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from '../../models/entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { AddReplyDto } from './dto/add-reply.dto';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
  ) {}

  async findAllByDressId(dressId: string): Promise<Review[]> {
    return this.reviewModel.find({ dressId }).sort({ createdAt: -1 }).exec();
  }

  async create(
    createReviewDto: CreateReviewDto,
    userId: string,
    username: string,
    images: string[] = [],
  ): Promise<Review> {
    try {
      console.log('Review service: Creating review with data:', {
        dressId: createReviewDto.dressId,
        userId,
        rating: createReviewDto.rating,
        reviewTextLength: createReviewDto.reviewText?.length || 0
      });
      
      // Check if user already reviewed this dress
      const existingReview = await this.reviewModel.findOne({
        dressId: createReviewDto.dressId,
        userId,
      }).exec();

      if (existingReview) {
        throw new BadRequestException('You have already reviewed this dress');
      }

      // Process reviewText to prevent special characters issues
      let cleanReviewText = createReviewDto.reviewText || '';
      cleanReviewText = cleanReviewText.trim();
      
      // Đảm bảo rating là số hợp lệ
      const rating = Number(createReviewDto.rating);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        throw new BadRequestException('Rating must be a number between 1 and 5');
      }

      const review = new this.reviewModel({
        dressId: createReviewDto.dressId,
        userId,
        username,
        rating: rating,
        reviewText: cleanReviewText,
        images,
        date: new Date(),
      });

      return await review.save();
    } catch (error) {
      console.error('Error in review service:', error);
      throw error;
    }
  }

  async addReply(
    dressId: string,
    reviewId: string,
    addReplyDto: AddReplyDto,
    userId: string,
    username: string,
  ): Promise<Review> {
    const review = await this.reviewModel.findOne({
      _id: reviewId,
      dressId,
    }).exec();

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    review.replies.push({
      userId,
      username,
      replyText: addReplyDto.replyText,
      date: new Date(),
    });

    return review.save();
  }

  async delete(reviewId: string, userId: string, isAdmin: boolean): Promise<void> {
    const review = await this.reviewModel.findById(reviewId).exec();

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Check if user is authorized to delete
    if (review.userId.toString() !== userId && !isAdmin) {
      throw new BadRequestException('Not authorized to delete this review');
    }

    // Delete review images from server
    if (review.images && review.images.length > 0) {
      review.images.forEach(image => {
        try {
          const imagePath = join(__dirname, '../../../uploads/reviews', image.split('/').pop());
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        } catch (err) {
          console.error('Error deleting image:', err);
        }
      });
    }

    await this.reviewModel.deleteOne({ _id: reviewId }).exec();
  }
} 