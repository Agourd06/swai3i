import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./middlewares/MiddleWare";
import Unauthorized from "./pages/Unauthorized";
import Dashboard from "./pages/Dashboard";
import Enrollments from "./pages/Enrollments";
import CourseDetails from "./pages/CourseDetails";
import EnrollmentSuccess from './pages/EnrollmentSuccess';
import Layout from "./components/layout/Layout";
import NotFound from "./pages/NotFound";
import TeacherProfile from "./pages/TeacherProfile";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />
            },
            {
                path: "dashboard",
                element: <ProtectedRoute 
                    element={<Dashboard />}
                    requiredRoles={['teacher', 'student']}
                />
            },
            {
                path: "enrollments",
                element: <ProtectedRoute 
                    element={<Enrollments />}
                    requiredRoles={['student']}
                />
            },
            {
                path: "courses/:id",
                element: <CourseDetails />
            },
            {
                path: "enrollment-success",
                element: <ProtectedRoute 
                    element={<EnrollmentSuccess />}
                    requiredRoles={['student']}
                />
            },
            {
                path: "unauthorized",
                element: <Unauthorized />
            },
            {
                path: '/teacher/:id',
                element: <TeacherProfile />,
            },
        
          
        ]
    },
    {
        path: "/auth",
        children: [
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
]);
