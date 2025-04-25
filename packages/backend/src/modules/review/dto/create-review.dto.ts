import { IsNotEmpty, IsNumber, IsString, Min, Max, IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @ApiProperty({
    description: 'ID of the dress being reviewed',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsNotEmpty()
  @IsMongoId()
  dressId: string;

  @ApiProperty({
    description: 'Rating from 1 to 5 stars',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Review text/comment',
    example: 'This dress was absolutely perfect for my wedding day!',
  })
  @IsNotEmpty()
  @IsString()
  reviewText: string;
  
  @ApiProperty({
    description: 'User ID for review',
    example: '60d21b4667d0d8992e610c85',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  userId?: string;
} 