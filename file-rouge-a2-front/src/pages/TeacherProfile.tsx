import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { teacherFetchers } from "../fetchers/teacherFetchers";
import AddCourseForm from "../components/AddCourseForm";
import Modal from "../components/common/Modal";
import { classroomFetchers } from "../fetchers/classroomFetcher";
import { enrollmentFetchers } from "../fetchers/enrollmentFetchers";
import UpdateCourseForm from "../components/UpdateCourseForm";
import { Course } from "../types/Course";
import ConfirmDialog from "../components/common/ConfirmDialog";
// import { useAuth } from "../contexts/AuthContext";

interface Teacher {
  _id: string;
  username: string;
  email: string;
  phone: string;
  adress: string;
}

// interface Course {
//   _id: string;
//   title: string;
// }

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
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [courseToUpdate, setCourseToUpdate] = useState<Course | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [enrollmentToDelete, setEnrollmentToDelete] = useState<string | null>(null);
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
      console.log("teacherData", teacherData);

      const teacherCourses = await teacherFetchers.fetchCoursesByTeacherId(id);
      setCourses(teacherCourses);

      const classroomsData = await Promise.all(
        teacherCourses.map(async (course: Course) => {
          const classrooms = await classroomFetchers.fetchClassroomsByCourseId(
            course._id
          );
          return classrooms;
        })
      );
      setClassrooms(classroomsData.flat());

      const fetchedEnrollments = await enrollmentFetchers.getEnrollments({
        teacher: id,
      });
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
    fetchTeacherData();
  };

  const handleConfirmDelete = async () => {
    if (enrollmentToDelete) {
      try {
        await enrollmentFetchers.deleteEnrollment(enrollmentToDelete);
        setShowConfirmDialog(false);
        fetchTeacherData();
      } catch (error) {
        console.error('Error removing student:', error);
      }
    }
  };

  const ClassroomModal = ({ course }: { course: Course }) => {
    if (!showClassroomModal) return null;

    const courseClassrooms = classrooms.filter(
      (classroom) => classroom.course === course._id
    );

    const handleRemoveStudent = async (enrollmentId: string) => {
      setEnrollmentToDelete(enrollmentId);
      setShowConfirmDialog(true);
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 max-w-4xl w-full shadow-xl transform transition-all animate-fade-in max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-emerald-800">
              {course.title} - Classrooms
            </h3>
            <button
              onClick={() => setShowClassroomModal(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courseClassrooms.map((classroom) => (
              <div
                key={classroom._id}
                className="bg-gray-50 rounded-xl p-6 shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Classroom {classroom._id.slice(-4)}
                  </h4>
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                    {
                      enrollments.filter((e) => e.classroom === classroom._id)
                        .length
                    }
                    /{classroom.capacity} Students
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    {enrollments
                      .filter(
                        (enrollment) => enrollment.classroom === classroom._id
                      )
                      .map((enrollment) => (
                        <div
                          key={enrollment._id}
                          className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-medium">
                              {enrollment.student.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-700">
                              {enrollment.student.username}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveStudent(enrollment._id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                            title="Remove student"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                  </div>

                  {enrollments.filter((e) => e.classroom === classroom._id)
                    .length === 0 && (
                    <p className="text-gray-500 text-center italic">
                      No students enrolled yet
                    </p>
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                {teacher.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {teacher.username}'s Profile
                </h1>
                <p className="text-emerald-600">{teacher.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {teacher.email}
                </p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {teacher.phone}
                </p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {teacher.adress}
                </p>
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
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {course.title}
                      </h3>
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                        {course.courseType[0]}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-500">Price:</span>
                        <p className="font-semibold text-emerald-600">
                          ${course.price}
                        </p>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Duration:</span>
                        <p className="font-semibold text-emerald-600">
                          {course.duration}h
                        </p>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Level:</span>
                        <p className="font-semibold text-emerald-600">
                          {course.level}
                        </p>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Students:</span>
                        <p className="font-semibold text-emerald-600">
                          {course.maxStudents}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                    {course.courseType[0] == "classroom" && (
                           <span className="text-sm text-gray-600">
                           {
                             classrooms.filter((c) => c.course === course._id)
                               .length
                           }{" "}
                           Classrooms
                         </span>
                        )}
                    
                      <div className="space-x-2">
                        <button
                          onClick={() => {
                            setCourseToUpdate(course);
                            setIsUpdateModalOpen(true);
                          }}
                          className="px-3 py-1.5 text-emerald-600 hover:text-emerald-700 font-medium
                                   hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                        >
                          Edit
                        </button>
                        {course.courseType[0] == "classroom" && (
                          <button
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowClassroomModal(true);
                            }}
                            className="px-3 py-1.5 bg-emerald-500 text-white font-medium
                                   hover:bg-emerald-600 rounded-lg transition-colors duration-200"
                          >
                            View Classrooms
                          </button>
                        )}
                      </div>
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
        {courseToUpdate && (
          <Modal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
          >
            <UpdateCourseForm
              course={courseToUpdate}
              onClose={() => {
                setIsUpdateModalOpen(false);
                setCourseToUpdate(null);
              }}
              onCourseUpdated={fetchTeacherData}
            />
          </Modal>
        )}
        {showConfirmDialog && (
          <ConfirmDialog
            isOpen={showConfirmDialog}
            onClose={() => setShowConfirmDialog(false)}
            onConfirm={handleConfirmDelete}
            title="Delete Enrollment"
            message="Are you sure you want to delete this enrollment? This action cannot be undone and may cause issues if the student has already paid."
          />
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;
