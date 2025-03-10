import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './messages.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class MessagesService {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = new this.messageModel(createMessageDto);
    await message.save();
    return this.messageModel
      .findById(message._id)
      .populate('sender', '_id username')
      .populate('receiver', '_id username')
      .exec();
  }

  async getMessagesByRoom(room: string): Promise<Message[]> {
    return this.messageModel
      .find({ room })
      .sort({ createdAt: 1 })
      .populate('sender', '_id username')
      .populate('receiver', '_id username')
      .exec();
  }

  async markAsRead(messageId: string): Promise<Message> {
    return this.messageModel
      .findByIdAndUpdate(messageId, { isRead: true }, { new: true })
      .exec();
  }

  async findAll(): Promise<Message[]> {
    return this.messageModel
      .find()
      .populate('sender', 'username')
      .populate('receiver', 'username')
      .populate('course', 'title')
      .exec();
  }

  async getMessagesByChannel(channelId: Types.ObjectId): Promise<Message[]> {
    const messages = await this.messageModel
      .find({ channel: channelId })
      .sort({ createdAt: 1 })
      .lean();
  
    return messages as Message[]; 
  }
  
  
  async findOne(id: string): Promise<Message> {
    return this.messageModel.findById(id).exec();
  }

  async updateMessage(id: string, data: UpdateMessageDto): Promise<Message> {
    return this.messageModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteMessage(id: string): Promise<Message> {
    return this.messageModel.findByIdAndDelete(id).exec();
  }
}
