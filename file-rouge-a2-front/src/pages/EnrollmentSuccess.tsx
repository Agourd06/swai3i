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
        <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full transform transition-all duration-500 animate-fade-in-up">
                <div className="mb-6 text-emerald-500">
                    <svg className="w-20 h-20 mx-auto animate-success-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold mb-4 text-gray-800 text-center">
                    Enrollment Successful!
                </h1>
                
                {message && (
                    <div className={`mb-6 p-4 rounded-lg animate-fade-in ${
                        message.includes('Failed') 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-emerald-100 text-emerald-700'
                    }`}>
                        {message}
                    </div>
                )}

                <p className="text-gray-600 mb-8 text-center">
                    You have successfully enrolled in the course. Would you like to mark it as paid now?
                </p>
                
                <div className="space-y-4">
                    <button
                        onClick={handlePayNow}
                        disabled={loading}
                        className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all duration-300
                            ${loading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg transform hover:-translate-y-0.5'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Processing...
                            </span>
                        ) : 'Mark as Paid'}
                    </button>
                    <button
                        onClick={handlePayLater}
                        disabled={loading}
                        className="w-full py-3 px-6 rounded-lg bg-gray-100 text-gray-700 font-medium
                                 hover:bg-gray-200 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                    >
                        Pay Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentSuccess; 