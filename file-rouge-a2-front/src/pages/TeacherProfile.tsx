import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { teacherFetchers } from "../fetchers/teacherFetchers";
import AddCourseForm from "../components/AddCourseForm";
import Modal from "../components/common/Modal";
import { classroomFetchers } from "../fetchers/classroomFetcher";
import { enrollmentFetchers } from "../fetchers/enrollmentFetchers";
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
  // const { user } = useAuth();

  useEffect(() => {
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

    fetchTeacherData();
  }, [id]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!teacher) return <div className="text-center">Teacher not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">{teacher.username}'s Profile</h1>
      <p className="text-lg">
        <strong>Email:</strong> {teacher.email}
      </p>
      <p className="text-lg">
        <strong>Phone:</strong> {teacher.phone}
      </p>
      <p className="text-lg">
        <strong>Address:</strong> {teacher.address}
      </p>
      <h2 className="text-2xl font-semibold mt-6">Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="border p-4 rounded-lg shadow-lg bg-white">
            <h3 className="text-xl font-semibold">{course.title}</h3>
            <h4 className="text-lg font-semibold">Classrooms:</h4>
            <ul>
              {classrooms
                .filter(classroom => classroom.course === course._id)
                .map(classroom => (
                  <li key={classroom._id} className="mt-2">
                    <div className="font-medium">Capacity: {classroom.capacity}</div>
                    <div>Students Enrolled:</div>
                    <ul>
                      {enrollments
                        .filter(enrollment => enrollment.classroom === classroom._id)
                        .map(enrollment => (
                          <li key={enrollment._id} className="text-gray-600">
                            {enrollment.student.username}
                          </li>
                        ))}
                    </ul>
                    
                  </li>
                ))}
              {classrooms.filter(classroom => classroom.course === course._id).length === 0 && (
                <li className="text-gray-600 mt-2">No classrooms exist.</li>
              )}
            </ul>
          </div>
        ))}
      </div>
      <button
        onClick={handleOpenModal}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add New Course
      </button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddCourseForm teacherId={id || ""} setIsModalOpen={setIsModalOpen}/>
      </Modal>
    </div>
  );
};

export default TeacherProfile;
