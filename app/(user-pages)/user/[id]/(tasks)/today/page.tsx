"use client";

import { DateRangePicker } from "@/components/layout/page/DateRangePicker";
import { PriorityFilter } from "@/components/layout/page/PriorityFilter";
import { StatusFilter } from "@/components/layout/page/StatusFilter";
import TaskSheet from "@/components/task/TaskSheet";
import { TaskTable } from "@/components/task/TaskTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { sampleTasks } from "@/constants/data";
import { Category, Subtask, Task, TaskColor, TaskTime } from "@/types/Task";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

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
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  const handleToggleComplete = (taskId: string) => {
    console.log("[Toggle Complete] Task ID:", taskId);
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          console.log("[Toggling Task] Before:", t);
          const updated = { ...t, completed: !t.completed };
          console.log("[Toggling Task] After:", updated);
          return updated;
        }
        return t;
      })
    );
  };

  const handleSaveTask = async (
    formData: FormData
  ): Promise<{ error?: string }> => {
    try {
      const payload: any = {};
      formData.forEach((value, key) => {
        if (
          (key === "tags" || key === "subtasks") &&
          typeof value === "string"
        ) {
          payload[key] = JSON.parse(value);
        } else if (key === "allDay") {
          payload[key] = value === "true";
        } else {
          payload[key] = value;
        }
      });

      // Handle time data - convert ISO strings back to Date objects
      const timeStart = formData.get("timeStart") as string;
      const timeEnd = formData.get("timeEnd") as string;

      payload.time = {
        timeEstimate: formData.get("timeEstimate") as string,
        start: timeStart ? new Date(timeStart) : new Date(),
        end: timeEnd ? new Date(timeEnd) : new Date(Date.now() + 3600_000),
        allDay: formData.get("allDay") === "true",
      };

      // Remove time-related fields from top-level payload
      delete payload.timeStart;
      delete payload.timeEnd;
      delete payload.timeEstimate;
      delete payload.allDay;

      console.log("[handleSaveTask] Payload from form:", payload);

      const isUpdate = formData.has("taskId");

      const timeValue = payload.time as TaskTime;
      if (!timeValue) {
        console.warn("[handleSaveTask] Missing time field in payload.");
      }

      if (isUpdate) {
        const id = payload.taskId as string;
        console.log("[Updating Task] ID:", id);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === id
              ? {
                  ...t,
                  title: payload.title,
                  description: payload.description,
                  status: payload.status as Task["status"],
                  priority: payload.priority as Task["priority"],
                  time: timeValue || t.time,
                  category: payload.category as Category,
                  tags: payload.tags as string[],
                  subtasks: payload.subtasks as Subtask[],
                  color: payload.color as TaskColor,
                }
              : t
          )
        );
      } else {
        const newTask: Task = {
          id: crypto.randomUUID(),
          title: payload.title,
          description: payload.description,
          status: payload.status as Task["status"],
          priority: payload.priority as Task["priority"],
          time: timeValue || {
            start: new Date(),
            end: new Date(Date.now() + 3600_000),
            timeEstimate: "1 hr",
            allDay: false,
          },
          category: payload.category as Category,
          tags: payload.tags as string[],
          subtasks: payload.subtasks as Subtask[],
          color: payload.color as TaskColor,
          completed: false,
          createdAt: new Date(payload.createdAt),
          updatedAt: new Date(payload.updatedAt),
        };

        console.log("[Creating New Task]", newTask);
        setTasks((prev) => [newTask, ...prev]);
      }

      // Close the appropriate sheet
      setNewTaskOpen(false);

      return { error: "Task saved successfully!" };
    } catch (err: any) {
      console.error("[Error in handleSaveTask]:", err);
      return { error: "Failed to save task. Please try again." };
    }
  };

  const handleDeleteTask = async (
    taskId: string
  ): Promise<{ error?: string }> => {
    try {
      console.log("[Deleting Task] ID:", taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setNewTaskOpen(false);
      return {};
    } catch (err) {
      console.error("[Error in handleDeleteTask]:", err);
      return { error: "Failed to delete task. Please try again." };
    }
  };

  return (
    <>
      <Card className="bg-background border-none px-4 shadow-none">
        <CardHeader className="flex">
          <div className="flex items-center justify-between gap-2">
            <DateRangePicker
              dateRange={dateRange}
              setDateRange={setDateRange}
            />

            <div className="flex items-center gap-2">
              <PriorityFilter
                filterPriority={filterPriority}
                setFilterPriority={setFilterPriority}
              />
              <StatusFilter
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />
              <Button
                variant="secondary"
                onClick={() => {
                  setNewTaskOpen(true);
                }}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TaskTable
            tasks={tasks}
            handleSaveTask={handleSaveTask}
            handleDeleteTask={handleDeleteTask}
            handleToggleComplete={handleToggleComplete}
          />
        </CardContent>
      </Card>

      {/* New Task Sheet */}
      {newTaskOpen && (
        <TaskSheet
          task={null}
          isOpen={newTaskOpen}
          setOpen={setNewTaskOpen}
          categories={[{ id: "1", name: "Category 1" }]}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}
    </>
  );
}
