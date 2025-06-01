import { useEffect, useState } from "react";
import { TimeUnit } from "@/types/Task";
import { timeUnitOptions } from "@/constants/data";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseTime } from "../calendar/utils/time-utiles";
import { DEFAULT_TIME_UNIT, DEFAULT_TIME_VALUE } from "@/constants/constants";

interface TimeEstimatedProps {
  time: string;
  setTime: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export default function TimeEstimated({
  time,
  setTime,
  min = 1,
  max = 999,
  step = 1,
  disabled = false,
}: TimeEstimatedProps) {
  const [timeValue, setTimeValue] = useState<string>(DEFAULT_TIME_VALUE);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(DEFAULT_TIME_UNIT);
  const [isInitializing, setIsInitializing] = useState(true);

  // Sync local state with parsed time when prop changes
  useEffect(() => {
    const parsed = parseTime(time, min, max);

    setTimeValue(parsed.value);
    setTimeUnit(parsed.unit);
  }, [time, min, max]);

  // Separate useEffect to handle initialization flag
  useEffect(() => {
    // Set initializing to false after the first render cycle completes
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [timeValue, timeUnit]); // Dependency on state values

  // Update time string
  function updateTime(newValue: string, newUnit: TimeUnit) {
    if (isInitializing) {
      return;
    }
    const formattedTime = `${newValue} ${newUnit}`;

    setTime(formattedTime);
  }

  // Handle input value changes with validation
  function handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (isInitializing) {
      return;
    }

    const newValue = e.target.value;

    // Allow empty input for better UX during typing
    if (newValue === "") {
      setTimeValue("");
      return;
    }

    const numericValue = Number(newValue);

    // Validate numeric input
    if (isNaN(numericValue)) {
      return;
    }

    // Clamp value within bounds
    const clampedValue = Math.max(min, Math.min(max, numericValue));
    const finalValue = clampedValue.toString();

    setTimeValue(finalValue);
    updateTime(finalValue, timeUnit);
  }

  // Handle input blur to ensure valid value
  function handleValueBlur() {
    if (isInitializing) return;

    if (timeValue === "" || isNaN(Number(timeValue))) {
      const fallbackValue = DEFAULT_TIME_VALUE;
      setTimeValue(fallbackValue);
      updateTime(fallbackValue, timeUnit);
    }
  }

  // Handle unit selection changes
  function handleUnitChange(value: TimeUnit) {
    if (isInitializing) return;

    setTimeUnit(value);
    const currentValue = timeValue || DEFAULT_TIME_VALUE;
    updateTime(currentValue, value);
  }

  // Handle key press events
  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    // disallow scientific notation chars
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
    // STOP Enter from submitting/resetting your tags
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="time-duration">Time Duration</Label>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Input
            id="time-duration"
            type="number"
            min={min}
            max={max}
            step={step}
            value={timeValue}
            onChange={handleValueChange}
            onBlur={handleValueBlur}
            onKeyDown={handleKeyPress}
            disabled={disabled}
            placeholder="Enter time"
            className="w-full"
            aria-describedby="time-duration-description"
          />
          <p
            id="time-duration-description"
            className="text-xs text-muted-foreground"
          >
            {min}-{max} {timeUnit}
          </p>
        </div>

        <Select
          value={timeUnit}
          onValueChange={handleUnitChange}
          disabled={disabled}
        >
          <SelectTrigger
            id="time-unit"
            className="w-full"
            aria-label="Time unit"
          >
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            {timeUnitOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
