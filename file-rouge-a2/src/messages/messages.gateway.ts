import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '../auth/ws-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway(3001, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  namespace: '/',
  transports: ['websocket']
})
@UseGuards(WsAuthGuard)
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() 
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, room: string) {
    console.log(`Client ${client.id} joined room: ${room}`);
    client.join(room);
    return { event: 'joinedRoom', data: room };
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    console.log(`Client ${client.id} left room: ${room}`);
    return { event: 'leftRoom', data: room };
  }

  @SubscribeMessage('newMessage')
  async handleMessage(client: Socket, payload: CreateMessageDto) {
    try {
      // Create message only once here
      const message = await this.messagesService.createMessage(payload);
      
      // Broadcast to everyone in the room including sender
      this.server.to(payload.room).emit('newMessage', message);
      console.log(`Message sent in room ${payload.room}:`, message);
      return { event: 'messageSent', data: message };
    } catch (error) {
      console.error('Error sending message:', error);
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('fetchMessages')
  async handleFetchMessages(client: Socket, room: string) {
    try {
      const messages = await this.messagesService.getMessagesByRoom(room);
      client.emit('messages', messages);
      return { event: 'messagesFetched', data: messages };
    } catch (error) {
      console.error('Error fetching messages:', error);
      client.emit('error', { message: 'Failed to fetch messages' });
    }
  }
}