import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { courseFetchers, Course, CourseType } from '../fetchers/courseFetchers';
import EnrollButton from '../components/EnrollButton';
import { enrollmentFetchers } from '../fetchers/enrollmentFetchers';
import { Enrollment } from '../types/enrollment.types';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState('');
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [selectedClassroomId, setSelectedClassroomId] = useState('');
    // setSelectedClassroomId('')
    useEffect(() => {
        const loadCourses = async () => {
            try {
                const fetchedCourses = await courseFetchers.fetchCourses();
                setCourses(fetchedCourses);
            } catch (err) {
                toast.error('Failed to fetch courses');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const loadEnrollments = async () => {
            if (user?.role === 'student') {
                try {
                    const fetchedEnrollments = await enrollmentFetchers.getEnrollments({ student: user._id });
                    setEnrollments(fetchedEnrollments);
                } catch (err) {
                    toast.error('Failed to fetch enrollments');
                    console.error(err);
                }
            }
        };

        loadCourses();
        loadEnrollments();
    }, [user]);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course._id} className="border p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-white">
                        <h2 className="text-xl font-semibold">{course.title}</h2>
                        <p className="text-gray-600">{course.description}</p>
                        <div className="mt-4">
                            <p className="font-medium">Subject: {course.subject}</p>
                            <p className="font-medium">Level: {course.level}</p>
                            <p className="font-medium">City: {course.city}</p>
                        </div>
                        <div className="mt-4">
                            {course.courseType.includes(CourseType.CLASSROOM) ? (
                                
                                <EnrollButton 
                                    courseId={course._id}
                                    studentId={user?._id || ''}
                                    courseTitle={course.title}
                                    coursePrice={course.price}
                                    classroom={selectedClassroomId || ''}
                                    onError={(errorMessage) => {
                                        toast.error(errorMessage);
                                    }}
                                    enrollments={enrollments}
                                />
                            ) : (
                                <div>
                                    <h3 className="font-medium">Enrolled Students:</h3>
                                    <ul>
                                        {enrollments
                                            .filter(enrollment => enrollment.course._id === course._id)
                                            .map(enrollment => (
                                                <li key={enrollment._id} className="text-gray-600">{enrollment.student.username}</li>
                                            ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {courses.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        No courses available at the moment.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;