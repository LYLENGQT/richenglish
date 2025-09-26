import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import {
  UserGroupIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import ChatSideBar from '../components/ChatSideBar';

const Dashboard = () => {
  const { state } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeClasses: 0,
    todayAttendance: 0,
    pendingMakeups: 0
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, studentsResponse] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/students')
      ]);

      setStats(statsResponse.data);
      setRecentStudents(studentsResponse.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
      name: 'Active Classes',
      value: stats.activeClasses,
      icon: CalendarIcon,
      color: 'bg-green-500'
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
        <h1 className="text-2xl font-bold text-gray-900">
          {state.teacher?.role === 'admin' ? 'Admin Dashboard' : 'Teacher Dashboard'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to Rich English Teacher Portal, {state.teacher?.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
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
                  Add, edit, or view student information
                </p>
              </div>
            </Link>

            <Link
              to="/classes"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  <CalendarIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  Schedule Classes
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Create and manage class schedules
                </p>
              </div>
            </Link>

            <Link
              to="/attendance"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                  <ClipboardDocumentListIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  Record Attendance
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Track student attendance and progress
                </p>
              </div>
            </Link>

            <Link
              to="/makeup-classes"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-red-50 text-red-700 ring-4 ring-white">
                  <ClockIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" />
                  Makeup Classes
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Schedule and track makeup sessions
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <ChatSideBar />
    </div>
  );
};

export default Dashboard;
