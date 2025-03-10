import { CourseType } from "../fetchers/courseFetchers";

export interface Course {
    _id: string;
    title: string;
    description: string;
    subject: string;
    level: string;
    city: string;
    price: number;
    courseType: CourseType[];
    duration: number;
    location?: string;
    startDate: string;
    endDate: string;
    maxStudents?: number;
    teacher: {
        _id: string;
        username: string;
        email: string;
    };
    enrollments?: {
        _id: string;
        student: {
            _id: string;
            username: string;
            email: string;
        };
    }[];
} 