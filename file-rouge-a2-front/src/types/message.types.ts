export interface Message {
    _id: string;
    content: string;
    sender: {
        _id: string;
        username: string;
    };
    receiver: string;
    course: string;
    room: string;
    createdAt: string; // Add any other fields you need
} 