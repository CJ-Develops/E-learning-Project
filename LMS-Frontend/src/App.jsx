import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Courses from './pages/dashboard/Courses';
import CoursePlayer from './pages/dashboard/CoursePlayer';
import CourseLessons from './pages/dashboard/CourseLessons';
import ManageAssignments from './pages/dashboard/ManageAssignments';
import GradingHub from './pages/dashboard/GradingHub';
import StudentLibrary from './pages/dashboard/StudentLibrary';
import StudentCourse from './pages/dashboard/StudentCourse';
import StudentAssignments from './pages/dashboard/StudentAssignments';
import StudentGrades from './pages/dashboard/StudentGrades';
import UsersList from './pages/dashboard/Users';
import Grading from './pages/dashboard/Grading';
import Settings from './pages/dashboard/Settings';
import Notifications from './pages/dashboard/Notifications';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:courseId/lessons" element={<CourseLessons />} />
              <Route path="courses/:courseId/learn" element={<CoursePlayer />} />
              <Route path="assignments/manage" element={<ManageAssignments />} />
              <Route path="assignments/grading" element={<GradingHub />} />
              <Route path="student/library" element={<StudentLibrary />} />
              <Route path="student/grades" element={<StudentGrades />} />
              <Route path="student/courses/:courseId" element={<StudentCourse />} />
              <Route path="assignments" element={<StudentAssignments />} />
              <Route path="users" element={<UsersList />} />
              <Route path="grading" element={<Grading />} />
              <Route path="settings" element={<Settings />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
