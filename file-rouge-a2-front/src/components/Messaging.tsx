import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { enrollmentFetchers } from '../fetchers/enrollmentFetchers';
import { messagesFetchers } from '../fetchers/messagesFetchers';
import { Enrollment } from '../types/enrollment.types';
import { Message } from '../types/message.types';
import EnrollmentSidebar from './EnrollmentSidebar';

const Messaging: React.FC = () => {
    const { teacherId, courseId } = useParams<{ teacherId: string; courseId: string }>();
    const { user } = useAuth();
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

    useEffect(() => {
        const fetchEnrollment = async () => {
            const enrollments = await enrollmentFetchers.getEnrollments({ student: user?._id });
            const courseEnrollment = enrollments.find((enrollment: Enrollment) => 
                enrollment.course._id === courseId && enrollment.status === 'ACTIVE'
            );
            setEnrollment(courseEnrollment || null);
        };

        fetchEnrollment();
    }, [user, courseId]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedRoom) {
                const fetchedMessages = await messagesFetchers.getMessagesByRoom(selectedRoom);
                setMessages(fetchedMessages);
            }
        };

        fetchMessages();
    }, [selectedRoom]);

    const handleSendMessage = async () => {
        if (newMessage.trim() && selectedRoom) {
            await messagesFetchers.sendMessage({
                content: newMessage,
                sender: user!._id,
                receiver: teacherId!,
                course: courseId!,
                room: selectedRoom,
            });
            setNewMessage('');
        }
    };

    return (
        <div className="messaging-container">
            <EnrollmentSidebar onSelectRoom={setSelectedRoom} />
            <div className="messages-area">
                <h2>Messaging with Teacher</h2>
                <div>
                    {messages.map((message) => (
                        <div key={message._id}>
                            <strong>{message.sender.username}:</strong> {message.content}
                        </div>
                    ))}
                </div>
                {enrollment ? (
                    <div>
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                ) : (
                    <p>You are not enrolled in this course.</p>
                )}
            </div>
        </div>
    );
};

export default Messaging; 