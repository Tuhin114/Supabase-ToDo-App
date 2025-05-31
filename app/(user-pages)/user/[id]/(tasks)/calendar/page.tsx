"use client";

import { useState } from "react";
import EventCalendar from "@/components/layout/calendar/event/event-calendar";
import {
  Category,
  Subtask,
  Task,
  TaskColor,
  TaskPriority,
  TaskStatus,
  TaskTime,
} from "@/types/Task";
import { sampleTasks } from "@/constants/data";
import { FormState } from "@/components/task/TaskSheet";
import { parseFormData } from "@/utils/utils";

// Sample tasks data with hardcoded times
const sampletasks: Task[] = sampleTasks;
export type TaskUpdateInput = FormData | { taskId: string; time: TaskTime };
export function isFormData(input: TaskUpdateInput): input is FormData {
  return typeof FormData !== "undefined" && input instanceof FormData;
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>(sampletasks);

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
    <div className="px-6 py-4">
      <EventCalendar
        events={tasks}
        onEventAdd={createNewTask}
        onEventUpdate={updateExistingTask}
        onEventDelete={handleDeleteTask}
      />
    </div>
  );
}
