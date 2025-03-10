import axios from 'axios';
import { axiosInstance } from './axiosInstance';
import { Course } from '../types/course.types';

const API_URL = 'http://localhost:3000';

export enum CourseType {
  PRIVATE = 'private',
  CLASSROOM = 'classroom',
  ONLINE = 'online',
}

export const courseFetchers = {
    fetchCourses: async (): Promise<Course[]> => {
        try {
            const response = await axios.get(`${API_URL}/courses`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    },

    enrollInCourse: async (courseId: string, studentId: string): Promise<void> => {
        try {
            await axios.post(`${API_URL}/enrollments`, {
                courseId,
                studentId
            });
        } catch (error) {
            console.error('Error enrolling in course:', error);
            throw error;
        }
    },

    getCourseById: async (id: string): Promise<Course> => {
        const response = await axios.get(`${API_URL}/courses/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    },

    getTeacherCourses: async (teacherId: string): Promise<Course[]> => {
        try {
            const response = await axiosInstance.get(`/courses/teacher/${teacherId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching teacher courses:', error);
            throw error;
        }
    },
}; 