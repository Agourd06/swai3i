import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesService } from './messages.service';
import { Message, MessageSchema } from './messages.schema';
import { UsersModule } from '../users/users.module';
import { MessagesGateway } from './messages.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UsersModule,
  ],
  providers: [MessagesGateway, MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
