import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// import Dashboard from './pages/Dashboard';
// import AdminDashboard from './pages/AdminDashboard';
// import Students from './pages/Students';
// import Teachers from './pages/Teachers';
// import Classes from './pages/Classes';
// import Attendance from './pages/Attendance';
// import MakeupClasses from './pages/MakeupClasses';
// import Layout from './pages/Layout';
// import BookViewer from './pages/BookViewer';
// import Books from './pages/Books';

// public
import LandingPage from "./pages/Public/LandingPage";
import About from "./pages/Public/About";
import FAQ from "./pages/Public/FAQ";
import Contact from "./pages/Public/Contact";
import Login from "./pages/Public/Login";
import TeacherApplication from "./pages/Public/TeacherApplication";
import TeacherLeaderboard from "./pages/Public/TeacherLeaderboard";
import NotFound from "./pages/Public/NotFound";

// teacher portal
import TeacherDashboard from "./pages/Teacher/Dashboard";
import TeacherStudents from "@/pages/Teacher/Students";
import TeacherClasses from "@/pages/Teacher/Classes";
import TeacherMakeUpClass from "@/pages/Teacher/MakeUpClass";
import TeacherBooks from "@/pages/Teacher/Books";
import TeacherAttendance from "@/pages/Teacher/Attendance";

// admin portal
import AdminDashboard from "./pages/Admin/Dashboard";

// super admin portal
import SuperAdminDashboard from "./pages/SuperAdmin/Dashboard";

// components
import ProtectedRoute from "./components/ProtecTedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/apply" element={<TeacherApplication />} />
          <Route path="leaderboard" element={<TeacherLeaderboard />} />

          <Route path="/login" element={<Login />} />

          {/* Protected routes with Layout */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={["teacher", "admin", "super-admin"]}
              />
            }
          >
            <Route element={<Layout />}>
              <Route
                path="/portal/teacher/dashboard"
                element={<TeacherDashboard />}
              />
            </Route>
            <Route element={<Layout />}>
              <Route
                path="/portal/teacher/students"
                element={<TeacherStudents />}
              />
            </Route>
            <Route element={<Layout />}>
              <Route
                path="/portal/teacher/classes"
                element={<TeacherClasses />}
              />
            </Route>
            <Route element={<Layout />}>
              <Route
                path="/portal/teacher/makeup-classes"
                element={<TeacherMakeUpClass />}
              />
            </Route>
            <Route element={<Layout />}>
              <Route path="/portal/teacher/books" element={<TeacherBooks />} />
            </Route>
            <Route element={<Layout />}>
              <Route
                path="/portal/teacher/attendance"
                element={<TeacherAttendance />}
              />
            </Route>
          </Route>

          <Route
            element={<ProtectedRoute allowedRoles={["admin", "super-admin"]} />}
          >
            <Route element={<Layout />}>
              <Route path="/portal/admin" element={<AdminDashboard />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["super-admin"]} />}>
            <Route element={<Layout />}>
              <Route
                path="/portal/super-admin"
                element={<SuperAdminDashboard />}
              />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// function AppRoutes() {

//   return (
//     <Routes>

//       {/* <Route
//         path="/"
//         element={!state.isAuthenticated ? <LandingPage /> : <Navigate to="/portal/dashboard" />}
//       />

//       <Route
//         path="/login"
//         element={!state.isAuthenticated ? <Login /> : <Navigate to="/portal/dashboard" />}
//       />

//       <Route path="/about" element={<About />} />
//       <Route path="/apply" element={<TeacherApplication />} />
//       <Route path="/faq" element={<FAQ />} />
//       <Route path="/leaderboard" element={<TeacherLeaderboard />} />
//       <Route path="/contact" element={<Contact />} /> */}

//       {/* <Route path="/portal" element={
//         <ProtectedRoute>
//           <Layout />
//         </ProtectedRoute>
//       }>
//         <Route index element={<Navigate to="/portal/dashboard" />} />
//         <Route path="dashboard" element={
//           (state.teacher?.role === 'admin' || state.teacher?.role === 'super-admin') ? <AdminDashboard /> : <Dashboard />
//         } />
//         <Route path="students" element={<Students />} />
//         <Route path="teachers" element={
//           (state.teacher?.role === 'admin' || state.teacher?.role === 'super-admin') ? <Teachers /> : <Navigate to="/portal/dashboard" />
//         } />
//         <Route path="classes" element={<Classes />} />
//         <Route path="attendance" element={<Attendance />} />
//         <Route path="makeup-classes" element={<MakeupClasses />} />
//         <Route path="books" element={<Books />} />
//         <Route path="books/:id" element={<BookViewer />} />
//       </Route> */}
//     </Routes>
//   );
// }
