import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddReplyDto {
  @ApiProperty({
    description: 'Reply text',
    example: 'Thank you for your review!',
  })
  @IsNotEmpty()
  @IsString()
  replyText: string;
} 