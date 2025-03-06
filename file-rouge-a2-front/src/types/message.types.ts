export interface Message {
    _id: string;
    content: string;
    sender: string;
    receiver: string;
    course: string;
    room: string;
    createdAt: Date;
    updatedAt: Date;
} 