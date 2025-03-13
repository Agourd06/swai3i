import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
                Swai3i
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          {user && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-emerald-600 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          )}

          {/* Desktop Menu */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/dashboard"
                className={`text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActiveRoute('/dashboard') ? 'text-emerald-600 bg-emerald-50' : ''}`}
              >
                Courses
              </Link>

              {user.role === "student" && (
                <>
                  <Link
                    to="/enrollments"
                    className={`text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActiveRoute('/enrollments') ? 'text-emerald-600 bg-emerald-50' : ''}`}
                  >
                    My Enrollments
                  </Link>
                  <Link
                    to="/online-courses"
                    className={`text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActiveRoute('/online-courses') ? 'text-emerald-600 bg-emerald-50' : ''}`}
                  >
                    Online Courses
                  </Link>
                </>
              )}

              {user.role === 'teacher' && (
                <Link
                  to="/teacher/online-courses"
                  className={`text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActiveRoute('/teacher/online-courses') ? 'text-emerald-600 bg-emerald-50' : ''}`}
                >
                  My Online Courses
                </Link>
              )}

              {/* Desktop Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.username}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      to={`/${user.role}/${user._id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {user && (
          <div
            className={`md:hidden ${
              isMobileMenuOpen ? 'block' : 'hidden'
            } border-t border-gray-200`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActiveRoute('/dashboard')
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                Courses
              </Link>

              {user.role === "student" && (
                <>
                  <Link
                    to="/enrollments"
                    onClick={closeMobileMenu}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActiveRoute('/enrollments')
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                    }`}
                  >
                    My Enrollments
                  </Link>
                  <Link
                    to="/online-courses"
                    onClick={closeMobileMenu}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActiveRoute('/online-courses')
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                    }`}
                  >
                    Online Courses
                  </Link>
                </>
              )}

              {user.role === 'teacher' && (
                <Link
                  to="/teacher/online-courses"
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActiveRoute('/teacher/online-courses')
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  My Online Courses
                </Link>
              )}

              {/* Mobile Profile Section */}
              <div className="border-t border-gray-200 pt-4">
                <div className="px-3 py-2 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.username}</span>
                </div>
                <Link
                  to={`/${user.role}/${user._id}`}
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
