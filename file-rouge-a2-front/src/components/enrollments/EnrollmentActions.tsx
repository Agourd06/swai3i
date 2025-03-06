import React from 'react';
import { enrollmentFetchers } from '../../fetchers/enrollmentFetchers';
import { EnrollmentStatus } from '../../types/enrollment.types';


interface EnrollmentActionsProps {
    enrollmentId: string;
    currentStatus: EnrollmentStatus;
    isPaid: boolean;
    onStatusUpdate: () => void;
}

const EnrollmentActions: React.FC<EnrollmentActionsProps> = ({
    enrollmentId,
    currentStatus,
    isPaid,
    onStatusUpdate
}) => {
    const handleMarkAsPaid = async () => {
        try {
            await enrollmentFetchers.markAsPaid(enrollmentId);
            onStatusUpdate();
        } catch (error) {
            console.error('Error marking enrollment as paid:', error);
        }
    };

    const handleUpdateStatus = async (status: EnrollmentStatus) => {
        try {
            await enrollmentFetchers.updateStatus(enrollmentId, status);
            onStatusUpdate();
        } catch (error) {
            console.error('Error updating enrollment status:', error);
        }
    };

    return (
        <div className="mt-4 space-x-2">
            {!isPaid && currentStatus !== EnrollmentStatus.CANCELLED && (
                <button
                    onClick={handleMarkAsPaid}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                    Mark as Paid
                </button>
            )}
            
            {currentStatus === EnrollmentStatus.PENDING && (
                <button
                    onClick={() => handleUpdateStatus(EnrollmentStatus.CANCELLED)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                    Cancel
                </button>
            )}
            
            {currentStatus === EnrollmentStatus.ACTIVE && (
                <button
                    onClick={() => handleUpdateStatus(EnrollmentStatus.COMPLETED)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                    Complete
                </button>
            )}
        </div>
    );
};

export default EnrollmentActions; 