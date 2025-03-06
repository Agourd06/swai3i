import axios from 'axios';
import { Classroom } from '../types/classroom.types';
const API_URL = 'http://localhost:3000';

export const classroomFetchers = {
    // Fetch classrooms by course ID
    fetchClassroomsByCourseId: async (courseId: string): Promise<Classroom[]> => {
        const response = await axios.get(`${API_URL}/classrooms/course/${courseId}`);
        console.log('Fetched Classrooms:', response.data); // Log the fetched classrooms
        return response.data;
    },
};