import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseFetchers } from '../fetchers/courseFetchers';
import { enrollmentFetchers } from '../fetchers/enrollmentFetchers';
import { formatTimeSlot } from '../utils/dateUtils';
import { useAuth } from '../contexts/AuthContext';
import EnrollButton from '../components/EnrollButton';
import { Course } from '../types/Course';
import { Enrollment } from '../types/enrollment.types';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState<Course | null>(null);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                if (!id) return;
                const [courseData, enrollmentsData] = await Promise.all([
                    courseFetchers.getCourseById(id),
                    user ? enrollmentFetchers.getEnrollments({ student: user._id }) : []
                ]);
                setCourse(courseData);
                setEnrollments(enrollmentsData);
            } catch (err) {
                setError('Failed to load course details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, user]);

    const isEnrolled = enrollments.some(
        enrollment => enrollment.course._id === id && enrollment.student._id === user?._id
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 text-red-500 p-4 rounded-lg shadow-sm">
                    {error}
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Course not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">{course.title}</h1>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Course Description</h2>
                                    <p className="text-gray-600 leading-relaxed">{course.description}</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Schedule</h3>
                                    <div className="space-y-2">
                                        {course.timeSlots?.map((slot, index) => (
                                            <div key={index} className="flex items-center text-gray-600">
                                                <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {formatTimeSlot(slot)}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-emerald-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">Price</p>
                                        <p className="text-lg font-semibold text-emerald-600">${course.price}</p>
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">Duration</p>
                                        <p className="text-lg font-semibold text-emerald-600">{course.duration} min</p>
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">Level</p>
                                        <p className="text-lg font-semibold text-emerald-600">{course.level}</p>
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="text-lg font-semibold text-emerald-600">{course.location}</p>
                                    </div>
                                </div>

                                <div className="bg-emerald-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Course Period</p>
                                    <p className="text-lg font-semibold text-emerald-600">
                                        {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor</h3>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                                            {course.teacher?.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{course.teacher?.username}</p>
                                        </div>
                                    </div>
                                </div>

                                {user && user.role === 'student' && (
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        {isEnrolled ? (
                                            <div className="text-center">
                                                <span className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Already Enrolled
                                                </span>
                                            </div>
                                        ) : (
                                            <EnrollButton
                                                courseId={course!._id}
                                                studentId={user._id}
                                                courseTitle={course!.title}
                                                coursePrice={course!.price}
                                                // classroom={course!.classroom}
                                                enrollments={enrollments}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails; 