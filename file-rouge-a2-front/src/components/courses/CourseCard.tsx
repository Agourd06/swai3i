import React from "react";
import { Enrollment } from "../../types/enrollment.types";
import EnrollButton from "../EnrollButton";
import { Course } from "../../types/course.types";

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  userId?: string;
  selectedClassroomId: string;
  enrollments: Enrollment[];
  onShowEnrolledStudents: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isEnrolled,
  userId,
  selectedClassroomId,
  enrollments,
  onShowEnrolledStudents,
}) => {
  return (
    <div className="p-6 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-semibold mb-3 text-emerald-800">
          {course.title}
        </h2>
        <p className="text-gray-600 mb-4">{course.description}</p>
        
        <div className="space-y-2 mb-4">
          <p className="flex items-center text-gray-700">
            <span className="font-medium mr-2">Teacher:</span> 
            {course.teacher.username}
          </p>
          <p className="flex items-center text-gray-700">
            <span className="font-medium mr-2">Price:</span>
            <span className="text-emerald-600 font-semibold">${course.price}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 space-x-3">
        {isEnrolled ? (
          <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
            Enrolled
          </span>
        ) : (
          <EnrollButton
            courseId={course._id}
            studentId={userId || ""}
            courseTitle={course.title}
            coursePrice={course.price}
            classroom={selectedClassroomId || ""}
            enrollments={enrollments}
          />
        )}
        
        {userId && (
          <button
            onClick={() => onShowEnrolledStudents(course)}
            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors duration-300 text-sm font-medium"
          >
            View Students
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard; 