import { Controller, Get, Param, UseGuards, Request, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/role.decorators';

@Controller('api/chat')
export class ChatRestController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('conversation')
  async getCurrentUserConversation(@Request() req) {
    const currentUser = req.user;
    const userId = currentUser._id.toString();
    
    console.log('Getting conversation for current user:', userId);
    const messages = await this.chatService.getConversation(userId);
    
    return {
      success: true,
      messages
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('conversation/:userId')
  async getConversation(@Param('userId') userId: string, @Request() req) {
    const currentUser = req.user;
    
    // Admin can view any conversation, users can only view their own
    if (currentUser.role !== 'admin' && currentUser._id.toString() !== userId) {
      return {
        success: false,
        message: 'Unauthorized to view this conversation'
      };
    }
    
    const messages = await this.chatService.getConversation(userId);
    return {
      success: true,
      messages
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread')
  async getUnreadMessages(@Request() req) {
    const currentUser = req.user;
    const messages = await this.chatService.getUnreadMessages(currentUser._id);
    return {
      success: true,
      count: messages.length,
      messages
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('conversations')
  async getAdminConversations() {
    console.log('API - Getting admin conversations');
    const conversations = await this.chatService.getAdminConversations();
    console.log('API - Found conversations:', conversations.length);
    
    // Ensure we have valid conversations data
    if (conversations && conversations.length > 0) {
      conversations.forEach(conv => {
        console.log('Conversation:', conv.userId, conv.name);
      });
    } else {
      console.log('No conversations found');
    }
    
    return {
      success: true,
      conversations
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('mark-read/:messageId')
  async markAsRead(@Param('messageId') messageId: string, @Request() req) {
    const message = await this.chatService.markAsRead(messageId);
    return {
      success: true,
      message
    };
  }
}
