import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CourseType, courseFetchers } from '../fetchers/courseFetchers';
import { Course } from '../types/course.types';
import TeacherChat from '../components/chat/TeacherChat';
import Modal from '../components/common/Modal';

const TeacherOnlineCourses: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
// console.log(courses);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?._id) return;
      try {
        const teacherCourses = await courseFetchers.getTeacherCourses(user._id);
        const onlineCourses = teacherCourses.filter(
          course => course.courseType.includes(CourseType.ONLINE)
        );
        setCourses(onlineCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [user?._id]);

  const handleOpenChat = (course: Course, student: string) => {
    setSelectedCourse(course);
    setSelectedStudent(student);
    setShowChat(true);
  };

console.log("courses", courses);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Online Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-2">
              {course.title}
            </h2>
            <p className="text-gray-600 mb-4">{course.description}</p>
            
            {/* List of enrolled students */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Enrolled Students:</h3>
              {course.enrollments?.map((enrollment) => (
                <div key={enrollment._id} className="flex justify-between items-center mb-2">
                  <span>{enrollment.student.username}</span>
                  <button
                    onClick={() => handleOpenChat(course, enrollment.student._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    Chat
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showChat} onClose={() => setShowChat(false)}>
        <div>
          <h2 className="text-xl font-semibold mb-4">Chat with Student</h2>
          {selectedCourse && selectedStudent && (
            <TeacherChat
              courseId={selectedCourse?._id || ''}
              studentId={selectedStudent}
              room={`course_${selectedCourse?._id+selectedStudent+selectedCourse.teacher || ''}`}
            />
        )} 
        </div>
      </Modal>
    </div>
  );
};

export default TeacherOnlineCourses; 