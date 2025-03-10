import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../contexts/AuthContext';
import { Message } from '../../types/message.types';
import { messagesFetchers } from '../../fetchers/messagesFetchers';

interface TeacherChatProps {
  courseId: string;
  studentId: string;
  room: string;
}

const TeacherChat: React.FC<TeacherChatProps> = ({ courseId, studentId, room }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
// console.log("messages", messages);

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
console.log("studentId", studentId);

  // Socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      auth: { 
        token: localStorage.getItem('token'),
        userId: user?._id
      },
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket');
      newSocket.emit('joinRoom', room);
    });

    // Listen for new messages
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

  // Scroll to bottom when messages update
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
        receiver: studentId,
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
console.log("messages", messages);

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg">
      <div className="flex-1 p-4 overflow-y-auto">
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
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
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

export default TeacherChat; 