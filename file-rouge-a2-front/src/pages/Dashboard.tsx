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
console.log(enrollments);

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
      try {
        // Load enrollments for both students and teachers
        if (user?.role === "student") {
          const fetchedEnrollments = await enrollmentFetchers.getEnrollments({
            student: user._id,
          });
          setEnrollments(fetchedEnrollments);
        } else if (user?.role === "teacher") {
          // Fetch all enrollments for teacher's courses
          const fetchedEnrollments = await enrollmentFetchers.getEnrollments({
            teacher: user._id,
          });
          setEnrollments(fetchedEnrollments);
        }
      } catch (err) {
        toast.error("Failed to fetch enrollments");
        console.error(err);
      }
    };

    loadCourses();
    loadEnrollments();
  }, [user]);

  const handleShowEnrolledStudents = (course: Course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const renderWelcomeSection = () => {
    if (!user) return null;

    return (
      <div className="mb-10 bg-white rounded-xl p-8 shadow-lg border-l-4 border-emerald-400">
        <div className="animate-fade-in">
          <h2 className="text-3xl font-bold text-emerald-800 mb-3">
            Welcome back, {user.username}! 👋
          </h2>
          <p className="text-gray-600">
            {user.role === "teacher" ? (
              <span>Manage your courses and track your students' progress.</span>
            ) : (
              <span>Browse available courses and continue your learning journey.</span>
            )}
          </p>
          <div className="mt-4 flex gap-4">
            {user.role === "teacher" ? (
              <div className="bg-emerald-50 px-4 py-3 rounded-lg">
                <span className="text-emerald-700 font-medium">
                  {enrollments.length} Students Enrolled
                </span>
              </div>
            ) : (
              <div className="bg-emerald-50 px-4 py-3 rounded-lg">
                <span className="text-emerald-700 font-medium">
                  {enrollments.length} Courses Enrolled
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50 p-6">
      <div className="container mx-auto">
        {renderWelcomeSection()}
        
        <h1 className="text-4xl font-bold mb-8 text-emerald-800 border-b-2 border-emerald-200 pb-3 transform transition hover:scale-105">
          Available Courses
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-102 border-l-4 border-emerald-400 overflow-hidden"
            >
              <CourseCard
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
            </div>
          ))}

          {courses.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white rounded-lg shadow-md">
              <div className="text-xl text-gray-500 animate-fade-in">
                No courses available at the moment.
                <div className="mt-2 text-emerald-600 text-sm">
                  Check back later for new courses!
                </div>
              </div>
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
    </div>
  );
};

export default Dashboard;
