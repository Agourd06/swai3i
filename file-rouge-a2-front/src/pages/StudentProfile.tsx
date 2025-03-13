import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { studentFetchers } from '../fetchers/studentFetchers';

const StudentProfile = () => {
    const { id } = useParams();
    const [student, setStudent] = useState<any>(null);
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const studentData = await studentFetchers.fetchStudentById(id as string);
                setStudent(studentData);
                const studentEnrollments = await studentFetchers.fetchEnrollmentsByStudentId(id as string);
                setEnrollments(studentEnrollments);
            } catch (err) {
                setError('Failed to load student data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    );
    
    if (error) return (
        <div className="text-center py-10 text-red-500 animate-fade-in">
            <div className="text-xl font-semibold">{error}</div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-white to-emerald-50 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl">
            <h1 className="text-3xl font-bold mb-6 text-emerald-800 border-b-2 border-emerald-200 pb-2 transform transition hover:scale-105">
                {student.username}'s Profile
            </h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8 hover:shadow-lg transition-all duration-300">
                <p className="flex items-center space-x-2 text-gray-700 mb-3 hover:text-emerald-600 transition-colors">
                    <span className="font-semibold">Email:</span> {student.email}
                </p>
                <p className="flex items-center space-x-2 text-gray-700 mb-3 hover:text-emerald-600 transition-colors">
                    <span className="font-semibold">Phone:</span> {student.phone}
                </p>
                <p className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors">
                    <span className="font-semibold">Role:</span> {student.role}
                </p>
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-emerald-700">Enrolled Courses</h2>
            {enrollments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrollments.map((enrollment) => (
                        <div 
                            key={enrollment._id} 
                            className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-l-4 border-emerald-400"
                        >
                            <h3 className="font-semibold text-lg text-emerald-800 mb-2">
                                {enrollment.course.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                                {enrollment.course.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium
                                    ${enrollment.status === 'ACTIVE' 
                                        ? 'bg-emerald-100 text-emerald-700' 
                                        : 'bg-gray-100 text-gray-700'}`}
                                >
                                    {enrollment.status}
                                </span>
                                <span className="text-emerald-600 font-semibold">
                                    ${enrollment.price}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    No enrollments found.
                </div>
            )}
        </div>
    );
};

export default StudentProfile;
