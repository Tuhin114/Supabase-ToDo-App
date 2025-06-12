import {
  Category,
  Subtask,
  Task,
  TaskColor,
  TaskPriority,
  TaskStatus,
  TaskTime,
} from "@/types/Task";
import {
  format,
  isSameDay,
  isSameMonth,
  isSameYear,
  isEqual,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  isWithinInterval,
  parseISO,
  getWeekOfMonth,
  subMonths,
} from "date-fns";
import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function parseFormData(formData: FormData) {
  const getString = (key: string): string =>
    (formData.get(key) as string) || "";
  const getBoolean = (key: string): boolean => formData.get(key) === "true";
  const getJsonArray = <T>(key: string, fallback: T[] = []): T[] => {
    try {
      const value = formData.get(key) as string;
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  return {
    taskId: getString("taskId"), // For update identification
    title: getString("title"),
    description: getString("description"),
    status: getString("status") as TaskStatus,
    priority: getString("priority") as TaskPriority,
    category: {
      id: getString("categoryId"),
      name: getString("categoryName"),
    } as Category,
    color: getString("color") as TaskColor,
    tags: getJsonArray<string>("tags"),
    subtasks: getJsonArray<Subtask>("subtasks"),
    time: {
      start: new Date(getString("timeStart")),
      end: new Date(getString("timeEnd")),
      timeEstimate: getString("timeEstimate"),
      allDay: getBoolean("allDay"),
    } as TaskTime,
  };
}

export function filterTasksByTimeRange(tasks: Task[], range: string) {
  const now = new Date();
  let rangeStart: Date;
  let rangeEnd: Date;

  switch (range) {
    case "tomorrow":
      rangeStart = startOfDay(addDays(now, 1));
      rangeEnd = endOfDay(addDays(now, 1));
      break;
    case "this-week":
      rangeStart = startOfWeek(now, { weekStartsOn: 1 });
      rangeEnd = endOfWeek(now, { weekStartsOn: 1 });
      break;
    case "this-month":
      rangeStart = startOfMonth(now);
      rangeEnd = endOfMonth(now);
      break;
    case "this-year":
      rangeStart = startOfYear(now);
      rangeEnd = endOfYear(now);
      break;
    default:
      return tasks; // no filtering
  }

  return tasks.filter((task) => {
    const taskStart = new Date(task.time.start);
    const taskEnd = new Date(task.time.end);

    // Check if the time range (e.g., tomorrow) overlaps with the task's date range
    return (
      isWithinInterval(rangeStart, { start: taskStart, end: taskEnd }) ||
      isWithinInterval(rangeEnd, { start: taskStart, end: taskEnd }) ||
      isWithinInterval(taskStart, { start: rangeStart, end: rangeEnd }) ||
      isWithinInterval(taskEnd, { start: rangeStart, end: rangeEnd })
    );
  });
}

/**
 * Returns a display string representing the time span of a task
 * based on the selected time tab.
 */
// utils/getTimeSpan.ts

/**
 * Returns a formatted time span string based on the active time tab.
 *
 * @param time  — a TaskTime object ({ start, end, timeEstimate, allDay })
 * @param tab   — one of: "tomorrow" | "this-week" | "this-month" | "this-year"
 */
export function getTimeSpan(time: TaskTime, tab: string): string {
  // Ensure start/end are Date objects (in case you passed ISO strings).
  const start: Date =
    typeof time.start === "string" ? parseISO(time.start) : time.start;
  const end: Date =
    typeof time.end === "string" ? parseISO(time.end) : time.end;
  const allDay = time.allDay;

  if (tab === "tomorrow") {
    // Check if the task truly covers the whole day
    const isFullDay =
      allDay ||
      (isSameDay(start, end) &&
        isEqual(start, startOfDay(start)) &&
        isEqual(end, endOfDay(end)));

    if (isFullDay) {
      return "All Day";
    }

    // Otherwise show exact clock times
    return `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`;
  }

  if (tab === "this-week") {
    // If it’s a single‐day or all‐day task, show the full weekday name
    if (allDay || isSameDay(start, end)) {
      return format(start, "EEEE"); // e.g. "Wednesday"
    }
    // If it spans multiple days, show abbreviated weekdays with a hyphen
    const startAbbrev = format(start, "EEE"); // e.g. "Wed"
    const endAbbrev = format(end, "EEE"); // e.g. "Thu"
    return `${startAbbrev}-${endAbbrev}`;
  }

  if (tab === "this-month") {
    // Determine week‐of‐month for both start and end (week starts on Monday)
    const startWeek = getWeekOfMonth(start, { weekStartsOn: 1 });
    const endWeek = getWeekOfMonth(end, { weekStartsOn: 1 });

    if (startWeek === endWeek) {
      return `Week ${startWeek}`; // e.g. "Week 1"
    }
    return `Week ${startWeek} - Week ${endWeek}`; // e.g. "Week 1 - Week 2"
  }

  if (tab === "this-year") {
    // If same month, show full month name
    if (isSameMonth(start, end)) {
      return format(start, "MMMM"); // e.g. "January"
    }
    // Otherwise show abbreviated month span
    const startAbbrev = format(start, "MMM"); // e.g. "Jan"
    const endAbbrev = format(end, "MMM"); // e.g. "Feb"
    return `${startAbbrev}-${endAbbrev}`; // e.g. "Jan-Feb"
  }

  // If none of the above, return empty
  return "";
}

export function getRanges(range: string) {
  const now = new Date();
  if (range === "week") {
    const start = startOfWeek(now, { weekStartsOn: 1 });
    return Array.from({ length: 7 }).map((_, i) => ({
      start: startOfDay(addDays(start, i)),
      end: endOfDay(addDays(start, i)),
      label: format(addDays(start, i), "MMM d"),
    }));
  }
  if (range === "month") {
    const start = startOfMonth(now);
    // 4 weeks
    return Array.from({ length: 4 }).map((_, i) => {
      const wkStart = startOfWeek(addDays(start, i * 7), { weekStartsOn: 1 });
      const wkEnd = endOfDay(addDays(wkStart, 6));
      return {
        start: wkStart,
        end: wkEnd,
        label: `W${i + 1}`,
      };
    });
  }
  if (range === "year") {
    const res: any[] = [];
    for (let m = 0; m < 12; m++) {
      const d = subMonths(now, 11 - m);
      res.push({
        start: startOfMonth(d),
        end: endOfMonth(d),
        label: format(d, "MMM"),
      });
    }
    return res;
  }
  // default: entire span
  return [];
}

export function parseTimeEstimateToHours(input: string): number {
  if (!input) return 0;

  // Extract value and unit (e.g., "2 days" -> value=2, unit="days")
  const match = input
    .trim()
    .toLowerCase()
    .match(/^([\d.]+)\s*(mins?|hours?|hrs?|days?|weeks?|months?|yrs?|years?)$/);

  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2];

  switch (unit) {
    case "min":
    case "mins":
      return value / 60;
    case "hr":
    case "hrs":
    case "hour":
    case "hours":
      return value;
    case "day":
    case "days":
      return value * 24;
    case "week":
    case "weeks":
      return value * 24 * 7;
    case "month":
    case "months":
      return value * 24 * 30;
    case "yr":
    case "yrs":
    case "year":
    case "years":
      return value * 24 * 365;
    default:
      return 0;
  }
}
