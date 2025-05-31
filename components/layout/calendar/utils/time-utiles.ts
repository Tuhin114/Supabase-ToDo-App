import { TaskTime, TimeUnit } from "@/types/Task";
import { LocalTimeState } from "@/types/Calender";
import { format, isBefore, isSameDay, set } from "date-fns";
import { DEFAULT_TIME_UNIT, DEFAULT_TIME_VALUE } from "@/constants/constants";
import { timeUnitOptions } from "@/constants/data";

// Generate time options in 15-minute intervals
export const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const totalMinutes = i * 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const timeStr = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  return { value: timeStr, label: timeStr };
});

const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

const addOneHourToTime = (timeStr: string): string => {
  const minutes = timeToMinutes(timeStr) + 60;
  return minutesToTime(minutes);
};

const subtractOneHourFromTime = (timeStr: string): string => {
  const minutes = Math.max(0, timeToMinutes(timeStr) - 60);
  return minutesToTime(minutes);
};

// Initialize state from TaskTime Date objects
export const initializeTimeState = (time: TaskTime): LocalTimeState => {
  const startDate = time.start || new Date();
  const endDate = time.end || null;

  return {
    startDate,
    endDate,
    startTime: format(startDate, "HH:mm"),
    endTime: endDate ? format(endDate, "HH:mm") : format(startDate, "HH:mm"),
    isAllDay: time.allDay ?? false,
    timeEstimate: time.timeEstimate || "1 hrs",
  };
};

const createDateTime = (
  date: Date,
  timeStr?: string,
  allDay?: boolean
): Date => {
  if (allDay || !timeStr) {
    // For all-day events, set to noon to avoid timezone issues
    return set(date, { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 });
  }

  const [hours, minutes] = timeStr.split(":").map(Number);
  return set(date, { hours, minutes, seconds: 0, milliseconds: 0 });
};

// Validation logic for time conflicts
export const validateAndAdjustTimes = (
  startDate: Date,
  endDate: Date | null,
  startTime: string,
  endTime: string,
  changedField: "startDate" | "endDate" | "startTime" | "endTime"
) => {
  let adjustedStartDate = startDate;
  let adjustedEndDate = endDate || startDate;
  let adjustedStartTime = startTime;
  let adjustedEndTime = endTime;

  const isEndBeforeStart = isBefore(adjustedEndDate, adjustedStartDate);
  const isSameDate = isSameDay(adjustedStartDate, adjustedEndDate);
  const startMinutes = timeToMinutes(adjustedStartTime);
  const endMinutes = timeToMinutes(adjustedEndTime);

  switch (changedField) {
    case "startDate":
      if (isEndBeforeStart) {
        adjustedEndDate = adjustedStartDate;
        adjustedEndTime = addOneHourToTime(adjustedStartTime);
      } else if (isSameDate && startMinutes >= endMinutes) {
        adjustedEndTime = addOneHourToTime(adjustedStartTime);
      }
      break;

    case "endDate":
      if (isEndBeforeStart) {
        adjustedStartDate = adjustedEndDate;
        adjustedStartTime = subtractOneHourFromTime(adjustedEndTime);
      } else if (isSameDate && endMinutes <= startMinutes) {
        adjustedStartTime = subtractOneHourFromTime(adjustedEndTime);
      }
      break;

    case "startTime":
      if (isSameDate && startMinutes >= endMinutes) {
        adjustedEndTime = addOneHourToTime(adjustedStartTime);
      }
      break;

    case "endTime":
      if (isSameDate && endMinutes <= startMinutes) {
        adjustedStartTime = subtractOneHourFromTime(adjustedEndTime);
      }
      break;
  }

  return {
    adjustedStartDate,
    adjustedEndDate,
    adjustedStartTime,
    adjustedEndTime,
  };
};

// Convert LocalTimeState to TaskTime
export const convertToTaskTime = (localState: LocalTimeState): TaskTime => {
  const { startDate, endDate, startTime, endTime, isAllDay, timeEstimate } =
    localState;

  return {
    start: createDateTime(startDate, startTime, isAllDay),
    end: endDate
      ? createDateTime(endDate, endTime, isAllDay)
      : createDateTime(startDate, startTime, isAllDay),
    allDay: isAllDay,
    timeEstimate,
  };
};

interface ParsedTime {
  value: string;
  unit: TimeUnit;
}

export function parseTime(time: string, min: number, max: number): ParsedTime {
  const trimmedTime = time.trim();
  console.log("trimmedTime", trimmedTime);

  if (!trimmedTime) {
    return { value: DEFAULT_TIME_VALUE, unit: DEFAULT_TIME_UNIT };
  }

  const parts = trimmedTime.split(/\s+/);

  if (parts.length < 2) {
    return { value: DEFAULT_TIME_VALUE, unit: DEFAULT_TIME_UNIT };
  }

  const [valuePart, unitPart] = parts;

  // Validate value part
  const numericValue = Number(valuePart);
  const validValue =
    !isNaN(numericValue) && numericValue >= min && numericValue <= max
      ? valuePart
      : DEFAULT_TIME_VALUE;

  // Validate unit part
  const validUnit =
    (timeUnitOptions.find((option) => option.value === unitPart)
      ?.value as TimeUnit) || DEFAULT_TIME_UNIT;

  console.log("Validated Time", validUnit, validValue);

  return { value: validValue, unit: validUnit };
}
