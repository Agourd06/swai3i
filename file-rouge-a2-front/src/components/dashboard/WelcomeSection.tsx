import React from 'react';
import { User } from '../../types/auth.types';
import { Enrollment } from '../../types/enrollment.types';

interface WelcomeSectionProps {
  user: User;
  enrollments: Enrollment[];
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ user, enrollments }) => {
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

export default WelcomeSection; 