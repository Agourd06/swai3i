import { axiosInstance } from './axiosInstance';

export const studentFetchers = {
    fetchStudentById: async (id: string) => {
        const response = await axiosInstance.get(`/users/${id}`);
        console.log("student", response.data);
        
        return response.data;
    },
    fetchEnrollmentsByStudentId: async (studentId: string) => {
        const response = await axiosInstance.get(`/enrollments?studentId=${studentId}`);
        console.log("enrollments", response.data);
        
        return response.data;
    },
}; 