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
                className={`w-full py-2 px-4 rounded bg-blue-600 text-white 
                    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
                {loading ? 'Enrolling...' : 'Enroll Now'}
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