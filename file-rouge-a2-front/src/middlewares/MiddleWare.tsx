import React, { useEffect, useState } from 'react';
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
    const { isAuthenticated, hasRole, user } = useAuth();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (!token || !storedUser) {
                setIsAuthorized(false);
                setIsLoading(false);
                return;
            }

            if (!isAuthenticated || !user) {
                setTimeout(checkAuth, 100);
                return;
            }

            const authorized = requiredRoles ? hasRole(requiredRoles) : true;
            setIsAuthorized(authorized);
            setIsLoading(false);
        };

        checkAuth();
    }, [isAuthenticated, user, hasRole, requiredRoles]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (!isAuthorized) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    return element;
};

export default ProtectedRoute;
