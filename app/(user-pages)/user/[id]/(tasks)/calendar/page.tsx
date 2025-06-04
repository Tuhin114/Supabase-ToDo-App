"use client";

import React, { useEffect, useState } from "react";
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
import { useTasks } from "@/hooks/task/useTasks";
import { getUserDetails } from "@/hooks/user/getUserDetails";

// Sample tasks data with hardcoded times
const sampletasks: Task[] = sampleTasks;
export type TaskUpdateInput = FormData | { taskId: string; time: TaskTime };
export function isFormData(input: TaskUpdateInput): input is FormData {
  return typeof FormData !== "undefined" && input instanceof FormData;
}

export default function CalendarPage() {
  const { getId } = getUserDetails();
  const { data: userId } = getId;
  const { fetchTasks, createTask, updateTask, deleteTask } = useTasks(
    userId || ""
  );
  const { data: allTasks } = fetchTasks;
  const [tasks, setTasks] = useState<Task[]>(allTasks || []);

  useEffect(() => {
    if (allTasks) {
      setTasks(allTasks);
    }
  }, [allTasks]);

  return (
    <div className="px-6 py-4">
      <EventCalendar
        events={tasks}
        onEventAdd={createTask.mutate}
        onEventUpdate={updateTask.mutate}
        onEventDelete={deleteTask.mutate}
      />
    </div>
  );
}
