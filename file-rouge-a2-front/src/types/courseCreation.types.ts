export interface TimeSlot {
    day: string;
    hour: number;
    minute: number;
}

export interface CourseCreation {
    title: string;
    description: string;
    subject: string;
    level: string;
    city: string;
    price: number;
    duration: number;
    courseType: string[];
    location?: string;
    maxStudents?: number;
    timeSlots: TimeSlot[];
    startDate: string;
    endDate: string;
    teacher: string;
} 