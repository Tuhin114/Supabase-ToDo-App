import { useState, useCallback, useMemo } from "react";
import { format, isBefore } from "date-fns";
import { RiCalendarLine } from "@remixicon/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TimeEstimated from "./TimeEstemated";
import { LocalTimeState } from "@/types/Calender";
import {
  convertToTaskTime,
  initializeTimeState,
  TIME_OPTIONS,
  validateAndAdjustTimes,
} from "../calendar/utils/time-utiles";
import type { TaskTime } from "@/types/Task";

interface TimeProps {
  defaultTime: TaskTime;
}

export function TaskTimePicker({ defaultTime }: TimeProps) {
  const initialState = useMemo(() => {
    const result = initializeTimeState(defaultTime);
    return result;
  }, [defaultTime]);

  const [localState, setLocalState] = useState<LocalTimeState>(initialState);

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Update local state with validation - KEEP this useCallback as it's passed to child components
  const updateStateWithValidation = useCallback(
    (
      updates: Partial<LocalTimeState>,
      changedField: "startDate" | "endDate" | "startTime" | "endTime"
    ) => {
      setLocalState((prev) => {
        const newState = { ...prev, ...updates };

        // Skip validation for all-day events
        if (newState.isAllDay) return newState;

        // Apply validation and auto-adjustment
        const validated = validateAndAdjustTimes(
          newState.startDate,
          newState.endDate,
          newState.startTime,
          newState.endTime,
          changedField
        );

        return {
          ...newState,
          startDate: validated.adjustedStartDate,
          endDate: validated.adjustedEndDate,
          startTime: validated.adjustedStartTime,
          endTime: validated.adjustedEndTime,
        };
      });
    },
    []
  );

  // Simple state update for non-time fields - REMOVE useCallback (not passed to children)
  function updateState(updates: Partial<LocalTimeState>) {
    setLocalState((prev) => {
      const newState = { ...prev, ...updates };
      return newState;
    });

    console.log("4. setLocalState called (but updater hasn't run yet)");
  }

  // Event handlers - REMOVE useCallback for handlers not passed to memoized children
  function handleStartDateSelect(date: Date | undefined) {
    if (!date) return;
    setStartDateOpen(false);
    updateStateWithValidation({ startDate: date }, "startDate");
  }

  function handleEndDateSelect(date: Date | undefined) {
    if (!date) return;
    setEndDateOpen(false);
    updateStateWithValidation({ endDate: date }, "endDate");
  }

  function handleStartTimeChange(timeStr: string) {
    updateStateWithValidation({ startTime: timeStr }, "startTime");
  }

  function handleEndTimeChange(timeStr: string) {
    updateStateWithValidation({ endTime: timeStr }, "endTime");
  }

  function handleAllDayChange(checked: boolean) {
    updateState({ isAllDay: checked });
  }

  // KEEP this useCallback since it's passed to TimeEstimated component
  const handleTimeEstimateChange = useCallback((estimate: string) => {
    updateState({ timeEstimate: estimate });
  }, []);

  // Date validation for end date - KEEP useCallback as it's passed to Calendar component
  const isEndDateDisabled = useCallback(
    (date: Date) => {
      return isBefore(date, localState.startDate);
    },
    [localState.startDate]
  );

  // Convert current state to TaskTime - KEEP useMemo as it prevents expensive recalculation
  const currentTaskTime = useMemo(
    () => convertToTaskTime(localState),
    [localState]
  );

  return (
    <>
      {/* Hidden form fields for form submission */}
      <input
        type="hidden"
        name="timeStart"
        value={currentTaskTime.start.toISOString()}
      />
      <input
        type="hidden"
        name="timeEnd"
        value={currentTaskTime.end.toISOString()}
      />
      <input
        type="hidden"
        name="timeEstimate"
        value={currentTaskTime.timeEstimate}
      />
      <input
        type="hidden"
        name="allDay"
        value={currentTaskTime.allDay?.toString() || "false"}
      />

      <TimeEstimated
        time={localState.timeEstimate}
        setTime={handleTimeEstimateChange}
      />

      <div className="flex gap-4">
        {/* Start Date */}
        <div className="flex-1 *:not-first:mt-1.5">
          <Label htmlFor="start-date" className="space-y-2">
            Start Date
          </Label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                  !localState.startDate && "text-muted-foreground"
                )}
                aria-label="Select start date"
              >
                <span>{format(localState.startDate, "PPP")}</span>
                <RiCalendarLine
                  size={16}
                  className="text-muted-foreground/80 shrink-0"
                  aria-hidden="true"
                />
              </Button>
            </PopoverTrigger>
            {startDateOpen && (
              <PopoverContent className="w-auto p-2" align="start">
                <Calendar
                  mode="single"
                  selected={localState.startDate}
                  defaultMonth={localState.startDate}
                  onSelect={handleStartDateSelect}
                  aria-label="Start date calendar"
                />
              </PopoverContent>
            )}
          </Popover>
        </div>

        {/* Start Time */}
        {!localState.isAllDay && (
          <div className="min-w-32 *:not-first:mt-1.5">
            <Label htmlFor="start-time">Start Time</Label>
            <Select
              value={localState.startTime}
              onValueChange={handleStartTimeChange}
            >
              <SelectTrigger id="start-time" aria-label="Select start time">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {TIME_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {/* End Date */}
        <div className="flex-1 *:not-first:mt-1.5">
          <Label htmlFor="end-date">End Date</Label>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                  !localState.endDate && "text-muted-foreground"
                )}
                aria-label="Select end date"
              >
                <span>
                  {localState.endDate
                    ? format(localState.endDate, "PPP")
                    : "Pick a date"}
                </span>
                <RiCalendarLine
                  size={16}
                  className="text-muted-foreground/80 shrink-0"
                  aria-hidden="true"
                />
              </Button>
            </PopoverTrigger>
            {endDateOpen && (
              <PopoverContent className="w-auto p-2" align="start">
                <Calendar
                  mode="single"
                  selected={localState.endDate || undefined}
                  defaultMonth={localState.endDate || localState.startDate}
                  disabled={isEndDateDisabled}
                  onSelect={handleEndDateSelect}
                  aria-label="End date calendar"
                />
              </PopoverContent>
            )}
          </Popover>
        </div>

        {/* End Time */}
        {!localState.isAllDay && (
          <div className="min-w-32 *:not-first:mt-1.5">
            <Label htmlFor="end-time">End Time</Label>
            <Select
              value={localState.endTime}
              onValueChange={handleEndTimeChange}
            >
              <SelectTrigger id="end-time" aria-label="Select end time">
                <SelectValue placeholder="Select end time" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {TIME_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* All Day Checkbox */}
      <div className="flex items-center gap-2 mt-2">
        <Checkbox
          id="all-day"
          checked={localState.isAllDay}
          onCheckedChange={handleAllDayChange}
          aria-describedby="all-day-description"
        />
        <Label htmlFor="all-day">All day</Label>
        <span id="all-day-description" className="sr-only">
          Toggle to make this an all-day event
        </span>
      </div>
    </>
  );
}
