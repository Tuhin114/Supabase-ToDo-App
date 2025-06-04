import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import React, { useState } from "react";

interface DateRangePickerProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
}

export const DateRangePicker = ({
  dateRange,
  setDateRange,
}: DateRangePickerProps) => {
  // To keep the calendar “focused” on the appropriate month whenever
  // dateRange.from changes, track a `controlledMonth` internally.
  // Start with today (or whatever you’d like as a default).
  const [controlledMonth, setControlledMonth] = useState<Date>(
    dateRange.from ?? new Date()
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          {dateRange.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} –{" "}
                {format(dateRange.to, "LLL dd, y")}
              </>
            ) : (
              format(dateRange.from, "LLL dd, y")
            )
          ) : (
            "Select Date Range"
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          // — Make it controlled:
          mode="range"
          selected={
            // React-Day-Picker expects a DateRange of shape { from?: Date; to?: Date }
            {
              from: dateRange.from ?? undefined,
              to: dateRange.to ?? undefined,
            }
          }
          onSelect={(range: DateRange | undefined) => {
            // 1) Update parent state
            setDateRange({
              from: range?.from,
              to: range?.to,
            });
            // 2) If they just picked a “from” date, focus the month on that
            if (range?.from) {
              setControlledMonth(range.from);
            }
          }}
          // Instead of defaultMonth, use `month={controlledMonth}`
          month={controlledMonth}
          onMonthChange={(newMonth: Date) => {
            setControlledMonth(newMonth);
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};
