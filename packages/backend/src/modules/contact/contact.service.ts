import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from '../../models/entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name)
    private contactModel: Model<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const newContact = new this.contactModel(createContactDto);
    return newContact.save();
  }

  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactModel.findById(id).exec();
    if (!contact) {
      throw new NotFoundException(`Contact with ID "${id}" not found`);
    }
    return contact;
  }

  async update(id: string, updateData: Partial<Contact>): Promise<Contact> {
    const updatedContact = await this.contactModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    
    if (!updatedContact) {
      throw new NotFoundException(`Contact with ID "${id}" not found`);
    }
    
    return updatedContact;
  }

  async remove(id: string): Promise<void> {
    const result = await this.contactModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Contact with ID "${id}" not found`);
    }
  }

  async markAsContacted(id: string): Promise<Contact> {
    const updatedContact = await this.contactModel
      .findByIdAndUpdate(
        id, 
        { isContacted: true, status: 'contacted' },
        { new: true }
      )
      .exec();
    
    if (!updatedContact) {
      throw new NotFoundException(`Contact with ID "${id}" not found`);
    }
    
    return updatedContact;
  }

  async updateStatus(id: string, status: string): Promise<Contact> {
    const updatedContact = await this.contactModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    
    if (!updatedContact) {
      throw new NotFoundException(`Contact with ID "${id}" not found`);
    }
    
    return updatedContact;
  }
} 