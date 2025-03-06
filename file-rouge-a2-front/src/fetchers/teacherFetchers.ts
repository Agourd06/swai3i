import axios from 'axios';
// import { Course } from '../types/course.types';

const API_URL = 'http://localhost:3000';

export const teacherFetchers = {
    fetchTeacherById: async (id: string) => {
        const response = await axios.get(`${API_URL}/users/${id}`);
        return response.data;
    },
    fetchCoursesByTeacherId: async (teacherId: string) => {
        const response = await axios.get(`${API_URL}/courses/teacher/${teacherId}`);
        return response.data;
    },
    createCourse: async (data: object) => {
        console.log("data", data);
        
        const response = await axios.post(`${API_URL}/courses`, data);
        return response.data;
    },
}; 