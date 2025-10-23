import React from "react";
import { classesQuery } from "../../lib/reaactquery/teacher";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { DynamicCalendar } from "@/components/calendar/DynamicCalendar";
import useFormatClass from "@/hook/useFormatClass";
import useAuthStore from "@/lib/zustand/authStore";

const Classes = () => {
  const { data, isLoading, error } = useQuery({
    ...classesQuery(),
  });

  const navigate = useNavigate();
  const { name, role } = useAuthStore();

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

  const classes = useFormatClass(
    data,
    { backgroundColor: "#22c55e", color: "white" },
    (id, date) => {
      navigate(`/portal/teacher/classes/${id}`);
    },
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

  console.log(classes);

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
    <div className="space-y-6 h-dvh">
      <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 text-white text-base font-semibold">
          {name
            ? name
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
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Teacher</div>
          <div className="text-base font-medium text-slate-900">
            {name || name}
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="bg-white rounded-lg shadow p-4 basis-[60%]">
          <DynamicCalendar dates={classes} size="full" />
        </div>
        <div className="bg-white rounded-lg shadow p-4 basis-[40%] ">
          <h3 className="text-lg font-bold">Active Classes</h3>
          <div className="space-y-3 mt-3">
            {data?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between p-4 border rounded hover:bg-slate-100 transition-all"
                onClick={() => navigate(`/portal/teacher/classes/${item.id}`)}
              >
                <div>
                  <p className="font-semibold">Time</p>
                  <p>
                    {item.start_time} - {item.end_time}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Duration</p>
                  <p>{item.duration_minutes} mins</p>
                </div>
                <div>
                  <p className="font-semibold">Days</p>
                  <p>{item.days_of_week}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classes;
