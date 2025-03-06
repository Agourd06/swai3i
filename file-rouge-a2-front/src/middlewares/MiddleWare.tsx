import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    element: React.ReactElement;
    requiredRoles?: string | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    element, 
    requiredRoles 
}) => {
    const { isAuthenticated, hasRole } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate 
            to="/auth/login" 
            state={{ from: location }} 
            replace 
        />;
    }

    if (requiredRoles && !hasRole(requiredRoles)) {
        return <Navigate 
            to="/unauthorized" 
            state={{ from: location }} 
            replace 
        />;
    }

    return element;
};

export default ProtectedRoute;
