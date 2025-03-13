import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CourseType, courseFetchers } from '../fetchers/courseFetchers';
import { Course } from '../types/course.types';
import TeacherChat from '../components/chat/TeacherChat';

const TeacherOnlineCourses: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

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
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Side - Course List */}
      <div className="w-1/3 border-r overflow-y-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          My Online Courses
        </h1>

        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-md border"
            >
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                  {course.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {course.description}
                </p>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-gray-700">
                    Enrolled Students
                  </h3>
                  <div className="space-y-2">
                    {course.enrollments?.map((enrollment) => (
                      <div 
                        key={enrollment._id} 
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                            {enrollment.student.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-gray-700">{enrollment.student.username}</span>
                        </div>
                        <button
                          onClick={() => handleOpenChat(course, enrollment.student._id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v1H5V6zm6 3H5v1h6V9zm6 3H5v1h12v-1z" />
                          </svg>
                          <span>Chat</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat */}
      <div className="flex-1 flex flex-col">
        {selectedCourse && selectedStudent ? (
          <TeacherChat
            courseId={selectedCourse._id}
            studentId={selectedStudent}
            room={`course_${selectedCourse._id}${selectedStudent}${selectedCourse.teacher._id}`}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a student to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherOnlineCourses; 