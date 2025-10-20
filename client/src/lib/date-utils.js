export function getDateType(date, data) {
  const dateStr = date.toISOString().split("T")[0];
  const dayOfWeek = ["U", "M", "T", "W", "Th", "F", "S"][date.getDay()];

  // Check for makeup sessions
  for (const makeup of data.pendingMakeups) {
    if (makeup.makeup_date.startsWith(dateStr)) {
      return "makeup";
    }
  }

  // Check for today's attendance
  for (const attendance of data.todayAttendance) {
    if (attendance.date.startsWith(dateStr)) {
      return "attendance";
    }
  }

  // Check for scheduled sessions
  for (const session of data.schedule) {
    if (session.date.startsWith(dateStr)) {
      return "schedule";
    }
  }

  // Check for active class days
  for (const activeClass of data.activeClass) {
    const classStart = new Date(activeClass.start_date);
    const classEnd = new Date(activeClass.end_date);

    if (date >= classStart && date <= classEnd) {
      const daysOfWeek = activeClass.days_of_week
        .split(",")
        .map((d) => d.trim());
      const dayMap = {
        M: "M",
        T: "T",
        W: "W",
        Th: "Th",
        F: "F",
        S: "S",
        U: "U",
      };

      if (daysOfWeek.includes(dayMap[dayOfWeek])) {
        return "class";
      }
    }
  }

  return null;
}

export function getDateColor(dateType) {
  const colors = {
    class: "bg-blue-100 text-blue-900 hover:bg-blue-200",
    schedule: "bg-purple-100 text-purple-900 hover:bg-purple-200",
    attendance: "bg-green-100 text-green-900 hover:bg-green-200",
    makeup: "bg-orange-100 text-orange-900 hover:bg-orange-200",
  };

  return dateType
    ? colors[dateType]
    : "bg-slate-50 text-slate-600 hover:bg-slate-100";
}
