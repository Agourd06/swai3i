import { CourseType } from "../fetchers/courseFetchers";

export enum EnrollmentStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export interface    Enrollment {
    _id: string;
    course: {
        _id: string;
        title: string;
        description: string;
        courseType: CourseType[];
        startDate: string;
        endDate: string;
        teacher:   {
            _id: string;
            username: string;
        };
        timeSlots: {
            day: string;
            hour: number;
            minute: number;
        }[];
    };
    student: {
        _id: string;
        username: string;
        email: string;
    };
    teacher: {
        _id: string;
        username: string;
       
    };
    status: EnrollmentStatus;
    isPaid: boolean;
    price: number;
    classroom: string;
} 