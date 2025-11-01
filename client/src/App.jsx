import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import AOS from "aos";

// import Dashboard from '@/pages/Dashboard';
// import AdminDashboard from '@/pages/AdminDashboard';
// import Students from '@/pages/Students';
// import Teachers from '@/pages/Teachers';
// import Classes from '@/pages/Classes';
// import Attendance from '@/pages/Attendance';
// import MakeupClasses from '@/pages/MakeupClasses';
// import Layout from '@/pages/Layout';
// import BookViewer from '@/pages/BookViewer';
// import Books from '@/pages/Books';

// public
import LandingPage from "@/pages/Public/LandingPage";
import About from "@/pages/Public/About";
import FAQ from "@/pages/Public/FAQ";
import Contact from "@/pages/Public/Contact";
import Login from "@/pages/Public/Login";
import TeacherApplication from "@/pages/Public/TeacherApplication";
import TeacherLeaderboard from "@/pages/Public/TeacherLeaderboard";
import NotFound from "@/pages/Public/NotFound";

// teacher portal
import TeacherDashboard from "@/pages/Teacher/Dashboard";
import TeacherStudents from "@/pages/Teacher/Students";
import TeacherStudentDetail from "@/pages/Teacher/details/StudentDetail";
import TeacherClasses from "@/pages/Teacher/Classes";
import ClassDetail from "@/pages/Teacher/details/ClassDetail";
import TeacherMakeUpClass from "@/pages/Teacher/MakeUpClass";
import MakeupClassDetail from "@/pages/Teacher/details/MakeupClassDetail";
import TeacherBooks from "@/pages/Teacher/Books";
import BookDetail from "@/pages/Teacher/details/BookDetail";
import TeacherAttendance from "@/pages/Teacher/Attendance";
import TeacherRecordings from "@/pages/Teacher/Recording";
import RecordingDetail from "@/pages/Teacher/details/RecordingDetail";
import TeacherReports from "@/pages/Teacher/Report";
import TeacherSchedule from "@/pages/Teacher/Schedule";

// admin portal
import AdminDashboard from "@/pages/Admin/Dashboard";
import AdminTeachers from "@/pages/Admin/Teachers";
import AdminStudents from "@/pages/Admin/Students";
import AdminStudentDetail from "@/pages/Admin/Details/StudentDetail";
import AdminTeacherDetail from "@/pages/Admin/Details/TeacherDetail";
import ScheduleDetailAdmin from "@/pages/Admin/Details/ScheduleDetail";
import AttendanceDetailAdmin from "@/pages/Admin/Details/AttendanceDetail";
import ReportDetailAdmin from "@/pages/Admin/Details/ReportDetail";
import PayoutDetailAdmin from "@/pages/Admin/Details/PayoutDetail";
import ScreenshotDetailAdmin from "@/pages/Admin/Details/ScreenshotDetail";
import RecordingDetailAdmin from "@/pages/Admin/Details/RecordingDetail";
import BookDetailAdmin from "@/pages/Admin/BookDetail";
import AdminSchedules from "@/pages/Admin/Schedules";
import AdminAttendance from "@/pages/Admin/Attendance";
import AdminReports from "@/pages/Admin/Reports";
import AdminPayouts from "@/pages/Admin/Payouts";
import AdminScreenshots from "@/pages/Admin/Screenshots";
import AdminRecordings from "@/pages/Admin/Recordings";
import AdminBooks from "@/pages/Admin/Books";
import AdminSearch from "@/pages/Admin/Search";

// super admin portal
import SuperAdminDashboard from "@/pages/SuperAdmin/Dashboard";
import SuperAdminTeachers from "@/pages/SuperAdmin/Teachers";
import SuperAdminAdmins from "@/pages/SuperAdmin/Admins";
import SuperAdminStudents from "@/pages/SuperAdmin/Students";
import SuperAdminStudentDetail from "@/pages/SuperAdmin/Details/StudentDetail";
import SuperAdminTeacherDetail from "@/pages/SuperAdmin/Details/TeacherDetail";
import SuperAdminAdminDetail from "@/pages/SuperAdmin/Details/AdminDetail";
import SuperAdminSchedules from "@/pages/SuperAdmin/Schedules";
import SuperAdminBooks from "@/pages/SuperAdmin/Books";
import SuperAdminAssignBooks from "@/pages/SuperAdmin/AssignBooks";
import SuperAdminCurriculum from "@/pages/SuperAdmin/Curriculum";
import SuperAdminAttendance from "@/pages/SuperAdmin/Attendance";
import SuperAdminReports from "@/pages/SuperAdmin/Reports";
import SuperAdminSalary from "@/pages/SuperAdmin/Salary";
import SuperAdminPayouts from "@/pages/SuperAdmin/Payouts";
import SuperAdminScreenshots from "@/pages/SuperAdmin/Screenshots";
import SuperAdminRecordings from "@/pages/SuperAdmin/Recordings";
import SuperAdminSearch from "@/pages/SuperAdmin/Search";
import SuperAdminSettings from "@/pages/SuperAdmin/Settings";
import ScheduleDetailSuper from "@/pages/SuperAdmin/Details/ScheduleDetail";
import BookDetailSuper from "@/pages/SuperAdmin/BookDetail";
import AssignBookDetailSuper from "@/pages/SuperAdmin/Details/AssignBookDetail";
import CurriculumDetailSuper from "@/pages/SuperAdmin/Details/CurriculumDetail";
import AttendanceDetailSuper from "@/pages/SuperAdmin/Details/AttendanceDetail";
import ReportDetailSuper from "@/pages/SuperAdmin/Details/ReportDetail";
import SalaryDetailSuper from "@/pages/SuperAdmin/Details/SalaryDetail";
import PayoutDetailSuper from "@/pages/SuperAdmin/Details/PayoutDetail";
import ScreenshotDetailSuper from "@/pages/SuperAdmin/Details/ScreenshotDetail";
import RecordingDetailSuper from "@/pages/SuperAdmin/Details/RecordingDetail";
import SettingsDetailSuper from "@/pages/SuperAdmin/Details/SettingsDetail";
import SuperAdminTeacherApplications from "@/pages/SuperAdmin/TeacherApplications";

// components
import ProtectedRoute from "./components/ProtecTedRoute";
import Layout from "./components/Layout";

function AppContainer() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const getResponsiveConfig = () => ({
      duration: window.innerWidth < 768 ? 600 : 1000,
      offset: window.innerWidth < 768 ? 80 : 120,
    });

    AOS.init({
      easing: "ease-out-cubic",
      once: true,
      ...getResponsiveConfig(),
    });

    const handleResize = () => {
      if (typeof window === "undefined") {
        return;
      }

      AOS.init({
        easing: "ease-out-cubic",
        once: true,
        ...getResponsiveConfig(),
      });

      AOS.refreshHard();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [location.pathname]);

  return (
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
              <Route
                path="/portal/teacher/students"
                element={<TeacherStudents />}
              />
              <Route
                path="/portal/teacher/classes"
                element={<TeacherClasses />}
              />
              <Route
                path="/portal/teacher/classes/:id"
                element={<ClassDetail />}
              />
              <Route
                path="/portal/teacher/makeup-classes"
                element={<TeacherMakeUpClass />}
              />
              <Route
                path="/portal/teacher/makeup-classes/:id"
                element={<MakeupClassDetail />}
              />
              <Route path="/portal/teacher/books" element={<TeacherBooks />} />
              <Route
                path="/portal/teacher/books/:id"
                element={<BookDetail />}
              />
              <Route
                path="/portal/teacher/attendance"
                element={<TeacherAttendance />}
              />
              <Route
                path="/portal/teacher/recordings"
                element={<TeacherRecordings />}
              />
              <Route
                path="/portal/teacher/recordings/:id"
                element={<RecordingDetail />}
              />
              <Route
                path="/portal/teacher/reports"
                element={<TeacherReports />}
              />
              <Route
                path="/portal/teacher/schedule"
                element={<TeacherSchedule />}
              />
              <Route
                path="/portal/teacher/students/:id"
                element={<TeacherStudentDetail />}
              />
            </Route>
          </Route>

          <Route
            element={<ProtectedRoute allowedRoles={["admin", "super-admin"]} />}
          >
            <Route element={<Layout />}>
              <Route
                path="/portal/admin/dashboard"
                element={<AdminDashboard />}
              />
              <Route
                path="/portal/admin/teachers"
                element={<AdminTeachers />}
              />
              <Route
                path="/portal/admin/students"
                element={<AdminStudents />}
              />
              <Route
                path="/portal/admin/schedules"
                element={<AdminSchedules />}
              />
              <Route
                path="/portal/admin/schedules/:id"
                element={<ScheduleDetailAdmin />}
              />
              <Route
                path="/portal/admin/attendance"
                element={<AdminAttendance />}
              />
              <Route
                path="/portal/admin/attendance/:id"
                element={<AttendanceDetailAdmin />}
              />
              <Route path="/portal/admin/reports" element={<AdminReports />} />
              <Route
                path="/portal/admin/reports/:id"
                element={<ReportDetailAdmin />}
              />
              <Route path="/portal/admin/payouts" element={<AdminPayouts />} />
              <Route
                path="/portal/admin/payouts/:id"
                element={<PayoutDetailAdmin />}
              />
              <Route
                path="/portal/admin/screenshots"
                element={<AdminScreenshots />}
              />
              <Route
                path="/portal/admin/screenshots/:id"
                element={<ScreenshotDetailAdmin />}
              />
              <Route
                path="/portal/admin/recordings"
                element={<AdminRecordings />}
              />
              <Route
                path="/portal/admin/recordings/:id"
                element={<RecordingDetailAdmin />}
              />
              <Route path="/portal/admin/books" element={<AdminBooks />} />
              <Route
                path="/portal/admin/books/:id"
                element={<BookDetailAdmin />}
              />
              <Route path="/portal/admin/search" element={<AdminSearch />} />
              <Route
                path="/portal/admin/students/:id"
                element={<AdminStudentDetail />}
              />
              <Route
                path="/portal/admin/teachers/:id"
                element={<AdminTeacherDetail />}
              />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["super-admin"]} />}>
            <Route element={<Layout />}>
              <Route
                path="/portal/super-admin/dashboard"
                element={<SuperAdminDashboard />}
              />
              <Route
                path="/portal/super-admin/teachers"
                element={<SuperAdminTeachers />}
              />
              <Route
                path="/portal/super-admin/admins"
                element={<SuperAdminAdmins />}
              />
              <Route
                path="/portal/super-admin/students"
                element={<SuperAdminStudents />}
              />
              <Route
                path="/portal/super-admin/schedules"
                element={<SuperAdminSchedules />}
              />
              <Route
                path="/portal/super-admin/schedules/:id"
                element={<ScheduleDetailSuper />}
              />
              <Route
                path="/portal/super-admin/books"
                element={<SuperAdminBooks />}
              />
              <Route
                path="/portal/super-admin/books/:id"
                element={<BookDetailSuper />}
              />
              <Route
                path="/portal/super-admin/assign-books"
                element={<SuperAdminAssignBooks />}
              />
              <Route
                path="/portal/super-admin/assign-books/:id"
                element={<AssignBookDetailSuper />}
              />
              <Route
                path="/portal/super-admin/curriculum"
                element={<SuperAdminCurriculum />}
              />
              <Route
                path="/portal/super-admin/applications"
                element={<SuperAdminTeacherApplications />}
              />
              <Route
                path="/portal/super-admin/curriculum/:id"
                element={<CurriculumDetailSuper />}
              />
              <Route
                path="/portal/super-admin/attendance"
                element={<SuperAdminAttendance />}
              />
              <Route
                path="/portal/super-admin/attendance/:id"
                element={<AttendanceDetailSuper />}
              />
              <Route
                path="/portal/super-admin/reports"
                element={<SuperAdminReports />}
              />
              <Route
                path="/portal/super-admin/reports/:id"
                element={<ReportDetailSuper />}
              />
              <Route
                path="/portal/super-admin/salary"
                element={<SuperAdminSalary />}
              />
              <Route
                path="/portal/super-admin/salary/:id"
                element={<SalaryDetailSuper />}
              />
              <Route
                path="/portal/super-admin/payouts"
                element={<SuperAdminPayouts />}
              />
              <Route
                path="/portal/super-admin/payouts/:id"
                element={<PayoutDetailSuper />}
              />
              <Route
                path="/portal/super-admin/screenshots"
                element={<SuperAdminScreenshots />}
              />
              <Route
                path="/portal/super-admin/screenshots/:id"
                element={<ScreenshotDetailSuper />}
              />
              <Route
                path="/portal/super-admin/recordings"
                element={<SuperAdminRecordings />}
              />
              <Route
                path="/portal/super-admin/recordings/:id"
                element={<RecordingDetailSuper />}
              />
              <Route
                path="/portal/super-admin/search"
                element={<SuperAdminSearch />}
              />
              <Route
                path="/portal/super-admin/settings"
                element={<SuperAdminSettings />}
              />
              <Route
                path="/portal/super-admin/settings/:id"
                element={<SettingsDetailSuper />}
              />
              <Route
                path="/portal/super-admin/students/:id"
                element={<SuperAdminStudentDetail />}
              />
              <Route
                path="/portal/super-admin/teachers/:id"
                element={<SuperAdminTeacherDetail />}
              />
              <Route
                path="/portal/super-admin/admins/:id"
                element={<SuperAdminAdminDetail />}
              />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContainer />
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
