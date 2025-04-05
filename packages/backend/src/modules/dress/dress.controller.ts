import { Controller, Get, Param, Query, UseGuards, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { DressService } from './dress.service';
import { Dress } from '../../models/entities/dress.entity';

@Controller('dress')
export class DressController {
  constructor(private readonly dressService: DressService) {}

  /**
   * Get all dresses
   */
  @Get()
  async findAll(): Promise<{ success: boolean; data: Dress[] }> {
    try {
      const dresses = await this.dressService.findAll();
      return {
        success: true,
        data: dresses,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to fetch dresses',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get most popular dresses
   */
  @Get('popular')
  async findMostPopular(
    @Query('limit') limit: number
  ): Promise<{ success: boolean; data: Dress[] }> {
    try {
      const popularDresses = await this.dressService.findMostPopular(limit);
      return {
        success: true,
        data: popularDresses,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to fetch popular dresses',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get dress by ID
   */
  @Get(':id')
  async findById(
    @Param('id') id: string
  ): Promise<{ success: boolean; data: Dress }> {
    try {
      const dress = await this.dressService.findById(id);
      return {
        success: true,
        data: dress,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.NOT_FOUND
        );
      }
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to fetch dress',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get similar dresses
   */
  @Get(':id/similar')
  async findSimilar(
    @Param('id') id: string,
    @Query('limit') limit: number
  ): Promise<{ success: boolean; data: Dress[] }> {
    try {
      const similarDresses = await this.dressService.findSimilar(id, limit);
      return {
        success: true,
        data: similarDresses,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            success: false,
            message: error.message,
          },
          HttpStatus.NOT_FOUND
        );
      }
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to fetch similar dresses',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 