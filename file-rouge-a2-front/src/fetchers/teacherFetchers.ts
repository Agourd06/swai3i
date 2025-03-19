import { axiosInstance } from './axiosInstance';
// import { Course } from '../types/course.types';

// const API_URL = 'http://localhost:3000';

export const teacherFetchers = {
    fetchTeacherById: async (id: string) => {
        const response = await axiosInstance.get(`/users/${id}`);
        return response.data;
    },
    fetchCoursesByTeacherId: async (teacherId: string) => {
        const response = await axiosInstance.get(`/courses/teacher/${teacherId}`);
        return response.data;
    },
    createCourse: async (data: object) => {
        console.log("data", data);
        
        const response = await axiosInstance.post('/courses', data);
        return response.data;
    },
}; 