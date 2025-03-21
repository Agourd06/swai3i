import { axiosInstance } from './axiosInstance';
import { Enrollment, EnrollmentStatus } from '../types/enrollment.types';

export const enrollmentFetchers = {
    getEnrollments: async ({ student, teacher }: { student?: string; teacher?: string }) => {
        const query = student 
            ? `?student=${student}` 
            : teacher 
            ? `?teacher=${teacher}` 
            : '';
        const response = await axiosInstance.get(`/enrollments${query}`);
        return response.data;
    },

    markAsPaid: async (enrollmentId: string): Promise<Enrollment> => {
        const response = await axiosInstance.put(`/enrollments/${enrollmentId}/mark-paid`);
        return response.data;
    },

    updateStatus: async (enrollmentId: string, status: EnrollmentStatus): Promise<Enrollment> => {
        const response = await axiosInstance.put(`/enrollments/${enrollmentId}/status`, { status });
        return response.data;
    },

    createEnrollment: async (data: {
        course: string;
        student: string;
        status: EnrollmentStatus;
    }): Promise<Enrollment> => {
        const response = await axiosInstance.post('/enrollments', data);
        return response.data;
    },

    updateEnrollment: async (
        enrollmentId: string, 
        updates: { 
            isPaid?: boolean; 
            status?: EnrollmentStatus;
        }
    ): Promise<Enrollment> => {
        const response = await axiosInstance.put(`/enrollments/${enrollmentId}`, updates);
        return response.data;
    },

    completeEnrollment: async (
        enrollmentId: string, 
        data: { 
            isPaid: boolean; 
            status: EnrollmentStatus;
        }
    ): Promise<Enrollment> => {
        const response = await axiosInstance.put(`/enrollments/${enrollmentId}/complete`, data);
        return response.data;
    },

    deleteEnrollment: async (enrollmentId: string): Promise<void> => {
        const response = await axiosInstance.delete(`/enrollments/${enrollmentId}`);
        return response.data;
    },
}; 