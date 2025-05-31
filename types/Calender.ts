export interface LocalTimeState {
  startDate: Date;
  endDate: Date | null;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  timeEstimate: string;
}

export type CalendarView = "month" | "week" | "day" | "agenda";

export type EventColor =
  | "sky"
  | "amber"
  | "violet"
  | "rose"
  | "emerald"
  | "orange";
