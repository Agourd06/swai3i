import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // Routes where footer should be hidden
    const noFooterRoutes = ['/online-courses', '/teacher/online-courses'];
    const shouldShowFooter = !noFooterRoutes.includes(location.pathname);

    return (
        <div className="flex flex-col min-h-screen">
            {isAuthenticated && <Navbar />}
            <main className="flex-grow mt-16">
                <Outlet />
            </main>
            {shouldShowFooter && <Footer />}
        </div>
    );
};

export default Layout; 