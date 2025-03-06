import axios from 'axios';
import { Enrollment, EnrollmentStatus } from '../types/enrollment.types';

const API_URL = 'http://localhost:3000';

export const enrollmentFetchers = {
    getEnrollments: async (filters: { 
        student?: string; 
        course?: string; 
        status?: EnrollmentStatus;
        teacher?: string;
    }): Promise<Enrollment[]> => {
        try {
            const response = await axios.get(`${API_URL}/enrollments`, {
                params: filters,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data as Enrollment[];
        } catch (error) {
            console.error('Error fetching enrollments:', error);
            throw error;
        }
    },

    markAsPaid: async (enrollmentId: string): Promise<Enrollment> => {
        try {
            const response = await axios.put(
                `${API_URL}/enrollments/${enrollmentId}/mark-paid`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error marking enrollment as paid:', error);
            throw error;
        }
    },

    updateStatus: async (enrollmentId: string, status: EnrollmentStatus): Promise<Enrollment> => {
        try {
            const response = await axios.put(
                `${API_URL}/enrollments/${enrollmentId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating enrollment status:', error);
            throw error;
        }
    },

    createEnrollment: async (data: {
        course: string;
        student: string;
        status: EnrollmentStatus;
    }): Promise<Enrollment> => {
        try {
            const response = await axios.post(
                `${API_URL}/enrollments`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating enrollment:', error);
            throw error;
        }
    },

    updateEnrollment: async (
        enrollmentId: string, 
        updates: { 
            isPaid?: boolean; 
            status?: EnrollmentStatus;
        }
    ): Promise<Enrollment> => {
        const response = await axios.put(
            `${API_URL}/enrollments/${enrollmentId}`,
            updates,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    },

    completeEnrollment: async (
        enrollmentId: string, 
        data: { 
            isPaid: boolean; 
            status: EnrollmentStatus;
        }
    ): Promise<Enrollment> => {
        const response = await axios.put(
            `${API_URL}/enrollments/${enrollmentId}/complete`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    },
}; 