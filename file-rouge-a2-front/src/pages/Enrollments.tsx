import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import EnrollmentsList from '../components/enrollments/EnrollmentsList';
import { useAuth } from '../contexts/AuthContext';

const Enrollments = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (location.state?.successMessage) {
            setMessage(location.state.successMessage);
            setTimeout(() => setMessage(''), 5000);
        }
    }, [location]);

    return (
        <div className="container mx-auto p-4">
            {message && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    {message}
                </div>
            )}
            <h1 className="text-2xl font-bold mb-6">My Enrollments</h1>
            <EnrollmentsList studentId={user?._id || ''} />
        </div>
    );
};

export default Enrollments; 