"use client";

import { DateRangePicker } from "@/components/layout/page/DateRangePicker";
import { PriorityFilter } from "@/components/layout/page/PriorityFilter";
import { StatusFilter } from "@/components/layout/page/StatusFilter";
import TaskSheet from "@/components/task/TaskSheet";
import { TaskTable } from "@/components/task/TaskTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTasks } from "@/hooks/task/useTasks";

import { Task, TaskTime } from "@/types/Task";
import { set } from "date-fns";

import React, { useEffect, useMemo, useState } from "react";

type TaskUpdateInput = FormData | { taskId: string; time: TaskTime };
export function isFormData(input: TaskUpdateInput): input is FormData {
  return typeof FormData !== "undefined" && input instanceof FormData;
}

export type FormState = {
  message?: string;
  task?: Task;
  isUpdate?: boolean;
  error?: string;
};

export default function TodayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const todayDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString();
  }, []);

  const { fetchTasks, createTask, updateTask, deleteTask, toggleComplete } =
    useTasks(id);
  const { data: allTasks, isLoading: allTasksLoading } = fetchTasks;
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [tasks, setTasks] = useState<Task[]>(allTasks || []);
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  useEffect(() => {
    if (allTasks) {
      const filteredTasks = allTasks.filter((task) => {
        if (task.time.end) {
          const taskEndDate = task.time.end;
          return taskEndDate >= todayDate;
        }
        return true;
      });
      setTasks(filteredTasks);
    }
  }, [allTasks]);

  const handleToggleComplete = (taskId: string) => {
    toggleComplete.mutate(taskId);
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
                onClick={() => {
                  setNewTaskOpen(true);
                }}
              >
                Add Task
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TaskTable
            tasks={tasks}
            handleToggleComplete={handleToggleComplete}
            createNewTask={createTask.mutate}
            updateExistingTask={updateTask.mutate}
            deleteTask={deleteTask.mutate}
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
          createNewTask={createTask.mutate}
          updateExistingTask={updateTask.mutate}
          deleteTask={deleteTask.mutate}
        />
      )}
    </>
  );
}
