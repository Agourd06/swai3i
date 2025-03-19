import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { RegisterCredentials } from '../types/auth.types';
import { UserRole } from '../types/auth.types';
import { registerSchema } from '../validations/registerValidation';
import { z } from 'zod';

export default function Register() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState<RegisterCredentials>({
        username: '',
        email: '',
        password: '',
        phone: '',
        adress: '',
        role: UserRole.STUDENT
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            registerSchema.parse(credentials);
            await authService.register(credentials);
            navigate('/auth/login');
        } catch (err: any) {
            if (err instanceof z.ZodError) {
                const fieldErrors: { [key: string]: string } = {};
                err.errors.forEach((error) => {
                    if (error.path) {
                        fieldErrors[error.path[0] as string] = error.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                setErrors({ form: err.response?.data?.message || 'An error occurred during registration' });
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="text-center text-3xl font-bold text-gray-900">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/auth/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                            Sign in
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {Object.entries(errors).map(([key, value]) => (
                        <div key={key} className="bg-red-50 text-red-500 p-3 rounded-md text-center text-sm">
                            {value}
                        </div>
                    ))}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                placeholder="Choose a username"
                                value={credentials.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                placeholder="Enter your email"
                                value={credentials.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                placeholder="Create a password"
                                value={credentials.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                placeholder="Enter your phone number"
                                value={credentials.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="adress" className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                id="adress"
                                name="adress"
                                type="text"
                                 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                placeholder="Enter your address"
                                value={credentials.adress}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                id="role"
                                name="role"
                                 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                value={credentials.role}
                                onChange={handleChange}
                            >
                                <option value={UserRole.STUDENT}>Student</option>
                                <option value={UserRole.TEACHER}>Teacher</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
                        >
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
