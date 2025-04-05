import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dress, DressDocument } from '../../models/entities/dress.entity';

@Injectable()
export class DressService {
  constructor(
    @InjectModel(Dress.name) private dressModel: Model<DressDocument>,
  ) {}

  /**
   * Get all dresses
   */
  async findAll(): Promise<Dress[]> {
    try {
      return await this.dressModel.find().exec();
    } catch (error) {
      throw new Error(`Error fetching dresses: ${error.message}`);
    }
  }

  /**
   * Get most popular dresses based on ratings and reviews
   */
  async findMostPopular(limit: number = 5): Promise<Dress[]> {
    try {
      // Get dresses with highest average rating
      return await this.dressModel.aggregate([
        { $addFields: { 
          avgRating: { $avg: "$ratings.rate" },
          reviewCount: { $size: "$reviews" }
        }},
        { $sort: { 
          avgRating: -1,
          reviewCount: -1 
        }},
        { $limit: limit }
      ]).exec();
    } catch (error) {
      throw new Error(`Error fetching popular dresses: ${error.message}`);
    }
  }

  /**
   * Get dress by ID
   */
  async findById(id: string): Promise<Dress> {
    try {
      const dress = await this.dressModel.findById(id)
        .populate('variants.size')
        .populate('variants.color')
        .exec();

      if (!dress) {
        throw new NotFoundException(`Dress with ID ${id} not found`);
      }

      return dress;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error fetching dress: ${error.message}`);
    }
  }

  /**
   * Find similar dresses based on style or material
   */
  async findSimilar(id: string, limit: number = 4): Promise<Dress[]> {
    try {
      const dress = await this.dressModel.findById(id);
      
      if (!dress) {
        throw new NotFoundException(`Dress with ID ${id} not found`);
      }

      return await this.dressModel.find({
        _id: { $ne: id },
        $or: [
          { style: dress.style },
          { material: dress.material }
        ]
      })
      .limit(limit)
      .exec();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error fetching similar dresses: ${error.message}`);
    }
  }
} 