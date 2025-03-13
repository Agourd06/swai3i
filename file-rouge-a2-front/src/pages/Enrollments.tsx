import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import EnrollmentsList from '../components/enrollments/EnrollmentsList';
import { useAuth } from '../contexts/AuthContext';

const Enrollments = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (location.state?.successMessage) {
            setMessage(location.state.successMessage);
            setTimeout(() => setMessage(''), 5000);
        }
        // Simulate loading state
        setTimeout(() => setIsLoading(false), 500);
    }, [location]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50">
            <div className="container mx-auto p-6">
             

                {/* Success Message */}
                {message && (
                    <div className="mb-6 p-4 bg-emerald-100 text-emerald-700 rounded-lg shadow-md 
                                  transform animate-fade-in-down flex items-center justify-between">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" 
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                      clipRule="evenodd" />
                            </svg>
                            {message}
                        </div>
                        <button 
                            onClick={() => setMessage('')}
                            className="text-emerald-700 hover:text-emerald-800 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                
                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-lg transition-all duration-300 animate-fade-in">
                    {/* Header Section */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                            <h2 className="text-4xl font-bold  text-emerald-800 border-b-2 border-emerald-200 pb-3 transform transition hover:scale-105">
                                My Enrollments
                            </h2>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" 
                                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" 
                                          clipRule="evenodd" />
                                </svg>
                                <span>View all courses</span>
                            </div>
                        </div>
                    </div>

                    {/* Enrollments List */}
                    <div className="p-6">
                        <div className="animate-fade-in">
                            <EnrollmentsList studentId={user?._id || ''} />
                        </div>
                    </div>
                </div>

                {/* Stats or Additional Info */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-emerald-500 mb-2">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Active Courses</h3>
                        <p className="text-gray-600">Track your ongoing learning journey</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-emerald-500 mb-2">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Course Community</h3>
                        <p className="text-gray-600">Connect with fellow students</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-emerald-500 mb-2">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Progress Tracking</h3>
                        <p className="text-gray-600">Monitor your achievements</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Enrollments; 