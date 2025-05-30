export interface LocalTimeState {
  startDate: Date;
  endDate: Date | null;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  timeEstimate: string;
}
