import { Controller, Get, Post, Put, Delete, Param, UseGuards, Request, HttpException, HttpStatus, ForbiddenException } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { OrderStatus } from '../../models/entities/order.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getUserOrders(@Request() req) {
    try {
      const orders = await this.orderService.getUserOrders(req.user.userId);
      return {
        success: true,
        data: orders
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to fetch orders'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getOrderById(@Request() req, @Param('id') orderId: string) {
    try {
      const order = await this.orderService.getOrderById(orderId);
      
      // Ensure user owns the order
      if (order.userId.toString() !== req.user.userId) {
        throw new ForbiddenException('You do not have permission to view this order');
      }
      
      return {
        success: true,
        data: order
      };
    } catch (error) {
      const status = error instanceof ForbiddenException 
        ? HttpStatus.FORBIDDEN 
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
      const order = await this.orderService.createOrder(req.user.userId);
      return {
        success: true,
        data: order
      };
    } catch (error) {
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
      if (order.userId.toString() !== req.user.userId) {
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
} 