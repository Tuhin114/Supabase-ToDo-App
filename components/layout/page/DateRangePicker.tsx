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
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          {dateRange.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} -{" "}
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
      <PopoverContent className="w-auto p-0 " align="start">
        <CalendarComponent
          initialFocus
          mode="range"
          defaultMonth={dateRange.from}
          selected={dateRange as DateRange}
          onSelect={(range: DateRange | undefined) => {
            setDateRange({
              from: range?.from,
              to: range?.to,
            });
          }}
          numberOfMonths={2}
          className=""
        />
      </PopoverContent>
    </Popover>
  );
};
