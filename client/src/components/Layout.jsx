import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BookOpenIcon,
  BanknotesIcon,
  FolderOpenIcon,
  VideoCameraIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import useAuthStore from "../lib/zustand/authStore";
import { logout } from "../lib/axios/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import ChatSideBar from "./ChatSideBar";
import DashboardHeader from "./DashboardHeader";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id, name, email, role } = useAuthStore();

  const getNavigation = (role) => {
    if (role === "teacher") {
      return [
        {
          name: "Dashboard",
          href: `/portal/${role}/dashboard`,
          icon: HomeIcon,
        },
        {
          name: "My Students",
          href: `/portal/${role}/students`,
          icon: UserGroupIcon,
        },
        {
          name: "My Schedule",
          href: `/portal/${role}/schedule`,
          icon: CalendarIcon,
        },
        {
          name: "Classes",
          href: `/portal/${role}/classes`,
          icon: CalendarIcon,
        },
        {
          name: "Makeup Classes",
          href: `/portal/${role}/makeup-classes`,
          icon: ClockIcon,
        },
        {
          name: "Attendance",
          href: `/portal/${role}/attendance`,
          icon: ClipboardDocumentListIcon,
        },
        { name: "Books", href: `/portal/${role}/books`, icon: BookOpenIcon },
        {
          name: "Recordings",
          href: `/portal/${role}/recordings`,
          icon: VideoCameraIcon,
        },
        {
          name: "Reports",
          href: `/portal/${role}/reports`,
          icon: FolderOpenIcon,
        },
      ];
    }

    if (role === "admin") {
      return [
        {
          name: "Dashboard",
          href: `/portal/${role}/dashboard`,
          icon: HomeIcon,
        },
        { name: "Teachers", href: `/portal/${role}/teachers`, icon: UsersIcon },
        {
          name: "Students",
          href: `/portal/${role}/students`,
          icon: UserGroupIcon,
        },
        {
          name: "Schedules",
          href: `/portal/${role}/schedules`,
          icon: CalendarIcon,
        },
        {
          name: "Attendance",
          href: `/portal/${role}/attendance`,
          icon: ClipboardDocumentListIcon,
        },
        {
          name: "Reports",
          href: `/portal/${role}/reports`,
          icon: FolderOpenIcon,
        },
        {
          name: "Payout Summary",
          href: `/portal/${role}/payouts`,
          icon: BanknotesIcon,
        },
        {
          name: "Screenshots",
          href: `/portal/${role}/screenshots`,
          icon: VideoCameraIcon,
        },
        {
          name: "Recordings",
          href: `/portal/${role}/recordings`,
          icon: VideoCameraIcon,
        },
        {
          name: "Books Archive",
          href: `/portal/${role}/books`,
          icon: BookOpenIcon,
        },
        {
          name: "Search",
          href: `/portal/${role}/search`,
          icon: MagnifyingGlassIcon,
        },
      ];
    }

    if (role === "super-admin") {
      return [
        {
          name: "Dashboard",
          href: `/portal/${role}/dashboard`,
          icon: HomeIcon,
        },
        { name: "Teachers", href: `/portal/${role}/teachers`, icon: UsersIcon },
        { name: "Admins", href: `/portal/${role}/admins`, icon: UsersIcon },
        {
          name: "Students",
          href: `/portal/${role}/students`,
          icon: UserGroupIcon,
        },
        {
          name: "Schedules",
          href: `/portal/${role}/schedules`,
          icon: CalendarIcon,
        },
        {
          name: "Books Management",
          href: `/portal/${role}/books`,
          icon: BookOpenIcon,
        },
        {
          name: "Assign Books",
          href: `/portal/${role}/assign-books`,
          icon: BookOpenIcon,
        },
        {
          name: "Curriculum Access",
          href: `/portal/${role}/curriculum`,
          icon: FolderOpenIcon,
        },
        {
          name: "Attendance",
          href: `/portal/${role}/attendance`,
          icon: ClipboardDocumentListIcon,
        },
        {
          name: "Reports",
          href: `/portal/${role}/reports`,
          icon: FolderOpenIcon,
        },
        {
          name: "Salary Management",
          href: `/portal/${role}/salary`,
          icon: BanknotesIcon,
        },
        {
          name: "Payout Overview",
          href: `/portal/${role}/payouts`,
          icon: BanknotesIcon,
        },
        {
          name: "Screenshots",
          href: `/portal/${role}/screenshots`,
          icon: VideoCameraIcon,
        },
        {
          name: "Recordings",
          href: `/portal/${role}/recordings`,
          icon: VideoCameraIcon,
        },
        {
          name: "Search",
          href: `/portal/${role}/search`,
          icon: MagnifyingGlassIcon,
        },
        {
          name: "Settings",
          href: `/portal/${role}/settings`,
          icon: Cog6ToothIcon,
        },
      ];
    }

    return [];
  };

  const navigation = getNavigation(role);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
    } finally {
      toast.success("Success Logout");
      navigate("/login");
    }
  };

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden ${
          sidebarOpen ? "" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">Rich English</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isCurrentPath(item.href)
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  >
                    <Icon className="mr-4 h-6 w-6" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-base font-medium text-gray-700">{name}</p>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-gray-900">
                  Rich English
                </h1>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isCurrentPath(item.href)
                          ? "bg-blue-100 text-blue-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                      <Icon className="mr-3 h-6 w-6" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700">{name}</p>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="sm:mx-auto  px-4 sm:px-6 md:px-8">
              <DashboardHeader />
              <Outlet />
              <ChatSideBar />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
