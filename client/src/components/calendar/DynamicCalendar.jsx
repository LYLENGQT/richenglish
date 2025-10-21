import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DynamicCalendar({ dates, size = "md", className }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredId, setHoveredId] = useState(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfWeek = monthStart.getDay();
  const paddingDays = Array(firstDayOfWeek).fill(null);

  const findDateItem = (day) => {
    return dates.find((item) => isSameDay(item.date, day)) || null;
  };

  const handleDateClick = (day) => {
    const item = findDateItem(day);
    if (item && item.onClick) {
      item.onClick(item.id, day);
    }
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const sizeConfig = {
    sm: {
      container: "w-64",
      header: "text-sm",
      dayHeader: "text-xs",
      dayCell: "h-8 text-xs",
      navButton: "h-8 w-8",
    },
    md: {
      container: "w-80",
      header: "text-base",
      dayHeader: "text-sm",
      dayCell: "h-10 text-sm",
      navButton: "h-10 w-10",
    },
    lg: {
      container: "w-96",
      header: "text-lg",
      dayHeader: "text-base",
      dayCell: "h-12 text-base",
      navButton: "h-12 w-12",
    },
    full: {
      container: "w-full",
      header: "text-2xl",
      dayHeader: "text-lg",
      dayCell: "h-16 text-lg",
      navButton: "h-12 w-12",
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-4 shadow-sm",
        config.container,
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className={cn("font-semibold text-gray-900", config.header)}>
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={handlePrevMonth}
            className={cn(
              "rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center",
              config.navButton
            )}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className={cn(
              "rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center",
              config.navButton
            )}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className={cn(
              "text-center font-medium text-gray-500",
              config.dayHeader
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {paddingDays.map((_, index) => (
          <div key={`padding-${index}`} className={cn(config.dayCell)} />
        ))}

        {daysInMonth.map((day) => {
          const dateItem = findDateItem(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isHovered = hoveredId === dateItem?.id;

          const dateStyle =
            dateItem?.style ||
            (dateItem
              ? {
                  backgroundColor: "#3b82f6",
                  color: "white",
                }
              : undefined);

          return (
            <div key={day.toISOString()} className="relative">
              <button
                onClick={() => handleDateClick(day)}
                onMouseEnter={() => {
                  if (dateItem) {
                    setHoveredId(dateItem.id);
                  }
                }}
                onMouseLeave={() => {
                  setHoveredId(null);
                }}
                className={cn(
                  "w-full rounded-md transition-colors font-medium flex items-center justify-center",
                  config.dayCell,
                  isCurrentMonth
                    ? "text-gray-900 hover:bg-gray-100 cursor-pointer"
                    : "text-gray-400 opacity-50 cursor-not-allowed",
                  !dateItem && "opacity-30"
                )}
                style={dateStyle}
                disabled={!isCurrentMonth || !dateItem}
                title={dateItem ? `${dateItem.type} (${dateItem.id})` : ""}
              >
                {format(day, "d")}
              </button>

              {isHovered && dateItem && dateItem.onHover && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-2 whitespace-nowrap">
                  {dateItem.onHover(dateItem.id)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
