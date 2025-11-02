import { DynamicCalendar } from "@/components/calendar/DynamicCalendar";
import React from "react";
import { addDays } from "date-fns";

const Schedules = () => {
  const today = new Date();

  const calendarDates = [
    // Scheduled Classes
    {
      id: "scheduled-1",
      date: today,
      type: "Scheduled Class",
      startTime: "08:00",
      endTime: "09:00",
      onClick: (id, date) => console.log(`Clicked ${id} on ${date}`),
      onHover: ({ id, startTime, endTime }) => (
        <div>{`Scheduled: ${startTime} - ${endTime}`}</div>
      ),
      style: { backgroundColor: "#3b82f6", color: "white" }, // blue
    },
    {
      id: "scheduled-2",
      date: addDays(today, 2),
      type: "Scheduled Class",
      startTime: "14:00",
      endTime: "15:30",
      onClick: (id, date) => console.log(`Clicked ${id} on ${date}`),
      onHover: ({ id, startTime, endTime }) => (
        <div>{`Scheduled: ${startTime} - ${endTime}`}</div>
      ),
      style: { backgroundColor: "#3b82f6", color: "white" },
    },

    // Makeup Classes
    {
      id: "makeup-1",
      date: addDays(today, 1),
      type: "Makeup Class",
      startTime: "10:00",
      endTime: "11:00",
      onClick: (id, date) => console.log(`Clicked ${id} on ${date}`),
      onHover: ({ id, startTime, endTime }) => (
        <div>{`Makeup: ${startTime} - ${endTime}`}</div>
      ),
      style: { backgroundColor: "#f59e0b", color: "white" }, // orange
    },
    {
      id: "makeup-2",
      date: addDays(today, 3),
      type: "Makeup Class",
      startTime: "16:00",
      endTime: "17:30",
      onClick: (id, date) => console.log(`Clicked ${id} on ${date}`),
      onHover: ({ id, startTime, endTime }) => (
        <div>{`Makeup: ${startTime} - ${endTime}`}</div>
      ),
      style: { backgroundColor: "#f59e0b", color: "white" },
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Admin - Schedules</h1>
      <DynamicCalendar dates={calendarDates} size="lg" />
    </div>
  );
};

export default Schedules;
