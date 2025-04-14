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
  PhotographyBookingQueryDto
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

  // HELPER METHODS
  
  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
  }
}
