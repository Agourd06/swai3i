import { TimeSlot } from './TimeSlot'; // Adjust the import path as necessary

export interface Course {
    title: string;
    description: string;
    subject: string;
    level: string;
    city: string;
    price: number;
    duration: number;
    courseType: string[]; // Assuming this is an array of strings
    location?: string; // Optional
    maxStudents?: number; // Optional
    timeSlots?: TimeSlot[]; // Use the TimeSlot type here
    startDate: string; // Use Date type if you parse it
    endDate: string; // Use Date type if you parse it
    teacher: string; // Teacher ID
} 