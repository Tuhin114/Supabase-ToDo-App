import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "../layout/task-badges/StatusBadge";
import { Task, TaskTime } from "@/types/Task";
import { PriorityBadge } from "../layout/task-badges/PriorityBadge";
import { CategoryBadge } from "../layout/task-badges/CategoryBadge";
import { TimeBadge } from "../layout/task-badges/TimeBadge";
import React, { useState } from "react";
import TaskSheet from "./TaskSheet";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import { getTimeLeft } from "../layout/calendar/utils/time-utiles";
import { getTimeSpan } from "@/utils/utils";

interface TaskTableProps {
  tasks: Task[];
  source?: string;
  timeTab?: string;
  handleToggleComplete: (taskId: string) => void;
  createNewTask: (formData: FormData) => void;
  updateExistingTask: (formData: FormData) => void;
  deleteTask: (taskId: string) => void;
}

export const TaskTable = ({
  tasks,
  source,
  timeTab,
  createNewTask,
  updateExistingTask,
  deleteTask,
  handleToggleComplete,
}: TaskTableProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTaskOpen, setEditTaskOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setEditTaskOpen(true);
  };

  const getTaskTimeLeft = (task: Task): string => {
    const now = new Date();

    // Use end time if available
    if (task.time?.end) {
      return getTimeLeft(now, new Date(task.time.end));
    }

    return "No deadline set";
  };

  const getTaskTimeSpan = (time: TaskTime, tab: string) => {
    return getTimeSpan(time, tab);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center">
          <span className="text-3xl">📝</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">No tasks found</h3>
        <p>Add a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-sidebar-border overflow-hidden">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted">
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Time Estimate</TableHead>
            {source === "upcoming" ? (
              <TableHead>Time Span</TableHead>
            ) : (
              <TableHead>Time Left</TableHead>
            )}
            <TableHead>Subtasks</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, index) => {
            const timeEstimate = task.time?.timeEstimate;
            if (!task.time) {
              console.warn(`[Task ${index}] Missing 'time' field`, task);
            } else if (!timeEstimate) {
              console.warn(`[Task ${index}] Missing 'timeEstimate'`, task.time);
            }

            return (
              <TableRow
                key={task.id}
                className={`hover:bg-muted/10 transition ${
                  task.completed ? "opacity-50" : ""
                }`}
              >
                <TableCell>
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleComplete(task.id)}
                  />
                </TableCell>
                <TableCell>
                  <div
                    className="font-medium text-lg cursor-pointer"
                    onClick={() => handleTaskClick(task)}
                  >
                    {task.title}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={task.status} />
                </TableCell>
                <TableCell>
                  <PriorityBadge priority={task.priority} />
                </TableCell>
                <TableCell>
                  <CategoryBadge category={task.category} />
                </TableCell>
                <TableCell>
                  {timeEstimate ? (
                    <TimeBadge time={timeEstimate} />
                  ) : (
                    <span className="text-muted">1 hrs</span>
                  )}
                </TableCell>
                {source === "upcoming" ? (
                  <TableCell>
                    <span className="text-sm text-center">
                      {getTaskTimeSpan(task.time, timeTab as string)}
                    </span>
                  </TableCell>
                ) : (
                  <TableCell>
                    <span className="text-sm">{getTaskTimeLeft(task)}</span>
                  </TableCell>
                )}
                <TableCell className="text-center">
                  {task.subtasks?.length || 0}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                    onClick={() => handleTaskClick(task)}
                  >
                    <ChevronRight />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Edit Task Sheet */}

      {selectedTask && (
        <TaskSheet
          task={selectedTask}
          startTime={selectedTask.time?.start}
          createNewTask={createNewTask}
          updateExistingTask={updateExistingTask}
          deleteTask={deleteTask}
          isOpen={editTaskOpen}
          setOpen={setEditTaskOpen}
        />
      )}
    </div>
  );
};
