import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderItem, OrderStatus } from '../../models/entities/order.entity';
import { CartService } from '../cart/cart.service';
import { DressService } from '../dress/dress.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private cartService: CartService,
    private dressService: DressService
  ) {}

  async createOrder(userId: string): Promise<Order> {
    // Get the user's cart
    const cart = await this.cartService.getCart(userId);
    
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Calculate total amount
    let totalAmount = 0;
    
    const orderItems: OrderItem[] = [];
    
    for (const item of cart.items) {
      // Calculate number of days between start and end dates
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      const itemTotal = item.pricePerDay * days * item.quantity;
      totalAmount += itemTotal;
      
      // Create order item
      orderItems.push({
        dressId: item.dressId,
        name: item.name,
        image: item.image,
        size: item.sizeName,
        color: item.colorName,
        quantity: item.quantity,
        pricePerDay: item.pricePerDay
      });
      
      // Update dress stock
      const dress = await this.dressService.findById(item.dressId.toString());
      if (dress) {
        const variant = dress.variants.find(
          v => v.size._id.toString() === item.sizeId.toString() && 
               v.color._id.toString() === item.colorId.toString()
        );
        
        if (variant) {
          variant.stock -= item.quantity;
          await this.dressService.update(item.dressId.toString(), { variants: dress.variants });
        }
      }
    }
    
    // Create order
    const order = await this.orderModel.create({
      userId: new Types.ObjectId(userId),
      items: orderItems,
      startDate: cart.items[0].startDate,
      endDate: cart.items[0].endDate,
      arrivalDate: cart.items[0].arrivalDate,
      returnDate: cart.items[0].returnDate,
      status: OrderStatus.PENDING,
      totalAmount
    });
    
    // Clear cart after successful order creation
    await this.cartService.clearCart(userId);
    
    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }

  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderModel.findById(orderId);
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    
    return order;
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const order = await this.getOrderById(orderId);
    
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.UNDER_REVIEW) {
      throw new Error('Order cannot be cancelled at this stage');
    }
    
    // Restore dress stock
    for (const item of order.items) {
      const dress = await this.dressService.findById(item.dressId.toString());
      if (dress) {
        // Find the matching variant by size and color
        // Note: We need to find the variant by name since we don't store IDs in the order
        const variant = dress.variants.find(
          v => (v.size['label'] === item.size || v.size.toString() === item.size) && 
               (v.color['name'] === item.color || v.color.toString() === item.color)
        );
        
        if (variant) {
          variant.stock += item.quantity;
          await this.dressService.update(item.dressId.toString(), { variants: dress.variants });
        }
      }
    }
    
    // Update order status
    await this.orderModel.updateOne(
      { _id: new Types.ObjectId(orderId) },
      { $set: { status: OrderStatus.CANCELLED } }
    );
    
    return this.getOrderById(orderId);
  }
} 