// utils/transformCalendarEvents.js

const dayMap = {
  Sun: 0,
  M: 1,
  T: 2,
  W: 3,
  Th: 4,
  F: 5,
  Sat: 6,
};

const generateRecurringActiveClasses = (activeClasses) => {
  if (!activeClasses) return [];

  const today = new Date();
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(today.getMonth() + 3);

  const events = [];

  activeClasses.forEach((item) => {
    const startDate = new Date(item.start_date);
    const endDate = new Date(item.end_date);
    const classEnd = endDate < threeMonthsLater ? endDate : threeMonthsLater;

    // Start from today or class start date — whichever is later
    let currentDate = new Date(Math.max(today, startDate));
    const days = item.days_of_week.split(",").map((d) => d.trim());

    while (currentDate <= classEnd) {
      const dayName = Object.keys(dayMap).find(
        (key) => dayMap[key] === currentDate.getDay()
      );

      if (days.includes(dayName)) {
        events.push({
          id: `${item.id}-${currentDate.toISOString().split("T")[0]}`,
          date: new Date(currentDate),
          type: "Active Class",
          style: { backgroundColor: "#8b5cf6", color: "white" },
          onClick: (id, date) =>
            console.log(`Active class clicked: ${id} starting ${date}`),
          onHover: () => (
            <div className="text-xs">
              <p className="font-semibold">Active Class</p>
              <p>{item.days_of_week}</p>
              <p>
                {item.start_time} - {item.end_time}
              </p>
            </div>
          ),
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return events;
};

export const transformCalendarEvents = (dashboard) => {
  if (!dashboard) return [];

  return [
    // Scheduled classes
    ...(dashboard.schedule?.map((item) => ({
      date: new Date(item.date),
      id: item.id,
      type: "Scheduled Class",
      style: { backgroundColor: "#3b82f6", color: "white" },
      onClick: (id, date) =>
        console.log(`Scheduled Class clicked: ${id} on ${date}`),
      onHover: () => (
        <div className="text-xs">
          <p className="font-semibold">Scheduled Class</p>
          <p>
            {item.start_time} - {item.end_time}
          </p>
          <p>Status: {item.status}</p>
        </div>
      ),
    })) || []),

    // Today attendance
    ...(dashboard.todayAttendance?.map((item) => ({
      date: new Date(item.date),
      id: item.id,
      type: "Today Class",
      style: { backgroundColor: "#10b981", color: "white" },
      onClick: (id, date) =>
        console.log(`Today Class clicked: ${id} on ${date}`),
      onHover: () => (
        <div className="text-xs">
          <p className="font-semibold">Today Class</p>
          <p>
            {item.start_time} - {item.end_time}
          </p>
        </div>
      ),
    })) || []),

    // Pending makeups
    ...(dashboard.pendingMakeups?.map((item) => ({
      date: new Date(item.makeup_date),
      id: item.id,
      type: "Makeup Class",
      style: { backgroundColor: "#f59e0b", color: "white" },
      onClick: (id, date) =>
        console.log(`Makeup Class clicked: ${id} on ${date}`),
      onHover: () => (
        <div className="text-xs">
          <p className="font-semibold">Makeup Class</p>
          <p>Reason: {item.reason}</p>
        </div>
      ),
    })) || []),

    // Recurring Active Classes (3 months forward)
    ...generateRecurringActiveClasses(dashboard.activeClass),
  ];
};
