import { Controller, Get, Param, UseGuards, Request, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/role.decorators';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

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
    const conversations = await this.chatService.getAdminConversations();
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
