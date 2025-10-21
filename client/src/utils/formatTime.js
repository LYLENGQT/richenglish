export const parseTimeParts = (time) => {
  if (!time) return null;
  const t = String(time).trim();
  const ampmMatch = t.match(/(am|pm)$/i);
  if (ampmMatch) {
    const ampm = ampmMatch[0].toLowerCase();
    const core = t.replace(/(am|pm)$/i, "").trim();
    const parts = core.split(":").map((p) => parseInt(p, 10) || 0);
    let h = parts[0] || 0;
    const m = parts[1] || 0;
    const s = parts[2] || 0;
    if (ampm === "pm" && h < 12) h += 12;
    if (ampm === "am" && h === 12) h = 0;
    return { h, m, s };
  }
  const parts = t.split(":").map((p) => parseInt(p, 10) || 0);
  return { h: parts[0] || 0, m: parts[1] || 0, s: parts[2] || 0 };
};

export const formatToAmPm = (time) => {
  if (!time) return null;
  const { h, m } = time;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = ((h + 11) % 12) + 1;
  const hh = String(hour12).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${hh}:${mm} ${period}`;
};
