"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/layout/page/DateRangePicker";
import { TaskSearch } from "@/components/layout/page/TaskSearch";
import TaskSheet from "@/components/task/TaskSheet";
import { TaskTable } from "@/components/task/TaskTable";

import { getUserDetails } from "@/hooks/user/getUserDetails";
import { useTasks } from "@/hooks/task/useTasks";
import { TaskStatus } from "@/types/Task";

export default function StatusPage() {
  const searchParams = useSearchParams();
  const hypenWithStatus = searchParams.get("status") as string;

  const status = (hypenWithStatus?.replace("-", "") as TaskStatus) || null;

  const { getId } = getUserDetails();
  const { data: userId } = getId;

  const { fetchTasks, createTask, updateTask, deleteTask, toggleComplete } =
    useTasks(userId || "");

  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const { data: allTasks, isLoading: allTasksLoading } = fetchTasks;

  const statusFilteredTasks = useMemo(() => {
    if (!allTasks) return [];
    if (!status) return allTasks;
    return allTasks.filter((task) => task.status === status);
  }, [allTasks, status]);

  const fullyFilteredTasks = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return statusFilteredTasks.filter((task) => {
      const start = new Date(task.time.start);
      const end = new Date(task.time.end);

      if (dateRange.from && start < new Date(dateRange.from)) return false;
      if (dateRange.to && end > new Date(dateRange.to)) return false;
      if (search && !task.title.toLowerCase().includes(search)) return false;

      return true;
    });
  }, [statusFilteredTasks, dateRange, searchQuery]);

  const handleToggleComplete = (taskId: string) => {
    toggleComplete.mutate(taskId);
  };

  return (
    <>
      <Card className="bg-background border-none px-4 shadow-none">
        <CardHeader className="flex">
          <div className="flex items-center justify-between w-full gap-2">
            {/* Date range picker */}
            <DateRangePicker
              dateRange={dateRange}
              setDateRange={setDateRange}
            />

            {/* Search + Add Task */}
            <div className="flex items-center gap-2">
              <TaskSearch onSearch={setSearchQuery} />
              <Button onClick={() => setNewTaskOpen(true)}>Add Task</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <TaskTable
            tasks={fullyFilteredTasks}
            source="status"
            handleToggleComplete={handleToggleComplete}
            createNewTask={createTask.mutate}
            updateExistingTask={updateTask.mutate}
            deleteTask={deleteTask.mutate}
          />
        </CardContent>
      </Card>

      {newTaskOpen && (
        <TaskSheet
          task={null}
          startTime={new Date()}
          isOpen={newTaskOpen}
          setOpen={setNewTaskOpen}
          status={status}
          createNewTask={createTask.mutate}
          updateExistingTask={updateTask.mutate}
          deleteTask={deleteTask.mutate}
        />
      )}
    </>
  );
}
