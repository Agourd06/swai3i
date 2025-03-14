import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { teacherFetchers } from "../fetchers/teacherFetchers";
import AddCourseForm from "../components/AddCourseForm";
import Modal from "../components/common/Modal";
import { classroomFetchers } from "../fetchers/classroomFetcher";
import { enrollmentFetchers } from "../fetchers/enrollmentFetchers";
import ConfirmDialog from "../components/common/ConfirmDialog";
// import { useAuth } from "../contexts/AuthContext";

interface Teacher {
  _id: string;
  username: string;
  email: string;
  phone: string;
  address: string;
}

interface Course {
  _id: string;
  title: string;
}

interface Classroom {
  _id: string;
  course: string;
  capacity: number;
}

interface Enrollment {
  _id: string;
  student: {
    username: string;
  };
  classroom: string;
}

const TeacherProfile = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showClassroomModal, setShowClassroomModal] = useState(false);
  // const { user } = useAuth();

  const fetchTeacherData = async () => {
    if (!id) {
      setError("Teacher ID is not available");
      setLoading(false);
      return;
    }

    try {
      const teacherData = await teacherFetchers.fetchTeacherById(id);
      setTeacher(teacherData);
      const teacherCourses = await teacherFetchers.fetchCoursesByTeacherId(id);
      setCourses(teacherCourses);

      // Fetch classrooms for each course
      const classroomsData = await Promise.all(
        teacherCourses.map(async (course: Course) => {
          const classrooms = await classroomFetchers.fetchClassroomsByCourseId(course._id);
          return classrooms;
        })
      );
      setClassrooms(classroomsData.flat());

      // Fetch enrollments for the teacher's courses
      const fetchedEnrollments = await enrollmentFetchers.getEnrollments({ teacher: id });
      setEnrollments(fetchedEnrollments);
    } catch (err) {
      setError("Failed to load teacher data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, [id]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Refresh the courses data after modal closes
    fetchTeacherData();
  };

  const ClassroomModal = ({ course }: { course: Course }) => {
    if (!showClassroomModal) return null;

    const courseClassrooms = classrooms.filter(classroom => classroom.course === course._id);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 max-w-4xl w-full shadow-xl transform transition-all animate-fade-in max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-emerald-800">{course.title} - Classrooms</h3>
            <button
              onClick={() => setShowClassroomModal(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courseClassrooms.map(classroom => (
              <div key={classroom._id} className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Classroom {classroom._id.slice(-4)}</h4>
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                    {enrollments.filter(e => e.classroom === classroom._id).length}/{classroom.capacity} Students
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {enrollments
                      .filter(enrollment => enrollment.classroom === classroom._id)
                      .map(enrollment => (
                        <div
                          key={enrollment._id}
                          className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm"
                        >
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-medium">
                            {enrollment.student.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-gray-700 truncate">{enrollment.student.username}</span>
                        </div>
                      ))}
                  </div>
                  
                  {enrollments.filter(e => e.classroom === classroom._id).length === 0 && (
                    <p className="text-gray-500 text-center italic">No students enrolled yet</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Teacher not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                {teacher.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{teacher.username}'s Profile</h1>
                <p className="text-emerald-600">{teacher.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-semibold text-emerald-600">{teacher.email}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-lg font-semibold text-emerald-600">{teacher.phone}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-lg font-semibold text-emerald-600">{teacher.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Courses</h2>
              <button
                onClick={handleOpenModal}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                         transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Add New Course
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{course.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {classrooms.filter(c => c.course === course._id).length} Classrooms
                      </span>
                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowClassroomModal(true);
                        }}
                        className="px-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium
                                 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                      >
                        View Classrooms
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedCourse && <ClassroomModal course={selectedCourse} />}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <AddCourseForm 
            teacherId={id || ""} 
            setIsModalOpen={setIsModalOpen}
            onCourseAdded={fetchTeacherData}
          />
        </Modal>
      </div>
    </div>
  );
};

export default TeacherProfile;
