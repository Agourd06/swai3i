import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { courseFetchers, Course, CourseType } from "../fetchers/courseFetchers";
import { enrollmentFetchers } from "../fetchers/enrollmentFetchers";
import { Enrollment } from "../types/enrollment.types";
import { toast } from "react-toastify";
import EnrolledStudentsModal from "../components/modals/EnrolledStudentsModal";
import CourseCard from "../components/courses/CourseCard";
import WelcomeSection from "../components/dashboard/WelcomeSection";
import CourseFilters from "../components/dashboard/CourseFilters";
import { User } from "../types/auth.types";
import Pagination from '../components/common/Pagination';

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<CourseType[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [teacherSearchTerm, setTeacherSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedCourses = await courseFetchers.fetchCourses();
        setCourses(fetchedCourses);
        setFilteredCourses(fetchedCourses);

        if (user?.role === "student") {
          const fetchedEnrollments = await enrollmentFetchers.getEnrollments({
            student: user._id,
          });
          setEnrollments(fetchedEnrollments);
        } else if (user?.role === "teacher") {
          const fetchedEnrollments = await enrollmentFetchers.getEnrollments({
            teacher: user._id,
          });
          setEnrollments(fetchedEnrollments);
        }
      } catch (err) {
        toast.error("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    const filterCourses = () => {
      let filtered = [...courses];

      if (searchTerm) {
        filtered = filtered.filter(course =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (teacherSearchTerm) {
        filtered = filtered.filter(course =>
          course.teacher.username.toLowerCase().includes(teacherSearchTerm.toLowerCase())
        );
      }

      if (selectedTypes.length > 0) {
        filtered = filtered.filter(course =>
          course.courseType.some((type: CourseType) => selectedTypes.includes(type))
        );
      }

      filtered = filtered.filter(course =>
        course.price >= priceRange.min && course.price <= priceRange.max
      );

      setFilteredCourses(filtered);
    };

    filterCourses();
  }, [searchTerm, teacherSearchTerm, selectedTypes, priceRange, courses]);

  // Calculate pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <WelcomeSection user={user as User} enrollments={enrollments} />
        <CourseFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          teacherSearchTerm={teacherSearchTerm}
          setTeacherSearchTerm={setTeacherSearchTerm}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
        
        <h1 className="text-4xl font-bold mb-8 text-emerald-800 border-b-2 border-emerald-200 pb-3">
          Available Courses {filteredCourses.length > 0 && `(${filteredCourses.length})`}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isEnrolled={enrollments.some(
                (enrollment) =>
                  enrollment.student._id === user?._id &&
                  enrollment.course._id === course._id
              )}
              userId={user?._id}
              enrollments={enrollments}
              selectedClassroomId={''}
              onShowEnrolledStudents={(course) => {
                setSelectedCourse(course);
                setShowModal(true);
              }}
            />
          ))}

          {filteredCourses.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white rounded-lg shadow-md">
              <div className="text-xl text-gray-500">
                No courses found matching your criteria.
                <div className="mt-2 text-emerald-600 text-sm">
                  Try adjusting your filters!
                </div>
              </div>
            </div>
          )}
        </div>

        {filteredCourses.length > coursesPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

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
