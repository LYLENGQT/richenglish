import React, { useMemo } from "react";
import { parseTimeParts, formatToAmPm } from "@/utils/formatTime";

const useFormatDate = (
  dates = [],
  globalStyle = null,
  globalOnClick = null,
  globalOnHover = null
) => {
  return useMemo(() => {
    if (!Array.isArray(dates) || dates.length === 0) return [];

    return dates
      .map((s) => {
        if (!s) return null;

        // parse base date
        const base = s.date ? new Date(s.date) : null;
        if (!base || isNaN(base)) return null;

        // parse provided start/end times (accept start_time, startTime, end_time, endTime)
        const rawStart = s.start_time ?? s.startTime ?? null;
        const rawEnd = s.end_time ?? s.endTime ?? null;

        const startParts = parseTimeParts(rawStart);
        const endParts = parseTimeParts(rawEnd);

        // if start_time provided, set time on the date (local)
        let date = new Date(base);
        if (startParts) {
          date.setHours(startParts.h, startParts.m, startParts.s || 0, 0);
        }

        const id =
          s.id ||
          `${s.teacher_id || "unknown"}_${date.getFullYear()}${(
            date.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;

        const finalStyle = globalStyle ?? s.style ?? null;
        const finalOnClick = globalOnClick ?? s.onClick ?? null;
        const finalOnHover = globalOnHover ?? s.onHover ?? null;

        return {
          id,
          date,
          type: "schedule",
          // expose both raw values in meta and user-friendly formatted strings
          ...(startParts ? { startTime: formatToAmPm(startParts) } : {}),
          ...(endParts ? { endTime: formatToAmPm(endParts) } : {}),
          ...(finalStyle ? { style: finalStyle } : {}),
          ...(finalOnClick ? { onClick: finalOnClick } : {}),
          ...(finalOnHover ? { onHover: finalOnHover } : {}),
          meta: { ...s, rawStart: rawStart ?? null, rawEnd: rawEnd ?? null },
        };
      })
      .filter(Boolean);
  }, [dates, globalStyle, globalOnClick, globalOnHover]);
};

export default useFormatDate;
