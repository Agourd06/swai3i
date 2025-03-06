export interface Course {
    _id?: string;
    title: string;
    description: string;
    subject: string;
    level: string;
    city: string;
    price: number;
    duration: number;
    location: string;
    startDate: string;
    endDate: string;
    maxStudents: number;
    enrolledStudents?: number;
    timeSlots: {
        day: string;
        hour: number;
        minute: number;
    }[];
    teacher: string;
} 