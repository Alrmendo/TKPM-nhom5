import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, NotFoundException, HttpException, HttpStatus, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { DressService } from './dress.service';
import { Dress } from '../../models/entities/dress.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/role.decorators';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('dress')
export class DressController {
  constructor(
    private readonly dressService: DressService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

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

  /**
   * Create a new dress
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() dressData: Partial<Dress>,
    @UploadedFiles() images: Express.Multer.File[]
  ): Promise<{ success: boolean; data: Dress }> {
    try {
      // Process incoming data (handle JSON strings if necessary)
      if (typeof dressData.description === 'string') {
        dressData.description = JSON.parse(dressData.description as unknown as string);
      }
      
      if (typeof dressData.variants === 'string') {
        dressData.variants = JSON.parse(dressData.variants as unknown as string);
      }

      // Upload images to Cloudinary if provided
      const imageUrls: string[] = [];
      
      if (images && images.length > 0) {
        for (const image of images) {
          const imageUrl = await this.cloudinaryService.uploadImage(image);
          imageUrls.push(imageUrl);
        }
        dressData.images = imageUrls;
      }

      // Create dress
      const createdDress = await this.dressService.create(dressData);
      
      return {
        success: true,
        data: createdDress,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to create dress',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Update an existing dress
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() dressData: Partial<Dress>,
    @UploadedFiles() images: Express.Multer.File[]
  ): Promise<{ success: boolean; data: Dress }> {
    try {
      // Process incoming data (handle JSON strings if necessary)
      if (typeof dressData.description === 'string') {
        dressData.description = JSON.parse(dressData.description as unknown as string);
      }
      
      if (typeof dressData.variants === 'string') {
        console.log('Raw variants data:', dressData.variants);
        dressData.variants = JSON.parse(dressData.variants as unknown as string);
        console.log('Parsed variants:', dressData.variants);
      }

      // Upload new images to Cloudinary if provided
      if (images && images.length > 0) {
        const newImageUrls: string[] = [];
        
        for (const image of images) {
          const imageUrl = await this.cloudinaryService.uploadImage(image);
          newImageUrls.push(imageUrl);
        }

        // Get existing dress to merge images
        const existingDress = await this.dressService.findById(id);
        dressData.images = [...(existingDress.images || []), ...newImageUrls];
      }

      // Update dress
      const updatedDress = await this.dressService.update(id, dressData);
      
      return {
        success: true,
        data: updatedDress,
      };
    } catch (error) {
      console.error('Error updating dress:', error);
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
          message: error.message || 'Failed to update dress',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Delete a dress
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(
    @Param('id') id: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.dressService.remove(id);
      
      return {
        success: true,
        message: `Dress with ID ${id} successfully deleted`,
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
          message: error.message || 'Failed to delete dress',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Delete an image from a dress
   */
  @Delete(':id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async removeImage(
    @Param('id') id: string,
    @Body('imageUrl') imageUrl: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Get existing dress
      const dress = await this.dressService.findById(id);
      
      // Remove image URL from images array
      const updatedImages = dress.images.filter(img => img !== imageUrl);
      
      // Update dress with new images array
      await this.dressService.update(id, { images: updatedImages });
      
      return {
        success: true,
        message: `Image removed from dress with ID ${id}`,
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
          message: error.message || 'Failed to remove image',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 