import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { enrollmentFetchers } from '../fetchers/enrollmentFetchers';
import { EnrollmentStatus } from '../types/enrollment.types';

const EnrollmentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const enrollmentId = location.state?.enrollmentId;

    const handlePayNow = async () => {
        try {
            setLoading(true);
            setMessage('');
            
            await enrollmentFetchers.completeEnrollment(enrollmentId, {
                isPaid: true,
                status: EnrollmentStatus.ACTIVE
            });

            setMessage('Payment marked as complete!');
            
            setTimeout(() => {
                navigate('/enrollments', { 
                    state: { successMessage: 'Enrollment has been marked as paid!' }
                });
            }, 1500);

        } catch (error) {
            console.error('Payment error:', error);
            setMessage('Failed to mark as paid. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePayLater = () => {
        navigate('/enrollments');
    };

    if (!enrollmentId || !user) return null;

    return (
        <div className="container mx-auto p-4 max-w-lg">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="mb-4 text-green-600">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold mb-4">Enrollment Successful!</h1>
                
                {message && (
                    <div className={`mb-4 p-2 rounded ${
                        message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                        {message}
                    </div>
                )}

                <p className="text-gray-600 mb-6">
                    You have successfully enrolled in the course. Would you like to mark it as paid now?
                </p>
                <div className="space-y-3">
                    <button
                        onClick={handlePayNow}
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded bg-blue-600 text-white 
                            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    >
                        {loading ? 'Processing...' : 'Mark as Paid'}
                    </button>
                    <button
                        onClick={handlePayLater}
                        disabled={loading}
                        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200"
                    >
                        Pay Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentSuccess; 