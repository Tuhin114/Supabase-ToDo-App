"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TimingFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const timeRanges = ["tomorrow", "this-week", "this-month", "this-year"];

export default function TimingFilter({ value, onChange }: TimingFilterProps) {
  return (
    <div className="flex flex-col gap-4 ml- sm:flex-row sm:items-center sm:justify-between">
      {/* Mobile View Select */}
      <div className="sm:hidden w-full">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            className="w-full border-muted text-muted-foreground"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map((range) => (
              <SelectItem key={range} value={range}>
                {range
                  .replace("this-", "This ")
                  .replace("tomorrow", "Tomorrow")
                  .replace("-", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Tabs */}
      <Tabs value={value} onValueChange={onChange} className="hidden sm:block">
        <TabsList className="bg-muted rounded-md shadow-sm p-1 h-11">
          {timeRanges.map((range) => (
            <TabsTrigger
              key={range}
              value={range}
              className="gap-1 text-base px-4 py-2 font-medium"
            >
              {range
                .replace("this-", "This ")
                .replace("tomorrow", "Tomorrow")
                .replace("-", " ")}
              {/* <Badge
                variant="secondary"
                className="min-w-[20px] px-1.5 h-5 ml-1 flex items-center justify-center rounded-full bg-muted-foreground/30 text-xs font-medium"
              >
                {taskCounts[range] ?? 0}
              </Badge> */}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
