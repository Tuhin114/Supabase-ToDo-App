"use client";

import { DateRangePicker } from "@/components/layout/page/DateRangePicker";
import { PriorityFilter } from "@/components/layout/page/PriorityFilter";
import { StatusFilter } from "@/components/layout/page/StatusFilter";
import TaskSheet from "@/components/task/TaskSheet";
import { TaskTable } from "@/components/task/TaskTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ToastAction } from "@/components/ui/toast";
import { useTasks } from "@/hooks/task/useTasks";
import { useToast } from "@/hooks/use-toast";
import { getUserDetails } from "@/hooks/user/getUserDetails";

import React, { useMemo, useState } from "react";

export default function TodayPage() {
  const { toast } = useToast();
  const { getId } = getUserDetails();
  const { data: userId } = getId;
  // Keep an ISO-string for “today at midnight” to compare against task.time.end
  const todayDateISO = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString();
  }, []);

  const tomorrowDateISO = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString();
  }, []);

  // Hooks from useTasks
  const { fetchTasks, createTask, updateTask, deleteTask, toggleComplete } =
    useTasks(userId || "");
  const { data: allTasks, isLoading: allTasksLoading } = fetchTasks;

  // 1) DATE RANGE filter (“from” & “to” are plain Date or undefined)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // 2) PRIORITY filter (“all” | “high” | “moderate” | “low”)
  const [filterPriority, setFilterPriority] = useState<string>("all");

  // 3) STATUS filter (“all” | “todo” | “inprogress” | “inreview” | “done” | etc.)
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // 4) Control for the “New Task” sheet dialog
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  // Derive a memoized “filteredTasks” array:
  const filteredTasks = useMemo(() => {
    if (!allTasks) return [];

    // Convert todayDateISO back to a Date for comparisons
    const todayMidnight = new Date(todayDateISO);
    const tomorrowMidnight = new Date(tomorrowDateISO);

    return allTasks.filter((task) => {
      const taskEnd =
        task.time.end instanceof Date ? task.time.end : new Date(task.time.end);
      const taskStart =
        task.time.start instanceof Date
          ? task.time.start
          : new Date(task.time.start);

      //  1) DATE RANGE LOGIC
      if (dateRange.from && dateRange.to) {
        // If both “from” and “to” are chosen, only include tasks whose end date
        // is between (inclusive) dateRange.from … dateRange.to.
        if (taskEnd < dateRange.from || taskStart > dateRange.to) {
          return false;
        }
      } else {
        // If no explicit dateRange is set, default to “only tasks whose end ≥ today and start <= today”
        if (taskEnd < todayMidnight || taskStart > tomorrowMidnight) {
          return false;
        }
      }

      //  2) PRIORITY FILTER
      if (filterPriority !== "all") {
        // If the user picked “high” or “moderate” or “low”, only keep tasks that match
        if (task.priority !== filterPriority) {
          return false;
        }
      }

      //  3) STATUS FILTER
      if (filterStatus !== "all") {
        // If the user picked “done” or “todo” or “inprogress”, only keep tasks that match
        if (task.status !== filterStatus) {
          return false;
        }
      }

      return true;
    });
  }, [allTasks, dateRange, filterPriority, filterStatus, todayDateISO]);

  // Called when the user clicks the checkbox/button to toggle “complete ↔ incomplete”
  const handleToggleComplete = (taskId: string) => {
    toggleComplete.mutate(taskId);
  };

  if (allTasksLoading) {
    return <div>Loading tasks…</div>;
  }

  return (
    <>
      <Card className="bg-background border-none px-4 shadow-none">
        <CardHeader className="flex">
          <div className="flex items-center justify-between w-full gap-2">
            {/*  DATE RANGE PICKER  */}
            <DateRangePicker
              dateRange={dateRange}
              setDateRange={setDateRange}
            />

            <div className="flex items-center gap-2">
              {/*  PRIORITY FILTER  */}
              <PriorityFilter
                filterPriority={filterPriority}
                setFilterPriority={setFilterPriority}
              />

              {/*  STATUS FILTER  */}
              <StatusFilter
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />

              {/*  ADD TASK BUTTON  */}
              <Button onClick={() => setNewTaskOpen(true)}>Add Task</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Pass only the filteredTasks down to TaskTable */}
          <TaskTable
            source="today"
            tasks={filteredTasks}
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
          createNewTask={createTask.mutate}
          updateExistingTask={updateTask.mutate}
          deleteTask={deleteTask.mutate}
        />
      )}
    </>
  );
}
