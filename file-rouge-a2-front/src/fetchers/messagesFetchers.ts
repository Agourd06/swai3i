import { axiosInstance } from './axiosInstance';
import { Message } from '../types/message.types';

export const messagesFetchers = {
    sendMessage: async (data: { content: string; sender: string; receiver: string; course: string; room: string }): Promise<Message> => {
        const response = await axiosInstance.post('/messages', data);
        return response.data;
    },

    getMessagesByRoom: async (room: string): Promise<Message[]> => {
        const response = await axiosInstance.get(`/messages/room/${room}`);
        return response.data;
    },
}; 