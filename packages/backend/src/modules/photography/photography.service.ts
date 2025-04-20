import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { 
  PhotographyService as PhotographyServiceModel, 
  PhotographyBooking, 
  PhotographyServiceStatus,
  BookingStatus
} from '../../models/photography.model';
import { 
  CreatePhotographyServiceDto, 
  UpdatePhotographyServiceDto, 
  CreatePhotographyBookingDto,
  UpdatePhotographyBookingDto,
  PhotographyBookingQueryDto,
  CreatePhotographyBookingWithPaymentDto
} from './dto/photography.dto';

@Injectable()
export class PhotographyService {
  constructor(
    @InjectModel(PhotographyServiceModel.name) 
    private photographyServiceModel: Model<PhotographyServiceModel>,
    @InjectModel(PhotographyBooking.name)
    private photographyBookingModel: Model<PhotographyBooking>
  ) {}

  // PHOTOGRAPHY SERVICE MANAGEMENT (ADMIN)
  
  async createService(createDto: CreatePhotographyServiceDto): Promise<PhotographyServiceModel> {
    const newService = new this.photographyServiceModel(createDto);
    return await newService.save();
  }

  async getAllServices(status?: PhotographyServiceStatus): Promise<PhotographyServiceModel[]> {
    const query = status ? { status } : {};
    return await this.photographyServiceModel.find(query).exec();
  }

  async getServiceById(id: string): Promise<PhotographyServiceModel> {
    this.validateObjectId(id);
    
    const service = await this.photographyServiceModel.findById(id).exec();
    if (!service) {
      throw new NotFoundException(`Photography service with ID ${id} not found`);
    }
    
    return service;
  }

  async updateService(id: string, updateDto: UpdatePhotographyServiceDto): Promise<PhotographyServiceModel> {
    this.validateObjectId(id);
    
    const updatedService = await this.photographyServiceModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
      
    if (!updatedService) {
      throw new NotFoundException(`Photography service with ID ${id} not found`);
    }
    
    return updatedService;
  }

  async updateServiceStatus(id: string, status: PhotographyServiceStatus): Promise<PhotographyServiceModel> {
    this.validateObjectId(id);
    
    const updatedService = await this.photographyServiceModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
      
    if (!updatedService) {
      throw new NotFoundException(`Photography service with ID ${id} not found`);
    }
    
    return updatedService;
  }

  async deleteService(id: string): Promise<{ deleted: boolean }> {
    this.validateObjectId(id);
    
    // Check if this service has any bookings
    const bookingCount = await this.photographyBookingModel.countDocuments({ 
      serviceId: new Types.ObjectId(id),
      status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] }
    });
    
    if (bookingCount > 0) {
      throw new BadRequestException('Cannot delete service with active bookings');
    }
    
    const result = await this.photographyServiceModel.deleteOne({ _id: id }).exec();
    return { deleted: result.deletedCount > 0 };
  }

  // PHOTOGRAPHY BOOKING MANAGEMENT (CUSTOMER)
  
  async createBooking(userId: string, createDto: CreatePhotographyBookingDto): Promise<PhotographyBooking> {
    this.validateObjectId(userId);
    this.validateObjectId(createDto.serviceId);
    
    // Check if service exists and is available
    const service = await this.photographyServiceModel.findById(createDto.serviceId).exec();
    if (!service) {
      throw new NotFoundException(`Photography service with ID ${createDto.serviceId} not found`);
    }
    
    if (service.status !== PhotographyServiceStatus.AVAILABLE) {
      throw new BadRequestException(`This photography service is currently not available for booking`);
    }
    
    // Create booking
    const booking = new this.photographyBookingModel({
      ...createDto,
      customerId: userId,
      bookingDate: new Date(),
      status: BookingStatus.PENDING,
    });
    
    return await booking.save();
  }

  async getAllBookings(query: PhotographyBookingQueryDto): Promise<PhotographyBooking[]> {
    return await this.photographyBookingModel
      .find(query)
      .populate('serviceId')
      .populate('customerId', 'name email')
      .exec();
  }

  async getCustomerBookings(customerId: string): Promise<PhotographyBooking[]> {
    this.validateObjectId(customerId);
    
    return await this.photographyBookingModel
      .find({ customerId: new Types.ObjectId(customerId) })
      .populate('serviceId')
      .exec();
  }

  async getBookingById(id: string): Promise<PhotographyBooking> {
    this.validateObjectId(id);
    
    const booking = await this.photographyBookingModel
      .findById(id)
      .populate('serviceId')
      .populate('customerId', 'name email')
      .exec();
      
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    return booking;
  }

  async updateBooking(id: string, userId: string, updateDto: UpdatePhotographyBookingDto): Promise<PhotographyBooking> {
    this.validateObjectId(id);
    this.validateObjectId(userId);
    
    // Find booking and verify ownership
    const booking = await this.photographyBookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    // Only allow customers to update their own bookings that are in PENDING status
    if (booking.customerId.toString() !== userId || booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('You cannot update this booking');
    }
    
    // Update booking
    const updatedBooking = await this.photographyBookingModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate('serviceId')
      .exec();
      
    return updatedBooking;
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<PhotographyBooking> {
    this.validateObjectId(id);
    
    // Find booking
    const booking = await this.photographyBookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    // Update booking status
    const updatedBooking = await this.photographyBookingModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('serviceId')
      .populate('customerId', 'name email')
      .exec();
      
    return updatedBooking;
  }

  async cancelBooking(id: string, userId: string): Promise<PhotographyBooking> {
    this.validateObjectId(id);
    this.validateObjectId(userId);
    
    // Find booking and verify ownership
    const booking = await this.photographyBookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    // Only allow customers to cancel their own bookings that are not already completed or cancelled
    if (
      booking.customerId.toString() !== userId || 
      ![BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(booking.status as BookingStatus)
    ) {
      throw new BadRequestException('You cannot cancel this booking');
    }
    
    // Update booking status to CANCELLED
    const updatedBooking = await this.photographyBookingModel
      .findByIdAndUpdate(id, { status: BookingStatus.CANCELLED }, { new: true })
      .populate('serviceId')
      .exec();
      
    return updatedBooking;
  }

  async createBookingAfterPayment(
    userId: string, 
    bookingData: CreatePhotographyBookingWithPaymentDto
  ): Promise<any> {
    try {
      console.log('PhotographyService - Creating booking after payment for user:', userId);
      console.log('PhotographyService - Booking data:', JSON.stringify(bookingData));
      
      // Validate userId with better error messaging
      if (!userId) {
        throw new BadRequestException('User ID is missing or undefined');
      }
      
      try {
        this.validateObjectId(userId);
      } catch (error) {
        console.error('Invalid userId format:', userId);
        throw new BadRequestException(`Invalid user ID format: ${userId}`);
      }
      
      const savedBookings = [];
      
      // Process each booking item one by one
      for (const item of bookingData.bookingItems) {
        // Validate serviceId with better error handling
        if (!item.serviceId) {
          throw new BadRequestException('Service ID is missing in booking item');
        }
        
        try {
          this.validateObjectId(item.serviceId);
        } catch (error) {
          console.error('Invalid serviceId format:', item.serviceId);
          throw new BadRequestException(`Invalid service ID format: ${item.serviceId}`);
        }
        
        // Validate service exists and get its price
        const service = await this.photographyServiceModel.findById(item.serviceId);
        if (!service) {
          throw new NotFoundException(`Service with ID ${item.serviceId} not found`);
        }
        
        console.log('PhotographyService - Found service:', service.name, 'price:', service.price);
        
        // Create booking document with correct structure
        // Convert string IDs to MongoDB ObjectId
        const newBooking = {
          customerId: new Types.ObjectId(userId),
          serviceId: new Types.ObjectId(item.serviceId),
          bookingDate: new Date(),
          shootingDate: new Date(item.shootingDate),
          shootingTime: item.shootingTime || '10:00 AM',
          shootingLocation: item.shootingLocation,
          additionalRequests: item.additionalRequests || '',
          status: BookingStatus.CONFIRMED,
          paymentDetails: {
            paymentMethod: bookingData.paymentDetails.paymentMethod,
            totalAmount: service.price,
            depositAmount: service.price * 0.5,
            remainingAmount: service.price * 0.5,
            depositPaid: true,
            fullyPaid: false
          }
        };
        
        console.log('PhotographyService - Creating new booking with data:', JSON.stringify(newBooking));
        
        // Create and save booking directly
        const booking = new this.photographyBookingModel(newBooking);
        const savedBooking = await booking.save();
        
        if (!savedBooking) {
          throw new Error(`Failed to save booking for service ${service.name}`);
        }
        
        console.log('PhotographyService - Successfully saved booking with ID:', savedBooking._id);
        savedBookings.push(savedBooking);
      }
      
      console.log(`PhotographyService - Successfully created ${savedBookings.length} bookings`);
      
      return {
        success: true,
        bookings: savedBookings
      };
    } catch (error) {
      console.error('PhotographyService - Error saving photography bookings:', error);
      throw error;
    }
  }

  // STATISTICS AND ANALYTICS

  async getBookingStatistics() {
    // Total bookings
    const totalBookings = await this.photographyBookingModel.countDocuments();
    
    // Bookings by status
    const statusCounts = await this.photographyBookingModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Organize status counts
    const bookingsByStatus = {};
    statusCounts.forEach(item => {
      bookingsByStatus[item._id] = item.count;
    });
    
    // Bookings by package type (requires a lookup to get the package type)
    const bookingsByPackageType = await this.photographyBookingModel.aggregate([
      {
        $lookup: {
          from: 'photographyservices',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'service'
        }
      },
      { $unwind: '$service' },
      { $group: { _id: '$service.packageType', count: { $sum: 1 } } }
    ]);
    
    // Bookings by month (for the current year)
    const currentYear = new Date().getFullYear();
    const bookingsByMonth = await this.photographyBookingModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $year: '$bookingDate' }, currentYear]
          }
        }
      },
      {
        $group: {
          _id: { $month: '$bookingDate' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Recent bookings
    const recentBookings = await this.photographyBookingModel.find()
      .populate('serviceId')
      .populate('customerId', 'name email')
      .sort({ bookingDate: -1 })
      .limit(5)
      .exec();
      
    // Average bookings per month
    const avgBookingsPerMonth = totalBookings / 12; // Simple calculation, can be improved
    
    // Return compiled statistics
    return {
      totalBookings,
      bookingsByStatus,
      bookingsByPackageType,
      bookingsByMonth,
      recentBookings,
      avgBookingsPerMonth
    };
  }

  // HELPER METHODS
  
  private validateObjectId(id: string): void {
    if (!id) {
      throw new BadRequestException(`ID is undefined or empty`);
    }
    
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
  }
}
