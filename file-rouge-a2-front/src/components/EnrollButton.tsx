import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enrollmentFetchers } from '../fetchers/enrollmentFetchers';
import { AxiosError } from 'axios';
import ConfirmDialog from './common/ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';
import { Enrollment, EnrollmentStatus } from '../types/enrollment.types';
import { toast } from 'react-toastify';

interface EnrollButtonProps {
    courseId: string;
    studentId: string;
    courseTitle: string;
    coursePrice: number;
    // classroom: string;
    enrollments: Enrollment[];
}

const EnrollButton: React.FC<EnrollButtonProps> = ({
    courseId,
    studentId,
    courseTitle,
    coursePrice,
    // classroom,
}) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    if (user?.role !== 'student') {
        return null;
    }

    const handleEnrollClick = () => {
        if (!studentId) {
            toast.error('Please log in to enroll');
            return;
        }
        setShowConfirm(true);
    };

    const handleConfirmEnroll = async () => {
        try {
            setLoading(true);

            const enrollmentData = {
                course: courseId,
                student: studentId,
                // classroom,
                price: coursePrice,
                status: EnrollmentStatus.PENDING,
            };
            const enrollment = await enrollmentFetchers.createEnrollment(enrollmentData);
            navigate('/enrollment-success', { 
                state: { enrollmentId: enrollment._id } 
            });
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string | string[] }>;
            const message = Array.isArray(error.response?.data?.message)
                ? error.response?.data?.message.join(', ')
                : error.response?.data?.message || 'Failed to enroll in course';
            toast.error(message);
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <button
                onClick={handleEnrollClick}
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300
                    ${loading 
                        ? 'bg-emerald-100 text-emerald-400 cursor-not-allowed' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg transform hover:-translate-y-0.5'
                    }
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`}
            >
                {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Enrolling...</span>
                    </div>
                ) : (
                    'Enroll Now'
                )}
            </button>

            <ConfirmDialog
                isOpen={showConfirm}
                title="Confirm Enrollment"
                message={`Are you sure you want to enroll in ${courseTitle}? The course fee is $${coursePrice}.`}
                onConfirm={handleConfirmEnroll}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
};

export default EnrollButton; 