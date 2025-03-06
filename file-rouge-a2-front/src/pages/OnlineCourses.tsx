import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {  CourseType } from '../fetchers/courseFetchers';
import { enrollmentFetchers } from '../fetchers/enrollmentFetchers';
// import { Course } from '../types/course.types';
import { Enrollment } from '../types/enrollment.types';
import Chat from '../components/chat/Chat';
import Modal from '../components/common/Modal';

const OnlineCourses: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Enrollment["course"] | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user?._id) return;
      try {
        const userEnrollments = await enrollmentFetchers.getEnrollments({
          student: user._id,
        });
        // Filter only online courses
        console.log(userEnrollments);
        const onlineEnrollments = userEnrollments.filter(
          enrollment => enrollment.course.courseType.includes(CourseType.ONLINE)
        );
        setEnrollments(onlineEnrollments);
        
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      }
    };
// console.log('test');

    fetchEnrollments();
  }, [user?._id]);

  const handleOpenChat = (enrollment: Enrollment) => {
    setSelectedCourse(enrollment.course);
    setSelectedEnrollment(enrollment);
    setShowChat(true);
  };
  console.log('Selected Course:', selectedCourse)
  console.log('Selected Enrollment:', selectedEnrollment)
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Online Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((enrollment) => (
          <div
            key={enrollment._id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-2">
              {enrollment.course.title}
            </h2>
            <p className="text-gray-600 mb-4">{enrollment.course.description}</p>
            <button
              onClick={() => handleOpenChat(enrollment)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Message Teacher
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={showChat} onClose={() => setShowChat(false)}>
        {selectedCourse && selectedEnrollment && (
          <>
         
            <Chat
              courseId={selectedCourse._id}
              teacherId={selectedEnrollment.course.teacher}
              room={`course_${selectedCourse._id}`}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default OnlineCourses; 