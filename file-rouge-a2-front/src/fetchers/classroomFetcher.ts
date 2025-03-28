import { axiosInstance } from './axiosInstance';
import { Classroom } from '../types/classroom.types';

export const classroomFetchers = {
    // Fetch classrooms by course ID
    fetchClassroomsByCourseId: async (courseId: string): Promise<Classroom[]> => {
        const response = await axiosInstance.get(`/classrooms/course/${courseId}`);
        console.log('Fetched Classrooms:', response.data); // Log the fetched classrooms
        return response.data;
    },
};