import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotographyService } from './photography.service';
import { 
  CreatePhotographyServiceDto, 
  UpdatePhotographyServiceDto, 
  CreatePhotographyBookingDto,
  UpdatePhotographyBookingDto,
  PhotographyBookingQueryDto,
  CreatePhotographyBookingWithPaymentDto
} from './dto/photography.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/role.decorators';
import { BookingStatus, PhotographyServiceStatus } from '../../models/photography.model';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('photography')
export class PhotographyController {
  constructor(
    private readonly photographyService: PhotographyService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // PUBLIC ENDPOINTS (NO AUTH)
  
  @Get('services')
  async getAllServices(@Query('status') status?: PhotographyServiceStatus) {
    return this.photographyService.getAllServices(status);
  }

  @Get('services/:id')
  async getServiceById(@Param('id') id: string) {
    return this.photographyService.getServiceById(id);
  }

  // CUSTOMER ENDPOINTS
  
  @UseGuards(JwtAuthGuard)
  @Post('bookings')
  async createBooking(@Request() req, @Body() createDto: CreatePhotographyBookingDto) {
    // The JWT strategy returns id, not userId (see jwt.strategy.ts)
    return this.photographyService.createBooking(req.user.id, createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('bookings/confirm-after-payment')
  async createBookingAfterPayment(
    @Request() req, 
    @Body() bookingData: CreatePhotographyBookingWithPaymentDto
  ) {
    console.log('Received booking data:', JSON.stringify(bookingData));
    console.log('User request object:', JSON.stringify(req.user));
    
    // The JWT strategy returns id, not userId (see jwt.strategy.ts)
    const userId = req.user.id; 
    
    if (!userId) {
      console.error('User ID is missing in the request');
      throw new BadRequestException('User ID is required');
    }
    
    console.log('Using User ID:', userId);
    
    try {
      const result = await this.photographyService.createBookingAfterPayment(userId, bookingData);
      console.log('Booking result:', JSON.stringify(result));
      return result;
    } catch (error) {
      console.error('Error in createBookingAfterPayment controller:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('bookings/my-bookings')
  async getMyBookings(@Request() req) {
    // The JWT strategy returns id, not userId (see jwt.strategy.ts)
    return this.photographyService.getCustomerBookings(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('bookings/:id')
  async getBookingById(@Request() req, @Param('id') id: string) {
    const booking = await this.photographyService.getBookingById(id);
    // Simple security check to ensure users can only view their own bookings
    if (booking.customerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return { error: 'You do not have permission to view this booking' };
    }
    return booking;
  }

  @UseGuards(JwtAuthGuard)
  @Put('bookings/:id')
  async updateBooking(
    @Request() req, 
    @Param('id') id: string, 
    @Body() updateDto: UpdatePhotographyBookingDto
  ) {
    // The JWT strategy returns id, not userId (see jwt.strategy.ts)
    return this.photographyService.updateBooking(id, req.user.id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('bookings/:id/cancel')
  async cancelBooking(@Request() req, @Param('id') id: string) {
    return this.photographyService.cancelBooking(id, req.user.id);
  }
}

@Controller('admin/photography')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminPhotographyController {
  constructor(
    private readonly photographyService: PhotographyService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ADMIN SERVICES MANAGEMENT
  
  @Get('services')
  async getAllServices(@Query('status') status?: PhotographyServiceStatus) {
    return this.photographyService.getAllServices(status);
  }

  @Post('services')
  async createService(@Body() createDto: CreatePhotographyServiceDto) {
    return this.photographyService.createService(createDto);
  }

  @Put('services/:id')
  async updateService(@Param('id') id: string, @Body() updateDto: UpdatePhotographyServiceDto) {
    return this.photographyService.updateService(id, updateDto);
  }

  @Put('services/:id/status')
  async updateServiceStatus(@Param('id') id: string, @Body('status') status: PhotographyServiceStatus) {
    return this.photographyService.updateServiceStatus(id, status);
  }

  @Delete('services/:id')
  async deleteService(@Param('id') id: string) {
    return this.photographyService.deleteService(id);
  }

  // ADMIN BOOKINGS MANAGEMENT
  
  @Get('bookings')
  async getAllBookings(@Query() query: PhotographyBookingQueryDto) {
    return this.photographyService.getAllBookings(query);
  }

  @Get('bookings/statistics')
  async getBookingStatistics() {
    return this.photographyService.getBookingStatistics();
  }

  @Put('bookings/:id/status')
  async updateBookingStatus(@Param('id') id: string, @Body('status') status: BookingStatus) {
    return this.photographyService.updateBookingStatus(id, status);
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadServiceImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, WEBP, and GIF files are allowed.');
    }

    // Validate file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds the 5MB limit.');
    }

    try {
      // Upload to Cloudinary
      const imageUrl = await this.cloudinaryService.uploadImage(file);
      return { imageUrl };
    } catch (error) {
      throw new BadRequestException('Failed to upload image: ' + error.message);
    }
  }
}
