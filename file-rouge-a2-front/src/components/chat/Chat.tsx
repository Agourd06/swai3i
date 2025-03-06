import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../contexts/AuthContext';
import { Message } from '../../types/message.types';
import { messagesFetchers } from '../../fetchers/messagesFetchers';

interface ChatProps {
  courseId: string;
  teacherId: string;
  room: string;
}

const Chat: React.FC<ChatProps> = ({ courseId, teacherId, room }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket server
    const newSocket = io('http://localhost:3001', {
      auth: {
        token: localStorage.getItem('token')
      },
      transports: ['websocket']
    });

    setSocket(newSocket);

    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const existingMessages = await messagesFetchers.getMessagesByRoom(room);
        setMessages(existingMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    return () => {
      newSocket.close();
    };
  }, [room]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('joinRoom', room);

    socket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('message');
      socket.emit('leaveRoom', room);
    };
  }, [socket, room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !user) return;

    try {
      await messagesFetchers.sendMessage({
        content: newMessage,
        sender: user._id,
        receiver: teacherId,
        course: courseId,
        room: room
      });

      socket.emit('sendMessage', {
        content: newMessage,
        room: room
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.sender === user?._id
                ? 'ml-auto text-right'
                : 'mr-auto text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.sender === user?._id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(message.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 