import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private userSocketMap = new Map<string, string>(); // userId -> socketId

  constructor(private readonly chatService: ChatService) {}

  afterInit() {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    
    // Remove user from the map
    for (const [userId, socketId] of this.userSocketMap.entries()) {
      if (socketId === client.id) {
        this.userSocketMap.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('register')
  handleRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string, role: string },
  ) {
    if (data.userId) {
      this.userSocketMap.set(data.userId, client.id);
      console.log(`User ${data.userId} registered with socket ${client.id}, role: ${data.role}`);
      
      // Join room based on role
      if (data.role === 'admin') {
        client.join('admin-room');
        console.log(`Admin joined admin-room`);
      } else {
        client.join(`user-${data.userId}`);
        console.log(`User joined user-${data.userId} room`);
      }

      return { status: 'success', message: 'Registered successfully' };
    }
    return { status: 'error', message: 'User ID is required' };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { 
      senderId: string, 
      receiverId: string, 
      message: string, 
      senderRole: string 
    },
  ) {
    try {
      console.log('Received message data:', data);
      
      // For user messages from users, we don't store specific admin receiverId
      // Instead, we'll store null for the receiverId and use the role for routing
      let receiverId = data.receiverId;
      
      if (data.senderRole === 'user' && (!receiverId || receiverId.trim() === '')) {
        receiverId = null; // Don't set a specific receiverId for messages to admin
        console.log('Message from user to admin - setting receiverId to null');
      }

      // Save message to database
      const chat = await this.chatService.createMessage(
        data.senderId,
        receiverId,
        data.message,
        data.senderRole,
      );

      console.log('Created chat message:', chat);

      // Broadcast the message to appropriate recipients
      if (data.senderRole === 'admin') {
        // If sender is admin, emit to specific user's room
        console.log('Emitting to user room:', `user-${receiverId}`);
        this.server.to(`user-${receiverId}`).emit('newMessage', chat);
      } else {
        // If sender is user, emit to all admins in admin room
        console.log('Emitting to admin room');
        this.server.to('admin-room').emit('newMessage', chat);
      }

      // Also emit back to sender's socket for immediate feedback
      console.log('Emitting back to sender');
      client.emit('newMessage', chat);

      return { status: 'success', data: chat };
    } catch (error) {
      console.error('Error sending message:', error);
      return { status: 'error', message: error.message };
    }
  }

  @SubscribeMessage('getConversation')
  async getConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string, adminId?: string },
  ) {
    try {
      console.log('Getting conversation for:', data);
      const messages = await this.chatService.getConversation(data.userId, data.adminId);
      console.log(`Found ${messages.length} messages for conversation`);
      return { status: 'success', data: messages };
    } catch (error) {
      console.error('Error retrieving conversation:', error);
      return { status: 'error', message: error.message };
    }
  }

  @SubscribeMessage('markAsRead')
  async markAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string },
  ) {
    try {
      const message = await this.chatService.markAsRead(data.messageId);
      return { status: 'success', data: message };
    } catch (error) {
      console.error('Error marking message as read:', error);
      return { status: 'error', message: error.message };
    }
  }
}
