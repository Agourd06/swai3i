import React from "react";
import { Course } from "../../fetchers/courseFetchers";
import { Enrollment } from "../../types/enrollment.types";
import EnrollButton from "../EnrollButton";

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
    <div className="border p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-white">
      <h2 className="text-xl font-semibold">{course.title}</h2>
      <p className="text-gray-600">{course.description}</p>
      <div className="mt-4">
        <p className="font-medium">Subject: {course.subject}</p>
        <p className="font-medium">Level: {course.level}</p>
        <p className="font-medium">City: {course.city}</p>
      </div>
      <div className="mt-4 flex justify-between items-center">
        {isEnrolled ? (
          <button
            onClick={() => onShowEnrolledStudents(course)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            View Enrolled Students
          </button>
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
      </div>
    </div>
  );
};

export default CourseCard; 