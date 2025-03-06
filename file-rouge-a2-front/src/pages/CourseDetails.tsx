import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Course, courseFetchers } from '../fetchers/courseFetchers';
import { formatTimeSlot } from '../utils/dateUtils';
import EnrollmentForm from '../components/enrollments/EnrollmentForm';


const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCourse();
    }, [id]);

    const loadCourse = async () => {
        try {
            if (!id) return;
            const data = await courseFetchers.getCourseById(id);
            setCourse(data);
        } catch (err) {
            setError('Failed to load course details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
    if (!course) return <div className="text-center p-4">Course not found</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Course Details</h2>
                            <p className="text-gray-600">{course.description}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Schedule</h3>
                            <div className="space-y-1">
                                {course.timeSlots.map((slot, index) => (
                                    <p key={index} className="text-gray-600">
                                        {formatTimeSlot(slot)}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p><span className="font-semibold">Price:</span> ${course.price}</p>
                            <p><span className="font-semibold">Duration:</span> {course.duration} minutes</p>
                            <p><span className="font-semibold">Level:</span> {course.level}</p>
                            <p><span className="font-semibold">Location:</span> {course.location}</p>
                            <p>
                                <span className="font-semibold">Period:</span>{' '}
                                {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div>
                        <EnrollmentForm course={course} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails; 