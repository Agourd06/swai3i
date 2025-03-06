import React from 'react';
import { EnrollmentStatus } from '../../types/enrollment.types';

interface StatusBadgeProps {
    status: EnrollmentStatus;
}

const EnrollmentStatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusColor = () => {
        switch (status) {
            case EnrollmentStatus.ACTIVE:
                return 'bg-green-100 text-green-800';
            case EnrollmentStatus.PENDING:
                return 'bg-yellow-100 text-yellow-800';
            case EnrollmentStatus.COMPLETED:
                return 'bg-blue-100 text-blue-800';
            case EnrollmentStatus.CANCELLED:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {status}
        </span>
    );
};

export default EnrollmentStatusBadge; 