import { Controller, Get, Post, Put, Delete, Param, UseGuards, Request, HttpException, HttpStatus, ForbiddenException, Body, NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { OrderStatus, PaymentStatus } from '../../models/entities/order.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  
  @Get('/track/:orderCode')
  async trackOrder(@Param('orderCode') orderCode: string) {
    try {
      const trackingInfo = await this.orderService.trackOrder(orderCode);
      
      return {
        success: true,
        data: trackingInfo
      };
    } catch (error) {
      console.error(`Error tracking order ${orderCode}:`, error);
      const status = error instanceof NotFoundException
        ? HttpStatus.NOT_FOUND
        : HttpStatus.INTERNAL_SERVER_ERROR;
          
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to track order'
      }, status);
    }
  }
  
  @Get('/track-by-phone/:phone')
  async trackOrderByPhone(@Param('phone') phone: string) {
    try {
      const trackingInfoList = await this.orderService.trackOrderByPhone(phone);
      
      return {
        success: true,
        data: trackingInfoList
      };
    } catch (error) {
      console.error(`Error tracking order with phone ${phone}:`, error);
      const status = error instanceof NotFoundException
        ? HttpStatus.NOT_FOUND
        : HttpStatus.INTERNAL_SERVER_ERROR;
          
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to track order by phone'
      }, status);
    }
  }

  @Get('user')
  async getUserOrders(@Request() req) {
    try {
      console.log('Getting orders for user:', req.user);
      if (!req.user || !req.user.id) {
        throw new Error('User authentication problem - invalid user ID');
      }
      
      const orders = await this.orderService.getUserOrders(req.user.id);
      
      return {
        success: true,
        data: orders
      };
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to fetch orders'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('admin')
  async getAllOrders(@Request() req) {
    try {
      // Check if user has admin role
      if (req.user.role !== 'admin') {
        throw new ForbiddenException('You do not have permission to view all orders');
      }
      
      const orders = await this.orderService.getAllOrders();
      
      return {
        success: true,
        data: orders
      };
    } catch (error) {
      console.error('Error fetching all orders:', error);
      const status = error instanceof ForbiddenException 
        ? HttpStatus.FORBIDDEN 
        : HttpStatus.INTERNAL_SERVER_ERROR;
        
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to fetch orders'
      }, status);
    }
  }

  @Get(':id')
  async getOrderById(@Request() req, @Param('id') orderId: string) {
    try {
      console.log(`Getting order ${orderId} for user:`, req.user);
      if (!req.user || !req.user.id) {
        throw new Error('User authentication problem - invalid user ID');
      }
      
      const order = await this.orderService.getOrderById(orderId);
      
      // Ensure user owns the order or has admin permissions
      if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new ForbiddenException('You do not have permission to view this order');
      }
      
      return {
        success: true,
        data: order
      };
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      const status = error instanceof ForbiddenException 
        ? HttpStatus.FORBIDDEN 
        : error instanceof NotFoundException
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR;
        
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to fetch order'
      }, status);
    }
  }

  @Post('create')
  async createOrder(@Request() req) {
    try {
      // Use req.user.id instead of req.user.userId to match the JWT strategy's user object
      console.log('Creating order - User object:', req.user);
      
      // Check if we have a valid user ID
      if (!req.user || !req.user.id) {
        throw new Error('User authentication problem - invalid user ID');
      }
      
      const order = await this.orderService.createOrder(req.user.id);
      return {
        success: true,
        data: order
      };
    } catch (error) {
      console.error('Order creation error:', error);
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to create order'
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('cancel/:id')
  async cancelOrder(@Request() req, @Param('id') orderId: string) {
    try {
      // Verify user owns the order
      const order = await this.orderService.getOrderById(orderId);
      if (order.userId.toString() !== req.user.id) {
        throw new ForbiddenException('You do not have permission to cancel this order');
      }
      
      // Check if the order can be cancelled
      if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.UNDER_REVIEW) {
        throw new HttpException({
          success: false,
          message: 'Order cannot be cancelled at this stage'
        }, HttpStatus.BAD_REQUEST);
      }
      
      const cancelledOrder = await this.orderService.cancelOrder(orderId);
      return {
        success: true,
        data: cancelledOrder
      };
    } catch (error) {
      const status = error instanceof ForbiddenException 
        ? HttpStatus.FORBIDDEN 
        : HttpStatus.BAD_REQUEST;
        
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to cancel order'
      }, status);
    }
  }

  @Put(':id/shipping')
  async updateShippingAddress(@Request() req, @Param('id') orderId: string, @Body() body: { address: any }) {
    try {
      // Verify user owns the order
      const order = await this.orderService.getOrderById(orderId);
      if (order.userId.toString() !== req.user.id) {
        throw new ForbiddenException('You do not have permission to update this order');
      }
      
      // Check if the order can be updated
      if (order.status !== OrderStatus.PENDING) {
        throw new HttpException({
          success: false,
          message: 'Order cannot be updated at this stage'
        }, HttpStatus.BAD_REQUEST);
      }
      
      const updatedOrder = await this.orderService.updateShippingAddress(orderId, body.address);
      return {
        success: true,
        data: updatedOrder
      };
    } catch (error) {
      const status = error instanceof ForbiddenException 
        ? HttpStatus.FORBIDDEN 
        : HttpStatus.BAD_REQUEST;
        
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to update shipping address'
      }, status);
    }
  }

  @Post(':id/payment')
  async processPayment(@Request() req, @Param('id') orderId: string, @Body() body: { paymentMethod: any }) {
    try {
      // Verify user owns the order
      const order = await this.orderService.getOrderById(orderId);
      if (order.userId.toString() !== req.user.id) {
        throw new ForbiddenException('You do not have permission to update this order');
      }
      
      // Check if the order can be processed
      if (order.status !== OrderStatus.PENDING) {
        throw new HttpException({
          success: false,
          message: 'Order cannot be processed at this stage'
        }, HttpStatus.BAD_REQUEST);
      }
      
      // Process payment and update order status
      const processedOrder = await this.orderService.processPayment(orderId, body.paymentMethod);
      return {
        success: true,
        data: processedOrder
      };
    } catch (error) {
      const status = error instanceof ForbiddenException 
        ? HttpStatus.FORBIDDEN 
        : HttpStatus.BAD_REQUEST;
        
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to process payment'
      }, status);
    }
  }

  @Put(':id/status')
  async updateOrderStatus(@Request() req, @Param('id') orderId: string, @Body() body: { status: OrderStatus }) {
    try {
      // Only admin users can update order status
      if (req.user.role !== 'admin') {
        throw new ForbiddenException('You do not have permission to update order status');
      }
      
      // Validate the status
      if (!Object.values(OrderStatus).includes(body.status)) {
        throw new HttpException({
          success: false,
          message: 'Invalid order status'
        }, HttpStatus.BAD_REQUEST);
      }
      
      // Update order status
      const updatedOrder = await this.orderService.updateOrderStatus(orderId, body.status);
      return {
        success: true,
        data: updatedOrder
      };
    } catch (error) {
      const status = error instanceof ForbiddenException 
        ? HttpStatus.FORBIDDEN 
        : error instanceof NotFoundException
          ? HttpStatus.NOT_FOUND
          : HttpStatus.BAD_REQUEST;
        
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to update order status'
      }, status);
    }
  }

  @Put(':id/payment-status')
  async updatePaymentStatus(@Request() req, @Param('id') orderId: string, @Body() body: { paymentStatus: string }) {
    try {
      // Only admin users can update payment status
      if (req.user.role !== 'admin') {
        throw new ForbiddenException('You do not have permission to update payment status');
      }
      
      // Validate the payment status
      if (!Object.values(PaymentStatus).includes(body.paymentStatus as PaymentStatus)) {
        throw new HttpException({
          success: false,
          message: 'Invalid payment status'
        }, HttpStatus.BAD_REQUEST);
      }
      
      // Update payment status
      const updatedOrder = await this.orderService.updatePaymentStatus(orderId, body.paymentStatus);
      return {
        success: true,
        data: updatedOrder
      };
    } catch (error) {
      const status = error instanceof ForbiddenException 
        ? HttpStatus.FORBIDDEN 
        : error instanceof NotFoundException
          ? HttpStatus.NOT_FOUND
          : HttpStatus.BAD_REQUEST;
        
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to update payment status'
      }, status);
    }
  }
  
  @Post(':id/process-return')
  async processReturn(@Request() req, @Param('id') orderId: string, @Body() body: {
    condition: 'perfect' | 'good' | 'damaged',
    damageDescription?: string,
    additionalCharges?: number,
    sendPaymentReminder: boolean
  }) {
    try {
      // Only admin users can process returns
      if (req.user.role !== 'admin') {
        throw new ForbiddenException('You do not have permission to process returns');
      }
      
      // Validate the condition
      const validConditions = ['perfect', 'good', 'damaged'];
      if (!validConditions.includes(body.condition)) {
        throw new HttpException({
          success: false,
          message: 'Invalid condition value'
        }, HttpStatus.BAD_REQUEST);
      }
      
      // If condition is damaged, require a description
      if (body.condition === 'damaged' && (!body.damageDescription || body.damageDescription.trim() === '')) {
        throw new HttpException({
          success: false,
          message: 'Damage description is required when condition is damaged'
        }, HttpStatus.BAD_REQUEST);
      }
      
      // Process the return
      const updatedOrder = await this.orderService.processReturn(orderId, {
        condition: body.condition as 'perfect' | 'good' | 'damaged',
        damageDescription: body.damageDescription,
        additionalCharges: body.additionalCharges || 0,
        sendPaymentReminder: body.sendPaymentReminder === undefined ? true : body.sendPaymentReminder
      });
      
      return {
        success: true,
        data: updatedOrder,
        message: `Return processed successfully${body.sendPaymentReminder ? ' and payment reminder email sent' : ''}`
      };
    } catch (error) {
      console.error('Error processing return:', error);
      
      const status = error instanceof ForbiddenException 
        ? HttpStatus.FORBIDDEN 
        : error instanceof NotFoundException
          ? HttpStatus.NOT_FOUND
          : HttpStatus.BAD_REQUEST;
        
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to process return'
      }, status);
    }
  }
} 