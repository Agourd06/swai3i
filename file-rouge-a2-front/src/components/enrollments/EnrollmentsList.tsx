import React, { useEffect, useState } from 'react';
import { Enrollment } from '../../types/enrollment.types';
import { enrollmentFetchers } from '../../fetchers/enrollmentFetchers';
import EnrollmentCard from './EnrollmentCard';
import { Link } from 'react-router-dom';

interface EnrollmentsListProps {
    studentId: string;
}

const EnrollmentsList: React.FC<EnrollmentsListProps> = ({ studentId }) => {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadEnrollments();
    }, [studentId]);

    const loadEnrollments = async () => {
        try {
            const data = await enrollmentFetchers.getEnrollments({ student: studentId });
            setEnrollments(data);
        } catch (err) {
            setError('Failed to load enrollments');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center">Loading enrollments...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((enrollment) => (
                <EnrollmentCard 
                    key={enrollment._id} 
                    enrollment={enrollment}
                    onStatusUpdate={loadEnrollments}
                />
            ))}
            {enrollments.length === 0 && (
                <div className="col-span-full text-center text-gray-500">
                    No enrollments found.
                </div>
            )}
            {enrollments.map((enrollment) => (
                <Link 
                    key={enrollment._id} 
                    to={`/messaging/${enrollment.teacher._id}/${enrollment.course._id}`}
                    className="text-blue-500 hover:underline"
                >
                    Message Teacher
                </Link>
            ))}
        </div>
    );
};

export default EnrollmentsList; 