/**
 * generateDatesFromDays(classes)
 * - classes: array of class records (shape shown in your prompt)
 * - returns: [{ id, date: Date, type: "classes", meta }]
 */
export function generateDatesFromDays(classes = []) {
  if (!Array.isArray(classes) || classes.length === 0) return [];

  const pad = (n) => (n < 10 ? "0" + n : "" + n);

  const dayMap = {
    su: 0,
    sun: 0,
    m: 1,
    mon: 1,
    t: 2,
    tu: 2,
    tue: 2,
    w: 3,
    wed: 3,
    th: 4,
    thu: 4,
    thur: 4,
    thurs: 4,
    f: 5,
    fri: 5,
    sa: 6,
    sat: 6,
  };

  const results = [];

  classes.forEach((cls) => {
    if (!cls || !cls.start_date || !cls.end_date) return;

    const startDate = new Date(cls.start_date);
    const endDate = new Date(cls.end_date);
    if (isNaN(startDate) || isNaN(endDate)) return;

    // parse days_of_week like "M,W,F" or "T,Th"
    const tokens = (cls.days_of_week || "")
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const weekdaySet = new Set(
      tokens
        .map((tok) => dayMap[tok])
        .filter((v) => v !== undefined && v !== null)
    );

    if (weekdaySet.size === 0) return;

    // parse start_time "HH:MM:SS"
    const [hh = "0", mm = "0", ss = "0"] = (cls.start_time || "00:00:00").split(
      ":"
    );

    // iterate days (use local dates)
    const iter = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const last = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

    for (let d = new Date(iter); d <= last; d.setDate(d.getDate() + 1)) {
      if (!weekdaySet.has(d.getDay())) continue;

      const occ = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        parseInt(hh, 10) || 0,
        parseInt(mm, 10) || 0,
        parseInt(ss, 10) || 0
      );

      const id = `${cls.id}_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(
        d.getDate()
      )}`;

      results.push({
        id,
        date: occ,
        type: "classes",
        meta: cls,
      });
    }
  });

  return results;
}
