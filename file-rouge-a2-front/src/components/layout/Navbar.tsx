import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16 text-white">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold ">
                            Swai3i
                        </Link>
                    </div>

                    {user && (
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/dashboard"
                                className=" hover:text-gray-300 px-3 py-2 rounded-md"
                            >
                                Courses
                            </Link>
                            
                            {user.role === 'student' && (
                                <Link
                                    to="/enrollments"
                                    className=" hover:text-gray-300 px-3 py-2 rounded-md"
                                >
                                    My Enrollments
                                </Link>
                            )}

                            {user.role === 'student' && (
                                <Link
                                    to={`/messaging/${user?._id}/someCourseId`}
                                    className="hover:text-gray-300 px-3 py-2 rounded-md"
                                >
                                    Messaging
                                </Link>
                            )}

                            {user.role === 'teacher' ? (
                                <Link
                                    to={`/teacher/${user._id}`}
                                    className=" hover:text-gray-300 px-3 py-2 rounded-md"
                                >
                                    Profile
                                </Link>
                            ) : (
                                <Link
                                    to={`/student/${user._id}`}
                                    className=" hover:text-gray-300 px-3 py-2 rounded-md"
                                >
                                    Profile
                                </Link>
                            )}

                            <div className="flex items-center space-x-2">
                                <span className="text-white">
                                    {user.username} ({user.role})
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="text-red-600 hover:text-red-800 px-3 py-2 rounded-md"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 