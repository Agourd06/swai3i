// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { studentFetchers } from '../fetchers/studentFetchers';

// const StudentProfile = () => {
//     const { id } = useParams();
//     const [student, setStudent] = useState(null);
//     const [enrollments, setEnrollments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchStudentData = async () => {
//             try {
//                 const studentData = await studentFetchers.fetchStudentById(id);
//                 setStudent(studentData);
//                 const studentEnrollments = await studentFetchers.fetchEnrollmentsByStudentId(id);
//                 setEnrollments(studentEnrollments);
//             } catch (err) {
//                 setError('Failed to load student data');
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchStudentData();
//     }, [id]);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;
//     if (!student) return <div>Student not found</div>;

//     return (
//         <div>
//             <h1>{student.name}'s Profile</h1>
//             <h2>Enrolled Courses</h2>
//             <ul>
//                 {enrollments.map(enrollment => (
//                     <li key={enrollment._id}>{enrollment.course.title}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default StudentProfile; 