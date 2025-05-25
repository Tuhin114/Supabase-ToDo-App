import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trash2, Edit, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { StatusBadge } from "../layout/task-badges/StatusBadge";
import { Task } from "@/types/Task";
import { PriorityBadge } from "../layout/task-badges/PriorityBadge";
import { CategoryBadge } from "../layout/task-badges/CategoryBadge";
import { TimeBadge } from "../layout/task-badges/TimeBadge";
import React from "react";
import { TaskBar } from "./TaskBar";

interface TaskTableProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
}

export const TaskTable = ({ tasks, onToggleComplete }: TaskTableProps) => {
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
          <TableRow className="">
            <TableHead className="w-12"></TableHead>
            <TableHead className="">Task</TableHead>
            <TableHead className="">Status</TableHead>
            <TableHead className="">Priority</TableHead>
            <TableHead className="">Category</TableHead>
            <TableHead className="">Time Estimate</TableHead>
            <TableHead className="">Time Left</TableHead>
            <TableHead className="">Subtasks</TableHead>
            <TableHead className="w-12 "></TableHead>
            <TableHead className="w-12 "></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <React.Fragment key={task.id}>
              <TableRow
                key={task.id}
                className={`border-sidebar-border transition-all duration-200  hover:bg-muted/10 ${
                  task.completed ? "opacity-50" : ""
                }`}
              >
                <TableCell>
                  <Checkbox
                    checked={task.completed || false}
                    onCheckedChange={() => onToggleComplete(task.id)}
                    className="border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="font-medium text-lg">{task.title}</div>
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
                  <TimeBadge time={task.timeAllocated} />
                </TableCell>
                <TableCell className="min-w-[120px]">
                  <span>2 days</span>
                </TableCell>
                <TableCell className="text-center min-w-[100px]">
                  <span>2</span>
                </TableCell>

                {/* <TableCell className="text-right pr-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="border-sidebar-border"
                    >
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {}}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell> */}

                <TableCell>
                  <TaskBar
                    task={task}
                    categories={[]}
                    onClose={() => {}}
                    onTaskUpdate={() => {}}
                    onAddCategory={() => {}}
                  />
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
