import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const studentFetchers = {
    fetchStudentById: async (id: string) => {
        const response = await axios.get(`${API_URL}/users/${id}`);
        console.log("student", response.data);
        
        return response.data;
    },
    fetchEnrollmentsByStudentId: async (studentId: string) => {
        const response = await axios.get(`${API_URL}/enrollments?studentId=${studentId}`);
        console.log("enrollments", response.data);
        
        return response.data;
    },
}; 