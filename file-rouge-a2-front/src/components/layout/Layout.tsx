import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex flex-col min-h-screen">
            {isAuthenticated && <Navbar />}
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout; 