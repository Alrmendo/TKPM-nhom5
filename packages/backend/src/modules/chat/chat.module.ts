import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatRestController } from './chat.rest.controller';
import { Chat, ChatSchema } from '../../models/chat.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
  ],
  controllers: [ChatRestController],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
