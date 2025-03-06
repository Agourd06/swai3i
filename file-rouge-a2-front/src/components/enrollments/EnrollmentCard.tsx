import React from 'react';
import { Enrollment } from '../../types/enrollment.types';
import EnrollmentStatusBadge from './EnrollmentStatusBadge';
import EnrollmentActions from './EnrollmentActions';


interface EnrollmentCardProps {
    enrollment: Enrollment;
    onStatusUpdate: () => void;
}

const EnrollmentCard: React.FC<EnrollmentCardProps> = ({ 
    enrollment, 
    onStatusUpdate 
}) => {
    return (
        <div className="border rounded-lg shadow-lg p-4 bg-white transition-transform transform hover:scale-105">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{enrollment.course.title}</h3>
                <EnrollmentStatusBadge status={enrollment.status} />
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Price:</span> ${enrollment.price}</p>
                <p><span className="font-medium">Payment Status:</span> {enrollment.isPaid ? 'Paid' : 'Pending'}</p>
                <p><span className="font-medium">Start Date:</span> {new Date(enrollment.course.startDate).toLocaleDateString()}</p>
                <p><span className="font-medium">End Date:</span> {new Date(enrollment.course.endDate).toLocaleDateString()}</p>
            </div>

            <EnrollmentActions 
                enrollmentId={enrollment._id}
                currentStatus={enrollment.status}
                isPaid={enrollment.isPaid}
                onStatusUpdate={onStatusUpdate}
            />
        </div>
    );
};

export default EnrollmentCard; 