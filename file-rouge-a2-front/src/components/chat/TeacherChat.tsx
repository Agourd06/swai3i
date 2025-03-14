import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../../contexts/AuthContext";
import { Message } from "../../types/message.types";
import { messagesFetchers } from "../../fetchers/messagesFetchers";

interface TeacherChatProps {
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  room: string;
}

const TeacherChat: React.FC<TeacherChatProps> = ({
  courseId,
  courseName,
  studentId,
  studentName,
  room,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // console.log("messages", messages);

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
  console.log("studentId", studentId);

  // Socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      auth: {
        token: localStorage.getItem("token"),
        userId: user?._id,
      },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket");

      newSocket.emit("joinRoom", room);
    });

    // Listen for new messages
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

  // Scroll to bottom when messages update
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
        receiver: studentId,
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

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-white shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm sm:text-base">
            {studentName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Chat with {studentName}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-600">
              Course: {courseName}
            </p>
          </div>
        </div>
      </div>

      <div
        className="flex-1 p-6 overflow-y-auto relative"
        style={{
          backgroundImage: `url('/images/chatbg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
        }}
      >
        <div className=" h-fit w-fit bg-white/60 pointer-events-none" />

        <div className="relative z-10">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                <svg
                  className="w-12 h-12 mx-auto mb-2 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p>No messages yet</p>
                <p className="text-sm mt-1">Start the conversation!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message._id || index}
                  className={`flex ${
                    message.sender._id === user?._id ||
                    (typeof message.sender === "string" &&
                      message.sender === user?._id)
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-md backdrop-blur-sm
                      ${
                        message.sender._id === user?._id ||
                        (typeof message.sender === "string" &&
                          message.sender === user?._id)
                          ? "bg-emerald-700/90 text-white font-bold"
                    : "bg-gray-700/90 text-gray-100 font-bold"
                      }`}
                  >
                    <p className="text-xs font-medium mb-1 text-gray-200">
                      {message.sender._id === user?._id ||
                      (typeof message.sender === "string" &&
                        message.sender === user?._id)
                        ? "You"
                        : studentName}
                    </p>
                    <p className="break-words">{message.content}</p>
                    <span
                      className={`text-xs block mt-1 ${
                        message.sender._id === user?._id ||
                        (typeof message.sender === "string" &&
                          message.sender === user?._id)
                          ? "text-emerald-50"
                          : "text-gray-200"
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="px-6 py-4 border-t bg-gray-200 shadow-sm z-10"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 
                     transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5
                     flex items-center gap-2"
          >
            <span>Send</span>
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

export default TeacherChat;
