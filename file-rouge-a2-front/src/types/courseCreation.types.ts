export enum CourseType {
    PRIVATE = 'PRIVATE',
    CLASSROOM = 'CLASSROOM',
    ONLINE = 'ONLINE'
}

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
    teacher: string;
    price: number;
    duration: number;
    courseType: CourseType[];
    location?: string;
    maxStudents?: number;
    timeSlots: TimeSlot[];
    startDate: string;
    endDate: string;
} 