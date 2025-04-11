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
          rating: createReviewDto.rating,
          reviewText: createReviewDto.reviewText,
          reviewTextLength: createReviewDto.reviewText ? createReviewDto.reviewText.length : 0
        },
        userId: user?.id,
        userEmail: user?.email,
        username: user?.username,
        filesCount: files?.length || 0 
      });
    
      // Map file paths for storage
      const imagePaths = files ? files.map(file => `/uploads/reviews/${file.filename}`) : [];
      
      // Add dressId to DTO if not provided
      if (!createReviewDto.dressId) {
        createReviewDto.dressId = dressId;
      }
      
      // Ensure rating is a number
      if (typeof createReviewDto.rating === 'string') {
        createReviewDto.rating = Number(createReviewDto.rating);
      }
      
      // Clean up reviewText
      if (typeof createReviewDto.reviewText === 'string') {
        createReviewDto.reviewText = createReviewDto.reviewText.trim();
      }
      
      const review = await this.reviewService.create(
        createReviewDto,
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
      throw error;
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