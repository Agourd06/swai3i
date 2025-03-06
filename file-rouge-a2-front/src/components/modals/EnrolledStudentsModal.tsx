import React from "react";
import { Course } from "../../fetchers/courseFetchers";
import { Enrollment } from "../../types/enrollment.types";

interface EnrolledStudentsModalProps {
  course: Course | null;
  showModal: boolean;
  onClose: () => void;
  enrollments: Enrollment[];
}

const EnrolledStudentsModal: React.FC<EnrolledStudentsModalProps> = ({
  course,
  showModal,
  onClose,
  enrollments,
}) => {
  if (!course || !showModal) return null;

  const courseEnrollments = enrollments.filter(
    (enrollment) => enrollment.course._id === course._id
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            Enrolled Students - {course.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {courseEnrollments.length > 0 ? (
          <ul className="space-y-2">
            {courseEnrollments.map((enrollment) => (
              <li
                key={enrollment._id}
                className="p-2 bg-gray-50 rounded-lg flex items-center"
              >
                <span className="text-gray-800">
                  {enrollment.student.username}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No students enrolled yet.</p>
        )}
      </div>
    </div>
  );
};

export default EnrolledStudentsModal; 