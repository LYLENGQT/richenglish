import React from "react";
import { useQuery } from "@tanstack/react-query";
import { classesQuery } from "../../lib/reaactquery/teacher";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { DynamicCalendar } from "@/components/calendar/DynamicCalendar";
import useFormatClass from "@/hook/useFormatClass";

const Classes = () => {
  const { data, isLoading, error } = useQuery({
    ...classesQuery(),
  });

  const classes = useFormatClass(
    data,
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
      <div className="bg-white rounded-lg shadow p-4 w-fit h-fit">
        <DynamicCalendar dates={classes} size="lg" />
      </div>
    </div>
  );
};

export default Classes;
