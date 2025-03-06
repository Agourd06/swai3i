import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { courseFetchers, Course } from "../fetchers/courseFetchers";
import { enrollmentFetchers } from "../fetchers/enrollmentFetchers";
import { Enrollment } from "../types/enrollment.types";
import { toast } from "react-toastify";
import EnrolledStudentsModal from "../components/modals/EnrolledStudentsModal";
import CourseCard from "../components/courses/CourseCard";

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const fetchedCourses = await courseFetchers.fetchCourses();
        setCourses(fetchedCourses);
      } catch (err) {
        toast.error("Failed to fetch courses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const loadEnrollments = async () => {
      if (user?.role === "student") {
        try {
          const fetchedEnrollments = await enrollmentFetchers.getEnrollments({
            student: user._id,
          });
          setEnrollments(fetchedEnrollments);
        } catch (err) {
          toast.error("Failed to fetch enrollments");
          console.error(err);
        }
      }
    };

    loadCourses();
    loadEnrollments();
  }, [user]);

  const handleShowEnrolledStudents = (course: Course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            isEnrolled={enrollments.some(
              (enrollment) =>
                enrollment.student._id === user?._id &&
                enrollment.course._id === course._id
            )}
            userId={user?._id}
            selectedClassroomId={selectedClassroomId}
            enrollments={enrollments}
            onShowEnrolledStudents={handleShowEnrolledStudents}
          />
        ))}

        {courses.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No courses available at the moment.
          </div>
        )}
      </div>

      <EnrolledStudentsModal
        course={selectedCourse}
        showModal={showModal}
        onClose={() => setShowModal(false)}
        enrollments={enrollments}
      />
    </div>
  );
};

export default Dashboard;
