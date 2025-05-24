"use client";

import { DateRangePicker } from "@/components/layout/page/DateRangePicker";
import { PriorityFilter } from "@/components/layout/page/PriorityFilter";
import { StatusFilter } from "@/components/layout/page/StatusFilter";
import { TaskItem } from "@/components/task/TaskItem";
import { TaskTable } from "@/components/task/TaskTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/types/Task";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Research content ideas",
    status: "inprogress" as const,
    priority: "high",
    startDate: new Date("2024-01-20"),
    dueDate: new Date("2024-01-25"),
    timeAllocated: "2 days",
    tags: ["content", "research", "marketing"],
    category: "work",
    subtasks: [
      { id: "1a", title: "Analyze competitor content", completed: true },
      { id: "1b", title: "Create content calendar", completed: false },
    ],
  },
  {
    id: "2",
    title: "Create a database of guest authors",
    status: "todo",
    priority: "moderate",
    startDate: new Date("2024-01-22"),
    dueDate: new Date("2024-01-30"),
    timeAllocated: "3 days",
    tags: ["database", "outreach"],
    category: "work",
    subtasks: [],
  },
  {
    id: "3",
    title: "Renew driver's license",
    status: "waiting",
    priority: "high",
    startDate: new Date("2024-01-18"),
    dueDate: new Date("2024-01-22"),
    timeAllocated: "2 hrs",
    tags: ["documents", "urgent"],
    category: "personal",
    subtasks: [
      { id: "3a", title: "Gather required documents", completed: true },
      { id: "3b", title: "Book appointment", completed: false },
    ],
  },
  {
    id: "4",
    title: "Consult accountant",
    status: "done",
    priority: "moderate",
    startDate: new Date("2024-01-15"),
    dueDate: new Date("2024-01-20"),
    timeAllocated: "1 hr",
    tags: ["finance", "tax"],
    category: "personal",
    subtasks: [],
  },
  {
    id: "5",
    title: "Print business card",
    status: "stuck",
    priority: "low",
    startDate: new Date("2024-01-10"),
    dueDate: new Date("2024-01-25"),
    timeAllocated: "30 mins",
    tags: ["design", "printing"],
    category: "work",
    subtasks: [],
  },
];

export default function TodayPage() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed, status: "done" } : t
      )
    );
  };

  return (
    <Card className="bg-background border-none px-4">
      <CardHeader className="flex">
        <div className="flex items-center justify-between gap-2">
          <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />

          <div className="flex items-center gap-2">
            <PriorityFilter
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
            />
            <StatusFilter
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
            <Button variant="secondary">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="">
        <TaskTable tasks={tasks} onToggleComplete={handleToggleComplete} />
      </CardContent>
    </Card>
  );
}
