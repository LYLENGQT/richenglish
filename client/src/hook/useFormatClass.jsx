import React, { useMemo } from "react";
import { generateDatesFromDays } from "@/utils/generateClasses";
import { parseTimeParts, formatToAmPm } from "@/utils/formatTime";

const useFormatClass = (
  classes = [],
  globalStyle = null,
  globalOnClick = null,
  globalOnHover = null
) => {
  const formatted = useMemo(() => {
    if (!Array.isArray(classes) || classes.length === 0) return [];

    const occurrences = generateDatesFromDays(classes) || [];

    return occurrences
      .map((occ) => {
        const date =
          occ.date instanceof Date
            ? occ.date
            : occ.date
            ? new Date(occ.date)
            : null;

        const baseId =
          occ.id ||
          occ.class_id ||
          occ.classId ||
          (occ.meta && occ.meta.id) ||
          null;

        const dateKey = date
          ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
          : null;
        const id = baseId
          ? occ.instanceId
            ? `${baseId}_${dateKey}`
            : baseId
          : dateKey;

        // prefer global args, fallback to occurrence-specific handlers/style
        const finalStyle = globalStyle ?? occ.style ?? null;
        const finalOnClick = globalOnClick ?? occ.onClick ?? null;
        const finalOnHover = globalOnHover ?? occ.onHover ?? null;

        // handle start/end times from occ (accept start_time, startTime, end_time, endTime)
        // check both top-level and occ.meta (generateDatesFromDays may stash original record in meta)
        const rawStart =
          occ.start_time ??
          occ.startTime ??
          occ.meta?.start_time ??
          occ.meta?.startTime ??
          null;
        const rawEnd =
          occ.end_time ??
          occ.endTime ??
          occ.meta?.end_time ??
          occ.meta?.endTime ??
          null;
        const startParts = parseTimeParts(rawStart);
        const endParts = parseTimeParts(rawEnd);

        // if date present and startParts present, set time on date copy
        const eventDate = date ? new Date(date) : null;
        if (eventDate && startParts) {
          eventDate.setHours(startParts.h, startParts.m, startParts.s || 0, 0);
        }

        // build a normalized meta that always exposes start_time / end_time and raw values
        const originalMeta = occ.meta || occ;

        const normalizedMeta = {
          ...originalMeta,
          // ensure start_time/end_time are present on meta for callers expecting them
          start_time:
            rawStart ??
            originalMeta.start_time ??
            originalMeta.startTime ??
            null,
          end_time:
            rawEnd ?? originalMeta.end_time ?? originalMeta.endTime ?? null,
          rawStart: rawStart ?? null,
          rawEnd: rawEnd ?? null,
        };

        return {
          id,
          date: eventDate,
          type: occ.type || "classes",
          ...(startParts ? { startTime: formatToAmPm(startParts) } : {}),
          ...(endParts ? { endTime: formatToAmPm(endParts) } : {}),
          ...(finalStyle ? { style: finalStyle } : {}),
          ...(finalOnClick ? { onClick: finalOnClick } : {}),
          ...(finalOnHover ? { onHover: finalOnHover } : {}),
          meta: normalizedMeta,
        };
      })
      .filter((it) => it.date && it.id);
  }, [classes, globalStyle, globalOnClick, globalOnHover]);

  return formatted;
};

export default useFormatClass;
