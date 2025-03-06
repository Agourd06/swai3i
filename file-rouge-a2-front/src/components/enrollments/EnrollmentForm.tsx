import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { enrollmentFetchers } from '../../fetchers/enrollmentFetchers';
import { EnrollmentStatus } from '../../types/enrollment.types';
import { Course } from '../../fetchers/courseFetchers';
import { AxiosError } from 'axios';
import ConfirmDialog from '../common/ConfirmDialog';

interface EnrollmentFormProps {
    course: Course;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ course }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    const handleEnrollClick = () => {
        if (!user) {
            navigate('/login', { state: { from: `/courses/${course._id}` } });
            return;
        }
        setShowConfirm(true);
    };

    const handleConfirmEnroll = async () => {
        try {
            setLoading(true);
            setError('');

            const enrollment = await enrollmentFetchers.createEnrollment({
                course: course._id.toString(),
                student: user?._id.toString() || '',
                status: EnrollmentStatus.PENDING
            });
            
            navigate('/enrollment-success', { 
                state: { enrollmentId: enrollment._id } 
            });
        } catch (err: unknown) {
            const error = err as AxiosError<{message: string[]}>;
            setError(Array.isArray(error.response?.data?.message) 
                ? error.response?.data?.message.join(', ') 
                : 'Failed to enroll in course');
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Enrollment Details</h2>
                
                <div className="space-y-4">
                    <div className="border-b pb-4">
                        <p className="font-medium">Course Price</p>
                        <p className="text-2xl font-bold text-green-600">${course.price}</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            • {course.maxStudents - (course.enrolledStudents || 0)} spots remaining
                        </p>
                        <p className="text-sm text-gray-600">
                            • Classes start {new Date(course.startDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                            • {course.duration} minutes per session
                        </p>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}

                    <button
                        onClick={handleEnrollClick}
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-md text-white font-medium
                            ${loading 
                                ? 'bg-blue-300 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Processing...' : 'Enroll Now'}
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-2">
                        By enrolling, you agree to our terms and conditions
                    </p>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showConfirm}
                title="Confirm Enrollment"
                message={`Are you sure you want to enroll in ${course.title}? The course fee is $${course.price}.`}
                onConfirm={handleConfirmEnroll}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
};

export default EnrollmentForm; 