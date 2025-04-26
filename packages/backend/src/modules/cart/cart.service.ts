import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartItem } from '../../models/entities/cart.entity';
import { DressService } from '../dress/dress.service';
import { addDays, subDays } from 'date-fns';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private dressService: DressService
  ) {}

  async getCart(userId: string): Promise<Cart> {
    console.log('Getting cart for user:', userId);
    // Find or create cart for user
    let cart = await this.cartModel.findOne({ userId: new Types.ObjectId(userId) });
    
    if (!cart) {
      console.log('Cart not found, creating new cart for user:', userId);
      cart = await this.cartModel.create({ 
        userId: new Types.ObjectId(userId),
        items: []
      });
      console.log('New cart created:', cart);
    } else {
      console.log('Existing cart found:', cart);
    }
    
    return cart;
  }

  async addToCart(userId: string, itemData: {
    dressId: string;
    sizeId: string;
    colorId: string;
    quantity: number;
    startDate: Date;
    endDate: Date;
    purchaseType?: 'buy' | 'rent';
  }): Promise<Cart> {
    console.log('Adding to cart for user:', userId, 'Item data:', itemData);
    
    // Validate dress exists
    const dress = await this.dressService.findById(itemData.dressId);
    if (!dress) {
      console.error('Dress not found:', itemData.dressId);
      throw new NotFoundException(`Dress with ID ${itemData.dressId} not found`);
    }
    console.log('Dress found:', dress.name);

    // Check stock availability
    const variant = dress.variants.find(
      v => v.size._id.toString() === itemData.sizeId && v.color._id.toString() === itemData.colorId
    );
    
    if (!variant) {
      console.error('Variant not found for size/color:', itemData.sizeId, itemData.colorId);
      throw new Error('The selected dress variant is not available');
    }
    
    if (variant.stock < itemData.quantity) {
      console.error('Insufficient stock. Available:', variant.stock, 'Requested:', itemData.quantity);
      throw new Error('The selected dress variant is not available in the requested quantity');
    }
    
    console.log('Variant found with sufficient stock:', variant);

    // Find the size and color names
    const sizeName = variant.size['label'] || 'Unknown Size';
    const colorName = variant.color['name'] || 'Unknown Color';
    console.log('Size and color names:', sizeName, colorName);

    // Calculate arrival and return dates
    const arrivalDate = subDays(new Date(itemData.startDate), 1);
    const returnDate = addDays(new Date(itemData.endDate), 2);
    console.log('Rental period:', itemData.startDate, 'to', itemData.endDate);
    console.log('Arrival and return dates:', arrivalDate, returnDate);

    // Find or create cart for user
    let cart = await this.getCart(userId);
    console.log('Cart before adding item:', cart);

    // Create cart item
    const cartItem: CartItem = {
      dressId: new Types.ObjectId(itemData.dressId),
      name: dress.name,
      image: dress.images[0] || '',
      sizeId: new Types.ObjectId(itemData.sizeId),
      sizeName,
      colorId: new Types.ObjectId(itemData.colorId),
      colorName,
      quantity: itemData.quantity,
      pricePerDay: dress.dailyRentalPrice,
      purchasePrice: dress.purchasePrice,
      purchaseType: itemData.purchaseType || 'rent', // Mặc định là thuê nếu không xác định
      startDate: new Date(itemData.startDate),
      endDate: new Date(itemData.endDate),
      arrivalDate,
      returnDate
    };
    
    console.log('Cart item to add:', cartItem);

    // Add item to cart
    const updateResult = await this.cartModel.updateOne(
      { userId: new Types.ObjectId(userId) },
      { $push: { items: cartItem } }
    );
    
    console.log('Update result:', updateResult);

    return this.getCart(userId);
  }

  async removeFromCart(userId: string, itemIndex: number | string): Promise<Cart> {
    // Handle removal by index
    if (typeof itemIndex === 'number') {
      console.log('Removing item at index', itemIndex, 'for user', userId);
      const cart = await this.getCart(userId);

      if (itemIndex < 0 || itemIndex >= cart.items.length) {
        console.error('Invalid item index:', itemIndex, 'Cart items length:', cart.items.length);
        throw new Error('Invalid item index');
      }

      console.log('Cart before removing item:', cart);
      
      try {
        // Use MongoDB's array syntax to remove the element at the specified position
        await this.cartModel.updateOne(
          { userId: new Types.ObjectId(userId) },
          { $unset: { [`items.${itemIndex}`]: 1 } }
        );
        
        // Then compact the array to remove null entries
        await this.cartModel.updateOne(
          { userId: new Types.ObjectId(userId) },
          { $pull: { items: null } }
        );
        
        console.log('Item removed successfully');
        
        return this.getCart(userId);
      } catch (error) {
        console.error('Error removing item from cart:', error);
        throw error;
      }
    } 
    // Handle removal by dressId
    else {
      console.log('Removing item with dressId', itemIndex, 'for user', userId);
      const dressId = itemIndex;
      try {
        await this.cartModel.updateOne(
          { userId: new Types.ObjectId(userId) },
          { $pull: { items: { dressId: new Types.ObjectId(dressId) } } }
        );
        
        console.log('Item removed successfully by dressId');
        return this.getCart(userId);
      } catch (error) {
        console.error('Error removing item from cart by dressId:', error);
        throw error;
      }
    }
  }

  async updateCartItemDates(
    userId: string, 
    itemIndex: number, 
    startDate: Date, 
    endDate: Date
  ): Promise<Cart> {
    console.log('Updating dates for item at index', itemIndex, 'for user', userId);
    console.log('New dates:', startDate, endDate);
    
    const cart = await this.getCart(userId);

    if (itemIndex < 0 || itemIndex >= cart.items.length) {
      console.error('Invalid item index:', itemIndex, 'Cart items length:', cart.items.length);
      throw new Error('Invalid item index');
    }

    // Calculate new arrival and return dates
    const arrivalDate = subDays(new Date(startDate), 1);
    const returnDate = addDays(new Date(endDate), 2);
    console.log('New arrival and return dates:', arrivalDate, returnDate);

    // Update the item's dates using MongoDB's positional operator
    try {
      const updateResult = await this.cartModel.updateOne(
        { userId: new Types.ObjectId(userId) },
        { 
          $set: { 
            [`items.${itemIndex}.startDate`]: new Date(startDate),
            [`items.${itemIndex}.endDate`]: new Date(endDate),
            [`items.${itemIndex}.arrivalDate`]: arrivalDate,
            [`items.${itemIndex}.returnDate`]: returnDate
          } 
        }
      );
      
      console.log('Update result:', updateResult);
      return this.getCart(userId);
    } catch (error) {
      console.error('Error updating dates:', error);
      throw error;
    }
  }

  async clearCart(userId: string): Promise<Cart> {
    console.log('Clearing cart for user:', userId);
    try {
      const updateResult = await this.cartModel.updateOne(
        { userId: new Types.ObjectId(userId) },
        { $set: { items: [] } }
      );
      console.log('Clear cart result:', updateResult);
      return this.getCart(userId);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
} 