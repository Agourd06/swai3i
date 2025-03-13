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
    const fetchMessages = async () => {
      try {
        const existingMessages = await messagesFetchers.getMessagesByRoom(room);
        console.log('Fetched messages:', existingMessages);
        setMessages(existingMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [room]);

  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      auth: { 
        token: localStorage.getItem('token'),
        userId: user?._id
      },
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log("room",room);
      console.log('Connected to socket');
      newSocket.emit('joinRoom', room);
    });

    newSocket.on('newMessage', (message: Message) => {
      console.log('Received new message:', message);
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('leaveRoom', room);
      newSocket.close();
    };
  }, [room, user?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !user) return;

    try {
      const messageData = {
        content: newMessage,
        sender: user._id,
        receiver: teacherId,
        course: courseId,
        room: room
      };

      // Only emit to socket, remove database save
      socket.emit('newMessage', messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
// console.log("meesages" ,messages);

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Chat with Teacher</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet</div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message._id || index}
              className={`mb-4 ${
                message.sender._id === user?._id || (typeof message.sender === 'string' && message.sender === user?._id)
                ? 'ml-auto text-right' : 'mr-auto text-left'
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg max-w-[70%] ${
                  message.sender._id === user?._id || (typeof message.sender === 'string' && message.sender === user?._id)
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="break-words">{message.content}</p>
                <span className="text-xs opacity-75 mt-1 block">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="px-6 py-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 