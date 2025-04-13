import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpStatus,
  Query,
  HttpException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AddReplyDto } from './dto/add-reply.dto';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '../../models/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Document } from 'mongoose';

@ApiTags('reviews')
@Controller('dress')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get(':dressId/review')
  @ApiOperation({ summary: 'Get all reviews for a dress' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all reviews for a dress' })
  async findAllByDressId(@Param('dressId') dressId: string) {
    const reviews = await this.reviewService.findAllByDressId(dressId);
    return {
      success: true,
      count: reviews.length,
      data: reviews,
    };
  }

  @Get(':dressId/review/check')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check if the current user has already reviewed this dress' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns whether the user has reviewed the dress' })
  async checkUserReview(
    @Param('dressId') dressId: string,
    @GetUser() user: User & Document,
  ) {
    try {
      const userId = user.id;
      
      // Check if user has already reviewed this dress
      const existingReview = await this.reviewService.findByUserAndDress(userId, dressId);
      
      return {
        success: true,
        hasReviewed: !!existingReview,
      };
    } catch (error) {
      console.error('Error checking user review:', error);
      throw new HttpException(
        error.message || 'Failed to check user review',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':dressId/review')
  @UseInterceptors(FilesInterceptor('images', 3))
  @ApiOperation({ summary: 'Create a new review' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Review data with optional images',
    type: CreateReviewDto,
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Review created successfully' })
  async create(
    @Param('dressId') dressId: string,
    @Body() createReviewDto: CreateReviewDto,
    @GetUser() user: User & Document,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      console.log('Review controller: Creating review with data:', { 
        dressId, 
        dto: {
          dressId: createReviewDto.dressId,
          userId: createReviewDto.userId,
          rating: createReviewDto.rating,
          reviewText: createReviewDto.reviewText,
          reviewTextLength: createReviewDto.reviewText ? createReviewDto.reviewText.length : 0
        },
        user: user ? {
          id: user.id,
          email: user.email,
          username: user.username,
        } : 'No user object from JWT',
        filesCount: files?.length || 0 
      });
    
      // Map file paths for storage
      const imagePaths = files ? files.map(file => `/uploads/reviews/${file.filename}`) : [];
      
      // Add dressId to DTO if not provided
      if (!createReviewDto.dressId) {
        createReviewDto.dressId = dressId;
      }
      
      // Add userId to DTO if not provided but available in user object
      if (!createReviewDto.userId && user) {
        createReviewDto.userId = user.id;
      }
      
      // Xử lý dữ liệu trước khi gửi đến service
      const reviewData = {
        ...createReviewDto,
        // Đảm bảo rating là số
        rating: typeof createReviewDto.rating === 'string' 
          ? Number(createReviewDto.rating) 
          : createReviewDto.rating,
        // Đảm bảo reviewText sạch
        reviewText: typeof createReviewDto.reviewText === 'string'
          ? createReviewDto.reviewText.trim()
          : '',
      };
      
      // Kiểm tra dữ liệu
      if (isNaN(reviewData.rating) || reviewData.rating < 1 || reviewData.rating > 5) {
        throw new HttpException(
          'Rating must be a number between 1 and 5',
          HttpStatus.BAD_REQUEST
        );
      }
      
      if (!reviewData.reviewText || reviewData.reviewText.length === 0) {
        throw new HttpException(
          'Review text cannot be empty',
          HttpStatus.BAD_REQUEST
        );
      }
      
      // Check if we have a valid userId by now
      if (!reviewData.userId && (!user || !user.id)) {
        throw new HttpException(
          'User ID is required to submit a review',
          HttpStatus.BAD_REQUEST
        );
      }
      
      const review = await this.reviewService.create(
        reviewData,
        user.id,
        user.username || user.email,
        imagePaths,
      );
      
      return {
        success: true,
        message: 'Review added successfully',
        data: review,
      };
    } catch (error) {
      console.error('Error in review controller:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to create review',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':dressId/review/:reviewId/reply')
  @ApiOperation({ summary: 'Add a reply to a review' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reply added successfully' })
  async addReply(
    @Param('dressId') dressId: string,
    @Param('reviewId') reviewId: string,
    @Body() addReplyDto: AddReplyDto,
    @GetUser() user: User & Document,
  ) {
    const review = await this.reviewService.addReply(
      dressId,
      reviewId,
      addReplyDto,
      user.id,
      user.username || user.email,
    );
    
    return {
      success: true,
      message: 'Reply added successfully',
      data: review,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('review/:reviewId')
  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Review deleted successfully' })
  async delete(
    @Param('reviewId') reviewId: string,
    @GetUser() user: User & Document,
  ) {
    await this.reviewService.delete(
      reviewId,
      user.id,
      user.role === 'admin',
    );
    
    return {
      success: true,
      message: 'Review deleted successfully',
    };
  }
} 