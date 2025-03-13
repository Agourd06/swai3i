import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../../contexts/AuthContext";
import { Message } from "../../types/message.types";
import { messagesFetchers } from "../../fetchers/messagesFetchers";

interface ChatProps {
  courseId: string;
  teacherId: string;
  teacherName: string;
  room: string;
}

const Chat: React.FC<ChatProps> = ({
  courseId,
  teacherId,
  teacherName,
  room,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const existingMessages = await messagesFetchers.getMessagesByRoom(room);
        console.log("Fetched messages:", existingMessages);
        setMessages(existingMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [room]);

  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      auth: {
        token: localStorage.getItem("token"),
        userId: user?._id,
      },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("room", room);
      console.log("Connected to socket");
      newSocket.emit("joinRoom", room);
    });

    newSocket.on("newMessage", (message: Message) => {
      console.log("Received new message:", message);
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit("leaveRoom", room);
      newSocket.close();
    };
  }, [room, user?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        room: room,
      };

      // Only emit to socket, remove database save
      socket.emit("newMessage", messageData);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  // console.log("meesages" ,messages);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-white shadow-sm z-10 flex gap-3 mt-2">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm sm:text-base">
          {teacherName?.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          Chat with {teacherName}
        </h2>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 p-3 sm:p-6 overflow-y-auto relative"
        style={{
          backgroundImage: `url('/images/chatbg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
        }}
      >
        {/* Messages Container */}
        <div className="relative z-10">
          {messages.map((message, index) => (
            <div
              key={message._id || index}
              className={`mb-3 sm:mb-4 ${
                message.sender._id === user?._id ||
                (typeof message.sender === "string" &&
                  message.sender === user?._id)
                  ? "ml-auto text-right"
                  : "mr-auto text-left"
              }`}
            >
              <div
                className={`inline-block p-2 sm:p-3 rounded-lg max-w-[85%] sm:max-w-[70%] ${
                  message.sender._id === user?._id ||
                  (typeof message.sender === "string" &&
                    message.sender === user?._id)
                    ? "bg-emerald-700/90 text-white font-bold"
                    : "bg-gray-700/90 text-gray-100 font-bold"
                }`}
              >
                <p className="break-words text-sm sm:text-base">
                  {message.content}
                </p>
                <span className="text-[10px] sm:text-xs block mt-1">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="px-3 sm:px-6 py-3 sm:py-4 border-t bg-gray-200"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 sm:p-3 text-sm sm:text-base border rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 
                     transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5
                     flex items-center gap-2 text-sm sm:text-base"
          >
            <span className="hidden sm:inline">Send</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
