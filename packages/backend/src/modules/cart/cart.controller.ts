import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, HttpException, HttpStatus, ForbiddenException } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Request() req) {
    try {
      console.log('GET /cart - User:', req.user);
      
      if (!req.user || !req.user.userId) {
        console.error('User or userId is missing from request:', req.user);
        throw new HttpException({
          success: false,
          message: 'User authentication problem - userId missing'
        }, HttpStatus.UNAUTHORIZED);
      }
      
      const cart = await this.cartService.getCart(req.user.userId);
      return {
        success: true,
        data: cart
      };
    } catch (error) {
      console.error('Error in getCart controller:', error);
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to fetch cart'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('add')
  async addToCart(
    @Request() req,
    @Body() itemData: {
      dressId: string;
      sizeId: string;
      colorId: string;
      quantity: number;
      startDate: string;
      endDate: string;
    }
  ) {
    try {
      console.log('POST /cart/add - User:', req.user);
      
      if (!req.user || !req.user.userId) {
        console.error('User or userId is missing from request:', req.user);
        throw new HttpException({
          success: false,
          message: 'User authentication problem - userId missing'
        }, HttpStatus.UNAUTHORIZED);
      }
      
      // Parse the dates
      const startDate = new Date(itemData.startDate);
      const endDate = new Date(itemData.endDate);
      
      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date format');
      }
      
      if (startDate > endDate) {
        throw new Error('Start date must be before end date');
      }
      
      const today = new Date();
      if (startDate < today) {
        throw new Error('Start date cannot be in the past');
      }

      const cart = await this.cartService.addToCart(req.user.userId, {
        ...itemData,
        startDate,
        endDate
      });

      return {
        success: true,
        data: cart
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to add item to cart'
      }, error instanceof ForbiddenException ? HttpStatus.FORBIDDEN : HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('remove/:index')
  async removeFromCart(@Request() req, @Param('index') index: number) {
    try {
      const cart = await this.cartService.removeFromCart(req.user.userId, index);
      return {
        success: true,
        data: cart
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to remove item from cart'
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('update-dates/:index')
  async updateDates(
    @Request() req,
    @Param('index') index: number,
    @Body() dateData: { startDate: string; endDate: string }
  ) {
    try {
      // Parse the dates
      const startDate = new Date(dateData.startDate);
      const endDate = new Date(dateData.endDate);
      
      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date format');
      }
      
      if (startDate > endDate) {
        throw new Error('Start date must be before end date');
      }
      
      const today = new Date();
      if (startDate < today) {
        throw new Error('Start date cannot be in the past');
      }

      const cart = await this.cartService.updateCartItemDates(
        req.user.userId,
        index,
        startDate,
        endDate
      );

      return {
        success: true,
        data: cart
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to update dates'
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('clear')
  async clearCart(@Request() req) {
    try {
      await this.cartService.clearCart(req.user.userId);
      return {
        success: true,
        message: 'Cart cleared successfully'
      };
    } catch (error) {
      throw new HttpException({
        success: false,
        message: error.message || 'Failed to clear cart'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 