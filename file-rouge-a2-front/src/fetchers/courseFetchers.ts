import axios from 'axios';

const API_URL = 'http://localhost:3000';

export enum CourseType {
  PRIVATE = 'private',
  CLASSROOM = 'classroom',
  ONLINE = 'online',
}
export interface Course {
    _id: string;
    title: string;
    description: string;
    subject: string;
    level: string;
    city: string;
    price: number;
    courseType: CourseType[];
    duration: number;
    location: string;
    startDate: string;
    endDate: string;
    maxStudents: number;
    enrolledStudents?: number;
    timeSlots: {
        day: string;
        hour: number;
        minute: number;
    }[];
    teacher: {
        _id: string;
        username: string;
    };
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
    }
}; 