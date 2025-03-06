import axios from 'axios';
import { Message } from '../types/message.types';
const API_URL = 'http://localhost:3000';

export const messagesFetchers = {
    sendMessage: async (data: { content: string; sender: string; receiver: string; course: string; room: string }): Promise<Message> => {
        const response = await axios.post(`${API_URL}/messages`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    getMessagesByRoom: async (room: string): Promise<Message[]> => {
        const response = await axios.get(`${API_URL}/messages?room=${room}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },
}; 