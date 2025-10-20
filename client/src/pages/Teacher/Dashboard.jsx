import React, { useState } from "react";
import useAuthStore from "../../lib/zustand/authStore";
import {
  UserGroupIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  ChartBarIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { dashboardQuery } from "../../lib/reaactquery/teacher";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { Calendar } from "@/components/ui/calendar";
import { CustomCalendar } from "@/components/ui/custom-calendar";
import { dateConfig } from "@/lib/date-config";
import { CalendarLegend } from "@/components/ui/calendar-legend";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    ...dashboardQuery(),
  });

  const [selectedDate, setSelectedDate] = useState(null);

  const scheduleDates =
    data?.schedule?.map((item) => new Date(item.date)) || [];
  const attendanceDates =
    data?.todayAttendance?.map((item) => new Date(item.date)) || [];
  const pendingDates =
    data?.pendingMakeups?.map((item) => new Date(item.makeup_date)) || [];

  const allDates = [...scheduleDates, ...attendanceDates, ...pendingDates];

  const { name } = useAuthStore();

  // defensive values
  const dashboard = data?.dashboard || {};
  const teacher = dashboard?.teacher || {};
  const totalStudents = dashboard?.students ?? 0;
  const activeClassesCount = Array.isArray(dashboard?.activeClass)
    ? dashboard.activeClass.length
    : dashboard?.activeClass
    ? 1
    : 0;
  const todayAttendanceCount = Array.isArray(dashboard?.todayAttendance)
    ? dashboard.todayAttendance.length
    : dashboard?.todayAttendance
    ? 1
    : 0;
  const pendingMakeupsCount = Array.isArray(dashboard?.pendingMakeups)
    ? dashboard.pendingMakeups.length
    : dashboard?.pendingMakeups
    ? 1
    : 0;

  const statCards = [
    {
      name: "Total Students",
      value: totalStudents,
      icon: UserGroupIcon,
      color: "bg-blue-500",
    },
    {
      name: "Active Classes",
      value: activeClassesCount,
      icon: CalendarIcon,
      color: "bg-green-500",
    },
    {
      name: "Today's Attendance",
      value: todayAttendanceCount,
      icon: ClipboardDocumentListIcon,
      color: "bg-yellow-500",
    },
    {
      name: "Pending Makeups",
      value: pendingMakeupsCount,
      icon: ClockIcon,
      color: "bg-red-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="w-full h-96 mb-12 mt-5" />
          <Skeleton className="w-full h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    toast.error(error);
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
        {/* Avatar / Initials */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 text-white text-base font-semibold">
          {teacher?.name
            ? teacher.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
            : name
                ?.split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900">
            Teacher Dashboard
          </h1>

          <p className="mt-1 text-xs text-gray-500 flex items-center gap-3">
            {teacher?.zoom_link ? (
              <Link
                to={teacher.zoom_link}
                onClick={(e) => {
                  e.preventDefault();
                  try {
                    window.open(
                      teacher.zoom_link,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  } catch {
                    // fallback to router navigation
                    window.location.href = teacher.zoom_link;
                  }
                }}
                className="inline-flex items-center gap-2 px-3 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100"
              >
                <LinkIcon className="w-4 h-4" />
                Join Zoom
              </Link>
            ) : (
              <span className="text-xs text-slate-400">
                Zoom link: ...Pending
              </span>
            )}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Teacher</div>
          <div className="text-base font-medium text-slate-900">
            {teacher?.name || name}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.name}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
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

      <div className="flex flex-col-reverse lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-lg shadow-lg p-4 max-h-[70vh] overflow-auto">
            <CustomCalendar
              data={data?.dashboard}
              config={dateConfig}
              onDateSelect={() => console.log("TEST")}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-lg p-4 max-h-[70vh] overflow-auto">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Legend
            </h2>
            <CalendarLegend config={dateConfig} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
