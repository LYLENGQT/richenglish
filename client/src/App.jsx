import React, { createContext, useReducer, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

// Components
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import TeacherApplication from './pages/TeacherApplication';
import FAQ from './pages/FAQ';
import TeacherLeaderboard from './pages/TeacherLeaderboard';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Classes from './pages/Classes';
import Attendance from './pages/Attendance';
import MakeupClasses from './pages/MakeupClasses';
import Layout from './pages/Layout';
import BookViewer from './pages/BookViewer';
import Books from './pages/Books';

// Context
export const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('teacher', JSON.stringify(action.payload.teacher));
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        teacher: action.payload.teacher
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('teacher');
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        teacher: null
      };
    case 'INIT_AUTH':
      return {
        ...state,
        isAuthenticated: !!action.payload.token,
        token: action.payload.token,
        teacher: action.payload.teacher
      };
    default:
      return state;
  }
};

// Auth provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    token: null,
    teacher: null
  });

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const teacher = localStorage.getItem('teacher');
    
    if (token && teacher) {
      dispatch({
        type: 'INIT_AUTH',
        payload: { token, teacher: JSON.parse(teacher) }
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { state } = useContext(AuthContext);
  return state.isAuthenticated ? children : <Navigate to="/login" />;
};

// Routes component that can access context
function AppRoutes() {
  const { state } = useContext(AuthContext);

  return (
    <Routes>
      <Route 
        path="/" 
        element={!state.isAuthenticated ? <LandingPage /> : <Navigate to="/portal/dashboard" />} 
      />
      
      <Route 
        path="/login" 
        element={!state.isAuthenticated ? <Login /> : <Navigate to="/portal/dashboard" />} 
      />
      
      {/* Public Pages */}
      <Route path="/about" element={<About />} />
      <Route path="/apply" element={<TeacherApplication />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/leaderboard" element={<TeacherLeaderboard />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Protected Portal Routes */}
      <Route path="/portal" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/portal/dashboard" />} />
        <Route path="dashboard" element={
          state.teacher?.role === 'admin' ? <AdminDashboard /> : <Dashboard />
        } />
        <Route path="students" element={<Students />} />
        <Route path="teachers" element={
          state.teacher?.role === 'admin' ? <Teachers /> : <Navigate to="/portal/dashboard" />
        } />
        <Route path="classes" element={<Classes />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="makeup-classes" element={<MakeupClasses />} />
        <Route path="books" element={<Books />} />
        <Route path="books/:id" element={<BookViewer />} />
      </Route>
    </Routes>
  );
}

// Main App component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster position="top-right" />
          
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;