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
        pricePerDay: item.pricePerDay,
        purchaseType: item.purchaseType || 'rent'  // Thêm trường purchaseType
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
    
    // Clear the cart after successful order creation
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
  
  // Xử lý đơn hàng trả lại
  async processReturn(orderId: string, returnData: {
    condition: 'perfect' | 'good' | 'damaged',
    damageDescription?: string,
    additionalCharges?: number,
    sendPaymentReminder: boolean
  }): Promise<Order> {
    try {
      console.log(`Processing return for order ${orderId}`, returnData);
      const order = await this.getOrderById(orderId);
      
      // Kiểm tra các điều kiện hợp lệ
      if (order.status === OrderStatus.RETURNED) {
        throw new Error('Order has already been returned');
      }
      
      if (returnData.condition === 'damaged' && !returnData.damageDescription) {
        throw new Error('Damage description is required for damaged items');
      }
      
      // Tính toán phí phụ thu (additional charges) nếu có
      let remainingPayment = 0;
      if (returnData.additionalCharges && returnData.additionalCharges > 0) {
        remainingPayment = returnData.additionalCharges;
      }
      
      // Cập nhật trạng thái đơn hàng
      const updatedOrder = await this.orderModel.findByIdAndUpdate(
        orderId,
        {
          status: OrderStatus.RETURNED,
          returnCondition: returnData.condition,
          damageDescription: returnData.damageDescription || '',
          additionalCharges: returnData.additionalCharges || 0,
          remainingPayment: remainingPayment,
          returnDate: new Date()
        },
        { new: true }
      );
      
      // Gửi email nhắc nhở thanh toán (nếu có)
      if (returnData.sendPaymentReminder && remainingPayment > 0) {
        // Logic gửi email ở đây
        console.log(`Sending payment reminder email for order ${orderId} with remaining payment of ${remainingPayment}`);
        // TODO: Implement email sending
      }
      
      // Trả về kết quả
      return updatedOrder;
    } catch (error) {
      console.error(`Error processing return for order ${orderId}:`, error);
      throw error;
    }
  }

  // Phương thức tra cứu đơn hàng theo mã đơn hàng
  async trackOrder(orderCode: string): Promise<any> {
    try {
      console.log(`Tìm kiếm đơn hàng với mã đơn hàng: ${orderCode}`);
      // Tìm đơn hàng bằng mã đơn hàng
      const order = await this.orderModel.findOne({ orderNumber: orderCode })
        .populate({
          path: 'userId',
          select: 'name email firstName lastName username'
        })
        .populate({
          path: 'items.dressId',
          select: 'name images'
        })
        .exec();
      
      if (!order) {
        throw new NotFoundException(`Không tìm thấy đơn hàng với mã '${orderCode}'`);
      }
      
      // Chuyển document Mongoose thành JavaScript object
      const orderData = JSON.parse(JSON.stringify(order));
      
      // Xử lý và định dạng dữ liệu trả về cho API
      return this.formatOrderTracking(orderData);
    } catch (error) {
      console.error(`Lỗi khi tìm đơn hàng theo mã ${orderCode}:`, error);
      throw error;
    }
  }
  
  // Phương thức tra cứu đơn hàng theo số điện thoại
  async trackOrderByPhone(phone: string): Promise<any[]> {
    try {
      console.log(`Tìm kiếm đơn hàng với số điện thoại: ${phone}`);
      // Chuẩn hóa số điện thoại để tìm kiếm (loại bỏ dấu cách, dấu +, dấu gạch nối)
      const formattedPhone = phone.replace(/[\s+\-]/g, '');
      
      // Tìm kiếm đơn hàng có số điện thoại này trong phần shippingAddress
      const query = { 'shippingAddress.phone': { $regex: formattedPhone, $options: 'i' } };
      
      console.log('Query:', JSON.stringify(query));
      
      // Tìm các đơn hàng có số điện thoại này
      const orders = await this.orderModel.find(query)
        .populate({
          path: 'userId',
          select: 'name email firstName lastName username phone'
        })
        .populate({
          path: 'items.dressId',
          select: 'name images'
        })
        .sort({ createdAt: -1 })
        .exec();
      
      console.log(`Tìm thấy ${orders.length} đơn hàng`);
        
      if (!orders || orders.length === 0) {
        throw new NotFoundException(`Không tìm thấy đơn hàng với số điện thoại '${phone}'`);
      }
      
      // Chuyển và định dạng mỗi đơn hàng tìm được
      const formattedOrders = orders.map(order => {
        const orderData = JSON.parse(JSON.stringify(order));
        return this.formatOrderTracking(orderData, phone);
      });
      
      return formattedOrders;
    } catch (error) {
      console.error(`Lỗi khi tìm đơn hàng theo số điện thoại ${phone}:`, error);
      throw error;
    }
  }
  
  // Phương thức định dạng dữ liệu đơn hàng cho API theo dõi
  private formatOrderTracking(orderData: any, phone?: string): any {
    // Tạo dữ liệu trạng thái vận chuyển
    let trackingStatus = 'processing';
    let trackingInfo = null;
    
    // Map trạng thái đơn hàng sang trạng thái tiến trình
    switch (orderData.status) {
      case OrderStatus.PENDING:
        trackingStatus = 'processing';
        break;
      case OrderStatus.CONFIRMED:
        trackingStatus = 'packed';
        break;
      case OrderStatus.SHIPPED:
        trackingStatus = 'shipped';
        break;
      case OrderStatus.DELIVERED:
        trackingStatus = 'delivered';
        break;
      case OrderStatus.RETURNED:
        trackingStatus = 'returned';
        break;
      default:
        trackingStatus = 'processing';
    }
    
    // Nếu đơn hàng đã được giao hoặc đang được vận chuyển, tạo thông tin vận chuyển
    if (orderData.status === OrderStatus.SHIPPED || 
        orderData.status === OrderStatus.DELIVERED || 
        orderData.status === OrderStatus.RETURNED) {
      trackingInfo = {
        trackingNumber: orderData.trackingNumber || `TK-${orderData.orderNumber?.substring(0, 6) || '000000'}`,
        carrier: 'VietNam Express',
        deliveryDate: orderData.arrivalDate || 
                    (orderData.status === OrderStatus.DELIVERED ? new Date() : null)
      };
    }
    
    // Lấy thông tin người dùng (nếu có)
    const userData = orderData.userId || {};
    const userName = userData.firstName && userData.lastName 
      ? `${userData.firstName} ${userData.lastName}` 
      : userData.name || userData.username || 'Unknown';
    
    // Định dạng các item trong đơn hàng
    const formattedItems = Array.isArray(orderData.items) ? orderData.items.map(item => {
      return {
        id: item._id || 'unknown',
        orderCode: orderData.orderNumber,
        productName: item.name || 'Unknown Product',
        quantity: item.quantity || 1,
        price: item.pricePerDay || 0,
        status: orderData.status
      };
    }) : [];
    
    // Trả về dữ liệu được định dạng
    return {
      orderCode: orderData.orderNumber || `ORD-${orderData._id?.substring(0, 6) || '000000'}`,
      status: trackingStatus,
      trackingInfo,
      createdAt: orderData.createdAt || new Date(),
      updatedAt: orderData.updatedAt || new Date(),
      totalAmount: orderData.totalAmount || 0,
      items: formattedItems,
      customerInfo: {
        name: userName,
        email: userData.email || 'Unknown',
        address: orderData.shippingAddress ? 
              `${orderData.shippingAddress.address || ''}, ${orderData.shippingAddress.city || ''}, ${orderData.shippingAddress.province || ''}` : 
              'No address provided',
        phone: orderData.shippingAddress?.phone || phone || 'Unknown'
      }
    };
  }
}