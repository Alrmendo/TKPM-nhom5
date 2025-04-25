import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from '../../models/chat.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
  ) {}

  async createMessage(
    senderId: string,
    receiverId: string | null,
    message: string,
    senderRole: string,
  ): Promise<ChatDocument> {
    console.log('Creating message with:', { senderId, receiverId, message, senderRole });
    
    const newMessage = new this.chatModel({
      senderId,
      receiverId,
      message,
      senderRole,
      isRead: false,
    });
    
    return newMessage.save();
  }

  async getConversation(userId: string, adminId?: string): Promise<ChatDocument[]> {
    console.log('----- NEW CONVERSATION REQUEST -----');
    console.log('Getting conversation for userId:', userId, 'adminId:', adminId);
    
    try {
      // Kiểm tra tin nhắn với cả 2 ID
      console.log('Checking all messages in database...');
      const allMessages = await this.chatModel.find({}).exec();
      console.log(`Total messages in database: ${allMessages.length}`);
      console.log('Messages in database:');
      allMessages.forEach((msg, idx) => {
        console.log(`DB Message ${idx}: '${msg.message}' | From: ${msg.senderId} (${msg.senderRole}) | To: ${msg.receiverId || 'ADMIN'}`);
      });
      
      // --- TRƯỜC HẾT: Rất đơn giản, nếu có userID cụ thể, lấy tất cả tin nhắn có liên quan ---
      // Với mục đích gỡ lỗi, lấy tất cả tin nhắn mà liên quan đến userId này
      if (userId) {
        console.log(`Đơn giản hóa: Tìm tất cả tin nhắn liên quan đến userId: ${userId}`);
        const directQuery = {
          $or: [
            // Tin nhắn từ user này
            { senderId: userId },
            // Tin nhắn đến user này
            { receiverId: userId },
            // Tin nhắn từ user này đến ADMIN (null receiverId)
            { senderId: userId, receiverId: null },
            // Tin nhắn từ ADMIN gửi cho user này
            { receiverId: userId, senderRole: 'admin' }
          ]
        };
        
        const conversations = await this.chatModel.find(directQuery)
          .sort({ createdAt: 1 })
          .exec();
        
        console.log(`Tìm thấy ${conversations.length} tin nhắn liên quan đến userId ${userId}`);
        conversations.forEach((msg, i) => {
          console.log(`Related message ${i}: ${msg.message} | From: ${msg.senderId} (${msg.senderRole}) | To: ${msg.receiverId || 'ADMIN'}`);
        });
        
        return conversations;
      }
      
      // Các tình huống khác - những cái này như cũ nhưng sẽ không được gọi nếu có userId ở trên
      // Nếu có adminId, lấy cuộc trò chuyện giữa user cụ thể và admin
      // Ngược lại, lấy tất cả tin nhắn cho user
      let query;
      
      if (adminId) {
        // Cuộc trò chuyện cụ thể giữa user và admin
        query = {
          $or: [
            { senderId: userId, receiverId: adminId },
            { senderId: adminId, receiverId: userId },
          ],
        };
      } else {
        // Kiểm tra nếu ID này là admin hay là user 
        const foundMessages = await this.chatModel.find({ $or: [{ senderId: userId }, { receiverId: userId }] }).exec();
        console.log(`Found ${foundMessages.length} messages related to this userId`);  
        
        const adminMessages = foundMessages.filter(msg => msg.senderRole === 'admin' && msg.senderId === userId);
        const isAdmin = adminMessages.length > 0;
        console.log(`Request is from a${isAdmin ? 'n admin' : ' user'}`);
        
        if (isAdmin) {
          // Admin đang xem cuộc trò chuyện của một người dùng cụ thể
          console.log('ADMIN viewing conversation, incoming requestId:', userId);
          
          // Lấy tất cả tin nhắn liên quan đến cuộc trò chuyện giữa admin và user này
          query = {
            $or: [
              // Tin nhắn từ user gửi cho admin (với receiverId=null)
              { receiverId: null, senderRole: 'user' },
              // Tin nhắn từ admin gửi cho user
              { senderId: userId, receiverId: { $ne: null } },
              // Tin nhắn từ user gửi cho admin
              { receiverId: userId }
            ],
          };
        } else {
          // User đang xem tin nhắn của họ
          query = {
            $or: [
              // Tin nhắn trực tiếp liên quan đến user này
              { senderId: userId },
              { receiverId: userId },
              // Tin nhắn từ user này đến admin (receiverId=null)
              { senderId: userId, receiverId: null },
            ],
          };
        }
      }
      
      console.log('Query:', JSON.stringify(query));
      
      const conversations = await this.chatModel.find(query)
        .sort({ createdAt: 1 })
        .exec();
      
      console.log(`Found ${conversations.length} messages for conversation`);
      
      // Log each message for debugging
      if (conversations.length > 0) {
        conversations.forEach((msg, i) => {
          console.log(`Message ${i}: ${msg.message} | From: ${msg.senderId} (${msg.senderRole}) | To: ${msg.receiverId || 'ADMIN'}`);
        });
      } else {
        console.log('No messages found for this conversation');
      }
      
      return conversations;
    } catch (error) {
      console.error('Error in getConversation:', error);
      return [];
    }
  }

  async getUnreadMessages(userId: string): Promise<ChatDocument[]> {
    return this.chatModel.find({
      receiverId: userId,
      isRead: false,
    })
    .populate('senderId', 'name email role')
    .exec();
  }

  async markAsRead(messageId: string): Promise<ChatDocument> {
    return this.chatModel.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true },
    ).exec();
  }

  async getAdminConversations(): Promise<any[]> {
    console.log('Getting admin conversations');
    
    // Get distinct users who have sent messages
    const distinctUsers = await this.chatModel.aggregate([
      {
        // Match all messages from users, including those with null receiverId
        $match: { 
          senderRole: 'user',
        }
      },
      {
        $group: {
          _id: '$senderId',
          lastMessage: { $last: '$message' },
          lastMessageTime: { $last: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [{ $eq: ['$isRead', false] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: { 
          path: '$userDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          userId: '$_id',
          name: { $ifNull: ['$userDetails.name', 'Unknown User'] },
          email: { $ifNull: ['$userDetails.email', ''] },
          lastMessage: 1,
          lastMessageTime: 1,
          unreadCount: 1
        }
      }
    ]);

    console.log('Found admin conversations:', distinctUsers.length);
    return distinctUsers;
  }
}
