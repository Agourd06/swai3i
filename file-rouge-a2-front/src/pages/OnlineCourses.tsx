import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CourseType } from '../fetchers/courseFetchers';
import { enrollmentFetchers } from '../fetchers/enrollmentFetchers';
import { Enrollment } from '../types/enrollment.types';
import Chat from '../components/chat/Chat';

const OnlineCourses: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Enrollment["course"] | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user?._id) return;
      try {
        const userEnrollments = await enrollmentFetchers.getEnrollments({
          student: user._id,
        });
        const onlineEnrollments = userEnrollments.filter(
          enrollment => enrollment.course.courseType.includes(CourseType.ONLINE)
        );
        setEnrollments(onlineEnrollments);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      }
    };

    fetchEnrollments();
  }, [user?._id]);

  const handleOpenChat = (enrollment: Enrollment) => {
    setSelectedCourse(enrollment.course);
    setSelectedEnrollment(enrollment);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Side - Course List */}
      <div className="w-1/3 border-r overflow-y-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          My Online Courses
        </h1>

        <div className="space-y-4">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment._id}
              className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-all duration-200"
            >
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">
                  {enrollment.course.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {enrollment.course.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                      {enrollment.course.teacher.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-700">{enrollment.course.teacher.username}</span>
                  </div>
                  <button
                    onClick={() => handleOpenChat(enrollment)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v1H5V6zm6 3H5v1h6V9zm6 3H5v1h12v-1z" />
                    </svg>
                    <span>Chat</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat */}
      <div className="flex-1 flex flex-col">
        {selectedCourse && selectedEnrollment ? (
          <Chat
            courseId={selectedCourse._id}
            teacherId={selectedEnrollment.course.teacher}
            room={`course_${selectedCourse._id}${selectedEnrollment.student._id}${selectedEnrollment.course.teacher}`}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a course to start chatting with the teacher
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineCourses; 