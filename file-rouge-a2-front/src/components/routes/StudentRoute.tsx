import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface StudentRouteProps {
    element: React.ReactElement;
}

const StudentRoute: React.FC<StudentRouteProps> = ({ element }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (user?.role !== 'student') {
        return <Navigate to="/unauthorized" />;
    }

    return element;
};

export default StudentRoute; 