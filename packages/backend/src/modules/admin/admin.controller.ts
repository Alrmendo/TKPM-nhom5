// src/modules/admin/admin.controller.ts
import { Controller, Get, UseGuards, Param, Put, Delete, Body, NotFoundException, HttpException, HttpStatus, Query, Post, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard'; 
import { Roles } from '../../decorators/role.decorators';
import { RolesGuard } from '../../guards/roles.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Size } from '../../models/entities/size.entity';
import { Color } from '../../models/entities/color.entity';
import { User } from '../../models/entities/user.entity';
import { Order } from '../../models/entities/order.entity';
import { Dress } from '../../models/entities/dress.entity';
import { Appointment } from '../../models/entities/appointment.entity';
import { Contact } from '../../models/entities/contact.entity';
import * as moment from 'moment';
import { CustomerFitting } from '../../models/entities/customer-fitting.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(
    @InjectModel(Size.name) private sizeModel: Model<Size>,
    @InjectModel(Color.name) private colorModel: Model<Color>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Dress.name) private dressModel: Model<Dress>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
    @InjectModel(CustomerFitting.name) private customerFittingModel: Model<CustomerFitting>,
  ) {}

  @Get('style')
  @Roles('admin')
  getAdminPage() {
    return { message: 'Welcome Admin! This is the admin page data.' };
  }

  @Get('sizes')
  @Roles('admin')
  async getAllSizes() {
    try {
      const sizes = await this.sizeModel.find().exec();
      return {
        success: true,
        data: sizes,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch sizes',
      };
    }
  }

  @Get('colors')
  @Roles('admin')
  async getAllColors() {
    try {
      const colors = await this.colorModel.find().exec();
      return {
        success: true,
        data: colors,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch colors',
      };
    }
  }

  @Get('customers')
  @Roles('admin')
  async getAllCustomers() {
    try {
      const users = await this.userModel.find().exec();
      
      // Get order counts for each user
      const customersWithOrderCounts = await Promise.all(
        users.map(async (user) => {
          const orderCount = await this.orderModel.countDocuments({ userId: user._id });
          const lastLogin = user.updatedAt || user.createdAt;
          
          // Determine status (could be stored in DB in real implementation)
          let status = 'active';
          if (!user.isVerified) {
            status = 'inactive';
          }
          
          return {
            ...user.toJSON(),
            totalOrders: orderCount,
            lastLogin,
            status,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username
          };
        })
      );
      
      return {
        success: true,
        data: customersWithOrderCounts,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch customers',
      };
    }
  }

  @Get('customers/:id')
  @Roles('admin')
  async getCustomerById(@Param('id') id: string) {
    try {
      const user = await this.userModel.findById(id).exec();
      
      if (!user) {
        throw new NotFoundException('Customer not found');
      }
      
      const orderCount = await this.orderModel.countDocuments({ userId: user._id });
      const lastLogin = user.updatedAt || user.createdAt;
      
      // Determine status (could be stored in DB in real implementation)
      let status = 'active';
      if (!user.isVerified) {
        status = 'inactive';
      }
      
      return {
        success: true,
        data: {
          ...user.toJSON(),
          totalOrders: orderCount,
          lastLogin,
          status,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username
        },
      };
    } catch (error) {
      const status = error instanceof NotFoundException
        ? HttpStatus.NOT_FOUND
        : HttpStatus.INTERNAL_SERVER_ERROR;
        
      return {
        success: false,
        message: error.message || 'Failed to fetch customer',
        status
      };
    }
  }

  @Put('customers/:id/status')
  @Roles('admin')
  async updateCustomerStatus(@Param('id') id: string, @Body() data: { status: string }) {
    try {
      const { status } = data;
      
      if (!['active', 'inactive', 'blocked'].includes(status)) {
        throw new HttpException('Invalid status value', HttpStatus.BAD_REQUEST);
      }
      
      const user = await this.userModel.findById(id).exec();
      
      if (!user) {
        throw new NotFoundException('Customer not found');
      }
      
      // In a real implementation, you would store the status in the database
      // For this demo, we'll just modify the response
      
      // If status is 'inactive', we could update isVerified to false
      if (status === 'inactive') {
        user.isVerified = false;
        await user.save();
      } else if (status === 'active') {
        user.isVerified = true;
        await user.save();
      }
      
      const orderCount = await this.orderModel.countDocuments({ userId: user._id });
      const lastLogin = user.updatedAt || user.createdAt;
      
      return {
        success: true,
        data: {
          ...user.toJSON(),
          totalOrders: orderCount,
          lastLogin,
          status,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username
        },
      };
    } catch (error) {
      const status = error instanceof NotFoundException
        ? HttpStatus.NOT_FOUND
        : error instanceof HttpException
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR;
        
      return {
        success: false,
        message: error.message || 'Failed to update customer status',
        status
      };
    }
  }

  @Delete('customers/:id')
  @Roles('admin')
  async deleteCustomer(@Param('id') id: string) {
    try {
      const user = await this.userModel.findById(id).exec();
      
      if (!user) {
        throw new NotFoundException('Customer not found');
      }
      
      // In a production environment, you might want to:
      // 1. Check if the user has any active orders
      // 2. Implement soft-delete instead of hard delete
      // 3. Archive the user data for compliance reasons
      
      await this.userModel.findByIdAndDelete(id).exec();
      
      return {
        success: true,
        message: 'Customer deleted successfully',
      };
    } catch (error) {
      const status = error instanceof NotFoundException
        ? HttpStatus.NOT_FOUND
        : HttpStatus.INTERNAL_SERVER_ERROR;
        
      return {
        success: false,
        message: error.message || 'Failed to delete customer',
        status
      };
    }
  }

  @Get('dashboard/stats')
  @Roles('admin')
  async getDashboardStats(@Query('period') period: string = '30days') {
    try {
      // Determine date range based on period
      const endDate = moment();
      const startDate = moment().subtract(30, 'days');
      const previousStartDate = moment().subtract(60, 'days');
      const previousEndDate = moment().subtract(30, 'days');

      if (period === '7days') {
        startDate.add(23, 'days'); // Last 7 days
        previousStartDate.add(23, 'days'); // Previous 7 days
      } else if (period === '90days') {
        startDate.subtract(60, 'days'); // Last 90 days
        previousStartDate.subtract(60, 'days'); // Previous 90 days
      } else if (period === 'year') {
        startDate.subtract(335, 'days'); // Last 365 days
        previousStartDate.subtract(335, 'days'); // Previous 365 days
      }

      // Get current period totals
      const totalOrders = await this.orderModel.countDocuments({
        createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() }
      });

      const totalCustomers = await this.userModel.countDocuments({
        createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() }
      });

      // Count upcoming appointments (only the pending ones)
      const upcomingAppointments = await this.appointmentModel.countDocuments({
        status: 'pending'
      });

      // Chỉ tính doanh thu từ các đơn hàng đã thanh toán và không bị hủy
      const orderRevenue = await this.orderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
            paymentStatus: 'paid',  // Chỉ tính các đơn hàng đã thanh toán
            status: { $ne: 'cancelled' }  // Loại trừ các đơn hàng bị hủy
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]);
      const totalRevenue = orderRevenue.length > 0 ? orderRevenue[0].total : 0;

      // Get previous period totals for percentage change calculation
      const previousOrders = await this.orderModel.countDocuments({
        createdAt: { $gte: previousStartDate.toDate(), $lte: previousEndDate.toDate() }
      });

      const previousCustomers = await this.userModel.countDocuments({
        createdAt: { $gte: previousStartDate.toDate(), $lte: previousEndDate.toDate() }
      });

      // Count previous period's pending appointments
      const previousAppointments = await this.appointmentModel.countDocuments({
        createdAt: { 
          $gte: moment().subtract(14, 'days').toDate(), 
          $lte: moment().subtract(7, 'days').toDate() 
        },
        status: 'pending'
      });

      // Chỉ tính doanh thu từ các đơn hàng đã thanh toán và không bị hủy (cho giai đoạn trước)
      const previousRevenue = await this.orderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: previousStartDate.toDate(), $lte: previousEndDate.toDate() },
            paymentStatus: 'paid',  // Chỉ tính các đơn hàng đã thanh toán
            status: { $ne: 'cancelled' }  // Loại trừ các đơn hàng bị hủy
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]);
      const totalPreviousRevenue = previousRevenue.length > 0 ? previousRevenue[0].total : 0;

      // Calculate percentage changes
      const calculatePercentChange = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Number(((current - previous) / previous * 100).toFixed(1));
      };

      return {
        success: true,
        data: {
          totalOrders,
          totalCustomers,
          upcomingAppointments,
          totalRevenue,
          percentChange: {
            orders: calculatePercentChange(totalOrders, previousOrders),
            customers: calculatePercentChange(totalCustomers, previousCustomers),
            appointments: calculatePercentChange(upcomingAppointments, previousAppointments),
            revenue: calculatePercentChange(totalRevenue, totalPreviousRevenue)
          }
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch dashboard statistics'
      };
    }
  }

  @Get('dashboard/sales')
  @Roles('admin')
  async getMonthlySales(@Query('year') yearStr: string) {
    try {
      const year = yearStr ? parseInt(yearStr) : new Date().getFullYear();
      
      // Get monthly data for the specified year
      const monthlySales = await this.orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(year, 0, 1),
              $lt: new Date(year + 1, 0, 1)
            }
          }
        },
        {
          $group: {
            _id: { month: { $month: '$createdAt' } },
            sales: { $sum: '$totalAmount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.month': 1 } }
      ]);
      
      // Format the result
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const result = months.map((month, index) => {
        const monthData = monthlySales.find(item => item._id.month === index + 1);
        const sales = monthData ? monthData.sales : 0;
        // Calculate estimated profit (in a real implementation, this would be from actual data)
        const profit = Math.round(sales * 0.3); // Assuming 30% profit margin
        
        return {
          month,
          sales,
          profit,
          orders: monthData ? monthData.count : 0
        };
      });
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error fetching monthly sales:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch monthly sales data'
      };
    }
  }

  @Get('dashboard/products/top')
  @Roles('admin')
  async getTopProducts(@Query('limit') limitStr: string) {
    try {
      const limit = limitStr ? parseInt(limitStr) : 5;
      
      // Find top selling products by count in orders
      const topDressIds = await this.orderModel.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.dressId',
            count: { $sum: '$items.quantity' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: limit }
      ]);
      
      // Get dress details and calculate percentages
      const totalSold = topDressIds.reduce((sum, item) => sum + item.count, 0);
      
      const topProducts = await Promise.all(
        topDressIds.map(async (item) => {
          const dress = await this.dressModel.findById(item._id).exec();
          return {
            name: dress ? dress.name : 'Unknown Product',
            value: Math.round((item.count / totalSold) * 100) // as percentage
          };
        })
      );
      
      return {
        success: true,
        data: topProducts
      };
    } catch (error) {
      console.error('Error fetching top products:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch top products'
      };
    }
  }

  @Post('sizes')
  @Roles('admin')
  async createSize(@Body() data: { label: string }) {
    try {
      const { label } = data;
      
      if (!label || label.trim() === '') {
        throw new HttpException('Size label is required', HttpStatus.BAD_REQUEST);
      }
      
      // Kiểm tra size đã tồn tại chưa
      const existingSize = await this.sizeModel.findOne({ label }).exec();
      if (existingSize) {
        throw new HttpException('Size already exists', HttpStatus.CONFLICT);
      }
      
      const newSize = new this.sizeModel({ label });
      const savedSize = await newSize.save();
      
      return {
        success: true,
        data: savedSize,
        message: 'Size created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create size',
        status: error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      };
    }
  }
  
  @Put('sizes/:id')
  @Roles('admin')
  async updateSize(@Param('id') id: string, @Body() data: { label: string }) {
    try {
      const { label } = data;
      
      if (!label || label.trim() === '') {
        throw new HttpException('Size label is required', HttpStatus.BAD_REQUEST);
      }
      
      // Kiểm tra size tồn tại không
      const size = await this.sizeModel.findById(id).exec();
      if (!size) {
        throw new NotFoundException('Size not found');
      }
      
      // Kiểm tra tên mới đã tồn tại chưa (nếu khác với tên hiện tại)
      if (size.label !== label) {
        const existingSize = await this.sizeModel.findOne({ label }).exec();
        if (existingSize) {
          throw new HttpException('Size with this label already exists', HttpStatus.CONFLICT);
        }
      }
      
      size.label = label;
      const updatedSize = await size.save();
      
      return {
        success: true,
        data: updatedSize,
        message: 'Size updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update size',
        status: error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      };
    }
  }
  
  @Delete('sizes/:id')
  @Roles('admin')
  async deleteSize(@Param('id') id: string) {
    try {
      // Kiểm tra size tồn tại không
      const size = await this.sizeModel.findById(id).exec();
      if (!size) {
        throw new NotFoundException('Size not found');
      }
      
      // Kiểm tra xem size này có đang được sử dụng trong bất kỳ dress nào không
      const usedInDress = await this.dressModel.exists({
        'variants.size': id
      });
      
      if (usedInDress) {
        throw new HttpException('Cannot delete size that is used by dresses', HttpStatus.CONFLICT);
      }
      
      await this.sizeModel.findByIdAndDelete(id).exec();
      
      return {
        success: true,
        message: 'Size deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete size',
        status: error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      };
    }
  }
  
  @Post('colors')
  @Roles('admin')
  async createColor(@Body() data: { name: string; hexCode: string }) {
    try {
      const { name, hexCode } = data;
      
      if (!name || name.trim() === '') {
        throw new HttpException('Color name is required', HttpStatus.BAD_REQUEST);
      }
      
      if (!hexCode || !/^#[0-9A-F]{6}$/i.test(hexCode)) {
        throw new HttpException('Valid hex code is required (format: #RRGGBB)', HttpStatus.BAD_REQUEST);
      }
      
      // Kiểm tra color đã tồn tại chưa
      const existingColor = await this.colorModel.findOne({ 
        $or: [{ name }, { hexCode }] 
      }).exec();
      
      if (existingColor) {
        throw new HttpException(
          `Color with this ${existingColor.name === name ? 'name' : 'hex code'} already exists`, 
          HttpStatus.CONFLICT
        );
      }
      
      const newColor = new this.colorModel({ name, hexCode });
      const savedColor = await newColor.save();
      
      return {
        success: true,
        data: savedColor,
        message: 'Color created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create color',
        status: error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      };
    }
  }
  
  @Put('colors/:id')
  @Roles('admin')
  async updateColor(@Param('id') id: string, @Body() data: { name?: string; hexCode?: string }) {
    try {
      const { name, hexCode } = data;
      
      // Kiểm tra ít nhất một trường được cung cấp
      if ((!name || name.trim() === '') && (!hexCode || hexCode.trim() === '')) {
        throw new HttpException('Either name or hex code must be provided', HttpStatus.BAD_REQUEST);
      }
      
      // Kiểm tra format của hex code nếu được cung cấp
      if (hexCode && !/^#[0-9A-F]{6}$/i.test(hexCode)) {
        throw new HttpException('Valid hex code is required (format: #RRGGBB)', HttpStatus.BAD_REQUEST);
      }
      
      // Kiểm tra color tồn tại không
      const color = await this.colorModel.findById(id).exec();
      if (!color) {
        throw new NotFoundException('Color not found');
      }
      
      // Kiểm tra tên mới hoặc mã màu mới đã tồn tại chưa
      if ((name && name !== color.name) || (hexCode && hexCode !== color.hexCode)) {
        const query: any = { _id: { $ne: id } };
        
        if (name && name !== color.name) {
          query.name = name;
        }
        
        if (hexCode && hexCode !== color.hexCode) {
          query.hexCode = hexCode;
        }
        
        const existingColor = await this.colorModel.findOne(query).exec();
        if (existingColor) {
          const dupField = existingColor.name === name ? 'name' : 'hex code';
          throw new HttpException(`Color with this ${dupField} already exists`, HttpStatus.CONFLICT);
        }
      }
      
      // Cập nhật thông tin
      if (name) color.name = name;
      if (hexCode) color.hexCode = hexCode;
      
      const updatedColor = await color.save();
      
      return {
        success: true,
        data: updatedColor,
        message: 'Color updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update color',
        status: error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      };
    }
  }
  
  @Delete('colors/:id')
  @Roles('admin')
  async deleteColor(@Param('id') id: string) {
    try {
      // Kiểm tra color tồn tại không
      const color = await this.colorModel.findById(id).exec();
      if (!color) {
        throw new NotFoundException('Color not found');
      }
      
      // Kiểm tra xem color này có đang được sử dụng trong bất kỳ dress nào không
      const usedInDress = await this.dressModel.exists({
        'variants.color': id
      });
      
      if (usedInDress) {
        throw new HttpException('Cannot delete color that is used by dresses', HttpStatus.CONFLICT);
      }
      
      await this.colorModel.findByIdAndDelete(id).exec();
      
      return {
        success: true,
        message: 'Color deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete color',
        status: error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
      };
    }
  }

  // Customer Fitting endpoints
  @Get('customer-fittings')
  async getAllCustomerFittings() {
    try {
      const fittings = await this.customerFittingModel.find()
        .sort({ createdAt: -1 })
        .exec();
      
      return fittings;
    } catch (error) {
      throw new HttpException(
        'Error fetching customer fittings',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('customer-fittings/:id')
  async getCustomerFittingById(@Param('id') id: string) {
    try {
      const fitting = await this.customerFittingModel.findById(id).exec();
      
      if (!fitting) {
        throw new HttpException(
          'Customer fitting not found',
          HttpStatus.NOT_FOUND,
        );
      }
      
      return fitting;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error fetching customer fitting',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('customer-fittings')
  async createCustomerFitting(@Body() createFittingDto: any) {
    try {
      console.log('Creating customer fitting with data:', JSON.stringify(createFittingDto, null, 2));
      
      // Validate required fields explicitly
      if (!createFittingDto.userId) {
        throw new HttpException('userId is required', HttpStatus.BAD_REQUEST);
      }
      
      if (!createFittingDto.customerName) {
        throw new HttpException('customerName is required', HttpStatus.BAD_REQUEST);
      }
      
      if (!createFittingDto.email) {
        throw new HttpException('email is required', HttpStatus.BAD_REQUEST);
      }
      
      if (!createFittingDto.phone) {
        throw new HttpException('phone is required', HttpStatus.BAD_REQUEST);
      }
      
      if (!createFittingDto.measurements) {
        throw new HttpException('measurements are required', HttpStatus.BAD_REQUEST);
      }
      
      if (!createFittingDto.photographyConcept || createFittingDto.photographyConcept.trim() === '') {
        throw new HttpException('Photography concept is required', HttpStatus.BAD_REQUEST);
      }
      
      // Make sure preferredStyles is an array
      if (!Array.isArray(createFittingDto.preferredStyles)) {
        createFittingDto.preferredStyles = [];
      }
      
      // Make sure photoReferenceUrls is an array
      if (!Array.isArray(createFittingDto.photoReferenceUrls)) {
        createFittingDto.photoReferenceUrls = [];
      }
      
      // Set default status if not provided
      if (!createFittingDto.status) {
        createFittingDto.status = 'pending';
      }
      
      const newFitting = new this.customerFittingModel(createFittingDto);
      const savedFitting = await newFitting.save();
      
      return savedFitting;
    } catch (error) {
      console.error('Error creating customer fitting:', error);
      if (error instanceof HttpException) {
        throw error;
      } else if (error.name === 'ValidationError') {
        // Mongoose validation error
        const validationErrors = Object.keys(error.errors).map(field => {
          return `${field}: ${error.errors[field].message}`;
        });
        throw new HttpException(
          `Validation error: ${validationErrors.join(', ')}`,
          HttpStatus.BAD_REQUEST
        );
      } else {
        throw new HttpException(
          error.message || 'Error creating customer fitting',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Put('customer-fittings/:id')
  async updateCustomerFitting(
    @Param('id') id: string,
    @Body() updateFittingDto: any,
  ) {
    try {
      const updatedFitting = await this.customerFittingModel
        .findByIdAndUpdate(id, updateFittingDto, { new: true })
        .exec();
      
      if (!updatedFitting) {
        throw new HttpException(
          'Customer fitting not found',
          HttpStatus.NOT_FOUND,
        );
      }
      
      return updatedFitting;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error updating customer fitting',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('customer-fittings/:id')
  async deleteCustomerFitting(@Param('id') id: string) {
    try {
      const result = await this.customerFittingModel
        .findByIdAndDelete(id)
        .exec();
      
      if (!result) {
        throw new HttpException(
          'Customer fitting not found',
          HttpStatus.NOT_FOUND,
        );
      }
      
      return { success: true, message: 'Customer fitting deleted successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error deleting customer fitting',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('customer-fittings/:id/upload-photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhotoReference(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      // Here you would upload the file to your storage (like Cloudinary)
      // and get back a URL
      
      // For now, we'll just create a mock URL
      const photoUrl = `https://example.com/photos/${file.originalname}`;
      
      // Add the photo URL to the customer fitting's photoReferenceUrls array
      const fitting = await this.customerFittingModel.findById(id).exec();
      
      if (!fitting) {
        throw new HttpException(
          'Customer fitting not found',
          HttpStatus.NOT_FOUND,
        );
      }
      
      fitting.photoReferenceUrls.push(photoUrl);
      await fitting.save();
      
      return { url: photoUrl };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error uploading photo reference',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
