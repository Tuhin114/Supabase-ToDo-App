"use client";

import { DateRangePicker } from "@/components/layout/page/DateRangePicker";
import { PriorityFilter } from "@/components/layout/page/PriorityFilter";
import { StatusFilter } from "@/components/layout/page/StatusFilter";
import TaskSheet, { FormState } from "@/components/task/TaskSheet";
import { TaskTable } from "@/components/task/TaskTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { sampleTasks } from "@/constants/data";
import {
  Category,
  Subtask,
  Task,
  TaskColor,
  TaskPriority,
  TaskStatus,
  TaskTime,
} from "@/types/Task";
import { parseFormData } from "@/utils/utils";
import { stat } from "fs";
import { PlusIcon } from "lucide-react";
import { parse } from "path";
import { useState } from "react";

type TaskUpdateInput = FormData | { taskId: string; time: TaskTime };
export function isFormData(input: TaskUpdateInput): input is FormData {
  return typeof FormData !== "undefined" && input instanceof FormData;
}
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

  const createNewTask = async (formData: FormData): Promise<FormState> => {
    try {
      const payload = parseFormData(formData);

      const newTask: Task = {
        id: crypto.randomUUID(),
        title: payload.title,
        description: payload.description,
        status: payload.status as TaskStatus,
        priority: payload.priority as TaskPriority,
        time: payload.time,
        category: payload.category as Category,
        tags: payload.tags as string[],
        subtasks: payload.subtasks as Subtask[],
        color: payload.color as TaskColor,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTasks((prev) => [newTask, ...prev]);
      setNewTaskOpen(false);

      return {
        message: "Task created successfully.",
        task: newTask,
        isUpdate: false,
      };
    } catch (err: any) {
      console.error("[Error in createNewTask]:", err);
      return { error: "Failed to create task. Please try again." };
    }
  };

  const updateExistingTask = async (
    input: TaskUpdateInput
  ): Promise<FormState> => {
    try {
      let payload: any;

      if (isFormData(input)) {
        // Handle full form update
        payload = parseFormData(input);
      } else {
        // Handle time-only update
        payload = {
          taskId: input.taskId,
          time: input.time,
        };
      }

      const taskId = payload.taskId as string;
      const existingTask = tasks.find((t) => t.id === taskId);

      if (!existingTask) {
        return { error: "Task not found for update." };
      }

      const updatedTask: Task = {
        ...existingTask,
        ...(isFormData(input) && {
          title: payload.title,
          description: payload.description,
          status: payload.status as Task["status"],
          priority: payload.priority as Task["priority"],
          category: payload.category as Category,
          tags: payload.tags as string[],
          subtasks: payload.subtasks as Subtask[],
          color: payload.color as TaskColor,
        }),
        time: payload.time || existingTask.time,
        updatedAt: new Date(),
      };

      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
      setNewTaskOpen(false);

      return {
        message: isFormData(input)
          ? "Task updated successfully."
          : "Task time updated.",
        task: updatedTask,
        isUpdate: true,
      };
    } catch (err: any) {
      console.error("[Error in updateExistingTask]:", err);
      return { error: "Failed to update task. Please try again." };
    }
  };

  const handleToggleComplete = (taskId: string) => {
    console.log("[Toggle Complete] Task ID:", taskId);
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          console.log("[Toggling Task] Before:", t);
          const updated = {
            ...t,
            completed: !t.completed,
            updatedAt: new Date(),
          };
          console.log("[Toggling Task] After:", updated);
          return updated;
        }
        return t;
      })
    );
  };

  const handleSaveTask = async (formData: FormData): Promise<FormState> => {
    const isUpdate = formData.has("taskId");
    return isUpdate ? updateExistingTask(formData) : createNewTask(formData);
  };

  const handleDeleteTask = async (taskId: string): Promise<FormState> => {
    try {
      console.log("[Deleting Task] ID:", taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));

      return { message: "Task deleted successfully." };
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
          startTime={new Date()}
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
