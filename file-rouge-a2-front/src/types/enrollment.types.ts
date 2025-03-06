export enum EnrollmentStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export interface Enrollment {
    _id: string;
    course: {
        _id: string;
        title: string;
        description: string;
        startDate: string;
        endDate: string;
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
    status: EnrollmentStatus;
    isPaid: boolean;
    price: number;
    classroom: string;
} 