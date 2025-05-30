import { memo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
type TaskStatus =
  | "todo"
  | "inprogress"
  | "inreview"
  | "done"
  | "waiting"
  | "onhold"
  | "stuck";
type TaskPriority = "high" | "moderate" | "low";

interface SelectOption<T> {
  value: T;
  label: string;
}

interface StatusPrioritySelectsProps {
  defaultStatus?: TaskStatus;
  defaultPriority?: TaskPriority;
  disabled?: boolean;
  className?: string;
  onStatusChange?: (status: TaskStatus) => void;
  onPriorityChange?: (priority: TaskPriority) => void;
}

// Static options - no memo needed for constants
const STATUS_OPTIONS: ReadonlyArray<SelectOption<TaskStatus>> = [
  { value: "todo", label: "To Do" },
  { value: "inprogress", label: "In Progress" },
  { value: "inreview", label: "In Review" },
  { value: "done", label: "Done" },
  { value: "waiting", label: "Waiting" },
  { value: "onhold", label: "On Hold" },
  { value: "stuck", label: "Stuck" },
] as const;

const PRIORITY_OPTIONS: ReadonlyArray<SelectOption<TaskPriority>> = [
  { value: "high", label: "High" },
  { value: "moderate", label: "Moderate" },
  { value: "low", label: "Low" },
] as const;

// Main component - only memo if parent re-renders frequently with same props
export const TaskStatusPrioritySelects = memo<StatusPrioritySelectsProps>(
  ({
    defaultStatus = "todo",
    defaultPriority = "moderate",
    disabled = false,
    className = "grid grid-cols-2 gap-4 my-4",
    onStatusChange,
    onPriorityChange,
  }) => {
    return (
      <div className={className}>
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            name="status"
            defaultValue={defaultStatus}
            disabled={disabled}
            onValueChange={onStatusChange}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="priority">Priority</Label>
          <Select
            name="priority"
            defaultValue={defaultPriority}
            disabled={disabled}
            onValueChange={onPriorityChange}
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((option) => (
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
);

TaskStatusPrioritySelects.displayName = "TaskStatusPrioritySelects";
