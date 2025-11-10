import React from "react";
import { classesQuery } from "../../lib/reaactquery/teacher";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { DynamicCalendar } from "@/components/calendar/DynamicCalendar";
import useFormatClass from "@/hook/useFormatClass";
import useAuthStore from "@/lib/zustand/authStore";
import DashboardHeader from "@/components/DashboardHeader";

const Classes = () => {
  const { data, isLoading, error } = useQuery(classesQuery());
  const navigate = useNavigate();
  const { name, role } = useAuthStore();

  if (error) {
    toast.error("Failed to load classes");
  }

  const classes = useFormatClass(
    data,
    { backgroundColor: "#22c55e", color: "white" },
    (id) => navigate(`/portal/teacher/classes/${id}`),
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

  return (
    <div className="space-y-6 h-dvh">
      <div className="flex gap-3">
        <div className="bg-white rounded-lg shadow p-4 basis-[60%]">
          <DynamicCalendar dates={classes} size="full" />
        </div>

        <div className="bg-white rounded-lg shadow p-4 basis-[40%]">
          <h3 className="text-lg font-bold">Active Classes</h3>
          <div className="space-y-3 mt-3">
            {data?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between p-4 border rounded hover:bg-slate-100 transition-all cursor-pointer"
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
