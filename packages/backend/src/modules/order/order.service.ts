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
    return this.orderModel.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderModel.find()
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .sort({ createdAt: -1 })
      .exec();
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
    
    // Update order status to CANCELLED
    
    // Return stock to inventory
    for (const item of order.items) {
      const dress = await this.dressService.findById(item.dressId.toString());
      if (dress) {
        // Sửa cách truy cập size và color
        const variant = dress.variants.find(
          v => v.size.toString() === item.size || v.color.toString() === item.color
        );
        
        if (variant) {
          variant.stock += item.quantity;
          await this.dressService.update(item.dressId.toString(), { variants: dress.variants });
        }
      }
    }
    
    // Sửa cách cập nhật order thay vì dùng save()
    return await this.orderModel.findByIdAndUpdate(
      orderId,
      { status: OrderStatus.CANCELLED },
      { new: true }
    );
  }

  async updateShippingAddress(orderId: string, shippingAddress: any): Promise<Order> {
    // Sửa cách cập nhật order thay vì dùng save()
    return await this.orderModel.findByIdAndUpdate(
      orderId,
      { shippingAddress: shippingAddress },
      { new: true }
    );
  }

  async processPayment(orderId: string, paymentMethod: any): Promise<Order> {
    console.log(`Processing payment for order ${orderId} with payment method:`, paymentMethod);
    
    // Sửa cách cập nhật order thay vì dùng save()
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      orderId,
      { 
        paymentMethod: paymentMethod,
        status: OrderStatus.CONFIRMED
      },
      { new: true }
    );
    
    console.log(`Order ${orderId} status updated to confirmed after payment processing`);
    return updatedOrder;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.getOrderById(orderId);
    
    // Perform status-specific operations if needed
    if (status === OrderStatus.DELIVERED) {
      // Handle delivery logic - could update inventory, notify user, etc.
      console.log(`Order ${orderId} marked as delivered`);
    } else if (status === OrderStatus.RETURNED) {
      // Handle return logic - could update inventory, initiate refund, etc.
      console.log(`Order ${orderId} marked as returned`);
    }
    
    // Update the order status
    return await this.orderModel.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string): Promise<Order> {
    const order = await this.getOrderById(orderId);
    
    console.log(`Updating payment status for order ${orderId} to ${paymentStatus}`);
    
    // Perform payment status-specific operations if needed
    if (paymentStatus === 'paid') {
      // Handle paid logic - could trigger shipping, notify user, etc.
      console.log(`Order ${orderId} payment marked as paid`);
    } else if (paymentStatus === 'refunded') {
      // Handle refund logic - could update inventory, etc.
      console.log(`Order ${orderId} payment marked as refunded`);
    }
    
    // Update the payment status
    return await this.orderModel.findByIdAndUpdate(
      orderId,
      { paymentStatus: paymentStatus },
      { new: true }
    );
  }
}