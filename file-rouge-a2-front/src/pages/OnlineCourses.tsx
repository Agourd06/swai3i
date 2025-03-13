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
        // console.log("onlineEnrollments", userEnrollments);
        const onlineEnrollments = userEnrollments.filter(
          (enrollment: Enrollment) => enrollment.course.courseType.includes(CourseType.ONLINE)
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
    console.log("enrollment", enrollment);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Left Side - Course List */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r overflow-y-auto p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
          My Online Courses
        </h1>

        <div className="space-y-4">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment._id}
              className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-all duration-200"
            >
              <div className="p-3 sm:p-4">
                <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800">
                  {enrollment.course.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  {enrollment.course.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm sm:text-base">
                      {enrollment.course.teacher.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm sm:text-base text-gray-700">{enrollment.course.teacher.username}</span>
                  </div>
                  <button
                    onClick={() => handleOpenChat(enrollment)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors duration-200 flex items-center space-x-1 sm:space-x-2"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
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
      <div className="flex-1 flex flex-col h-[60vh] md:h-auto">
        {selectedCourse && selectedEnrollment ? (
          <Chat
            courseId={selectedCourse._id}
            teacherId={selectedEnrollment.course.teacher._id}
            teacherName={selectedEnrollment.course.teacher.username}
            room={`course_${selectedCourse._id}${selectedEnrollment.student._id}${selectedEnrollment.course.teacher._id}`}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm sm:text-base p-4 text-center">
            Select a course to start chatting with the teacher
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineCourses; 