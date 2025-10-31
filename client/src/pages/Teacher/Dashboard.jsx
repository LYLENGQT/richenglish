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
import { Link, useNavigate } from "react-router-dom";
import { DynamicCalendar } from "@/components/calendar/DynamicCalendar";
import useFormatClass from "@/hook/useFormatClass";
import useFormatDate from "@/hook/useFormatDate";
import DashboardHeader from "@/components/DashboardHeader";

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    ...dashboardQuery(),
  });
  const navigate = useNavigate();

  const { name } = useAuthStore();

  const classes = useFormatClass(
    data?.dashboard?.activeClass,
    { backgroundColor: "#22c55e", color: "white" },
    (id, date) => console.log(`Clicked ${id} on ${date.toLocaleDateString()}`),
    (data) => (
      <div className="text-xs">
        <p className="font-semibold">Class</p>
        {data.startTime && (
          <p className="text-muted-foreground">
            {data.startTime} - {data.endTime}
          </p>
        )}
      </div>
    )
  );
  const schedule = useFormatDate(
    data?.dashboard?.schedule,
    { backgroundColor: "#8b5cf6", color: "white" },
    (id, date) => console.log(`Clicked ${id} on ${date.toLocaleDateString()}`),
    (data) => (
      <div className="text-xs">
        <p className="font-semibold">Scheduled Class</p>
        {data.startTime && (
          <p className="text-muted-foreground">
            {data.startTime} - {data.endTime}
          </p>
        )}
      </div>
    )
  );

  const makeUpClass = useFormatDate(
    data?.dashboard?.pendingMakeups,
    { backgroundColor: "#ef4444", color: "white" },
    (id, date) => console.log(`Clicked ${id} on ${date.toLocaleDateString()}`),
    (data) => (
      <div className="text-xs">
        <p className="font-semibold">Make-up Class</p>
        {data.startTime && (
          <p className="text-muted-foreground">{data.startTime}</p>
        )}
      </div>
    )
  );

  const dashboard = data?.dashboard || {};
  const teacher = dashboard?.teacher || {};
  const totalStudents = dashboard?.students ?? 0;
  const activeClassesCount = Array.isArray(dashboard?.activeClass)
    ? dashboard.activeClass.filter((item) => item !== null).length
    : dashboard?.activeClass && dashboard.activeClass !== null
    ? 1
    : 0;

  const todayAttendanceCount = Array.isArray(dashboard?.todayAttendance)
    ? dashboard.todayAttendance.filter((item) => item !== null).length
    : dashboard?.todayAttendance && dashboard.todayAttendance !== null
    ? 1
    : 0;

  const pendingMakeupsCount = Array.isArray(dashboard?.pendingMakeups)
    ? dashboard.pendingMakeups.filter((item) => item !== null).length
    : dashboard?.pendingMakeups && dashboard.pendingMakeups !== null
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
    <div className="space-y-6 ">
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
          <div className="bg-white rounded-lg shadow-lg p-4 max-h-[70vh] overflow-auto"></div>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-lg p-4 max-h-[70vh] overflow-visible">
            <DynamicCalendar
              size="full"
              dates={[...makeUpClass, ...schedule, ...classes]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
