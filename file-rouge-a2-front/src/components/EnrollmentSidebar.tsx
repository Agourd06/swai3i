import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { enrollmentFetchers } from '../fetchers/enrollmentFetchers';
import { Enrollment } from '../types/enrollment.types';

const EnrollmentSidebar: React.FC<{ onSelectRoom: (room: string) => void }> = ({ onSelectRoom }) => {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

    useEffect(() => {
        const fetchEnrollments = async () => {
            if (user?.role === 'student') {
                const fetchedEnrollments = await enrollmentFetchers.getEnrollments({ student: user._id });
                setEnrollments(fetchedEnrollments);
            }
        };

        fetchEnrollments();
    }, [user]);

    return (
        <div className="sidebar">
            <h2>My Enrollments</h2>
            <ul>
                {enrollments
                    .filter(enrollment => enrollment.course.type === 'online') // Assuming course type is available
                    .map(enrollment => (
                        <li key={enrollment._id} onClick={() => onSelectRoom(enrollment.room)}>
                            {enrollment.course.title} - Room: {enrollment.room}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default EnrollmentSidebar; 