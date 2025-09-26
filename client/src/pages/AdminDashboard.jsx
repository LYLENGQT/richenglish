import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  UserGroupIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  ChartBarIcon,
  UsersIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import ChatSideBar from '../components/ChatSideBar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    activeClasses: 0,
    todayAttendance: 0,
    pendingMakeups: 0
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentTeachers, setRecentTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [bookFile, setBookFile] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchBooks();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, studentsResponse, teachersResponse] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/students'),
        api.get('/teachers')
      ]);

      setStats({
        ...statsResponse.data,
        totalTeachers: teachersResponse.data.length
      });
      setRecentStudents(studentsResponse.data.slice(0, 5));
      setRecentTeachers(teachersResponse.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await api.get('/books');
      setBooks(res.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const statCards = [
    {
      name: 'Total Students',
      value: stats.totalStudents,
      icon: UserGroupIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Teachers',
      value: stats.totalTeachers,
      icon: UsersIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Active Classes',
      value: stats.activeClasses,
      icon: CalendarIcon,
      color: 'bg-purple-500'
    },
    {
      name: "Today's Attendance",
      value: stats.todayAttendance,
      icon: ClipboardDocumentListIcon,
      color: 'bg-yellow-500'
    },
    {
      name: 'Pending Makeups',
      value: stats.pendingMakeups,
      icon: ClockIcon,
      color: 'bg-red-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of the entire Rich English Teacher Portal
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${card.color} p-3 rounded-md`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {card.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {card.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Students and Teachers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Students */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Students
            </h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentStudents.map((student) => (
                  <li key={student.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                          student.manager_type === 'KM' ? 'bg-blue-500' : 'bg-red-500'
                        }`}>
                          {student.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {student.age ? `Age: ${student.age}` : 'Adult'} • {student.nationality} • {student.manager_type}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        {student.category_level}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to="/students"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View all students
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Teachers */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Teachers
            </h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentTeachers.map((teacher) => (
                  <li key={teacher.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                          teacher.role === 'admin' ? 'bg-purple-500' : 'bg-green-500'
                        }`}>
                          {teacher.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {teacher.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {teacher.email}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          teacher.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {teacher.role}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to="/teachers"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Manage teachers
              </Link>
            </div>
          </div>
        </div>

        {/* Upload Book (PDF) */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Upload Book (PDF)
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!bookFile) return;
                setUploading(true);
                try {
                  const form = new FormData();
                  if (bookTitle) form.append('title', bookTitle);
                  form.append('file', bookFile);
                  await api.post('/books', form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });
                  setBookTitle('');
                  setBookFile(null);
                  await fetchBooks();
                } catch (err) {
                  console.error(err);
                  alert('Upload failed');
                } finally {
                  setUploading(false);
                }
              }}
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="Title (optional)"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setBookFile(e.target.files?.[0] || null)}
                className="border p-2 rounded w-full"
              />
              <button
                type="submit"
                disabled={uploading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Admin Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/students"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                  <UserGroupIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  Manage Students
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Add, edit, or view all students
                </p>
              </div>
            </Link>

            <Link
              to="/teachers"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  <UsersIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  Manage Teachers
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Add, edit, or view all teachers
                </p>
              </div>
            </Link>

            <Link
              to="/classes"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                  <CalendarIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  All Classes
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  View and manage all classes
                </p>
              </div>
            </Link>

            <Link
              to="/reports"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                  <ChartBarIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  Reports
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  View attendance and performance reports
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Books List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Books</h3>
          <ul className="divide-y divide-gray-200">
            {books.map((b) => (
              <li key={b.id} className="py-3 flex items-center justify-between">
                <span className="text-gray-800">{b.title}</span>
                <Link to={`/portal/books/${b.id}`} className="text-blue-600 hover:underline">View</Link>
              </li>
            ))}
            {books.length === 0 && (
              <li className="py-3 text-gray-500">No books uploaded yet.</li>
            )}
          </ul>
        </div>
      </div>
      <ChatSideBar />
    </div>
  );
};

export default AdminDashboard;
