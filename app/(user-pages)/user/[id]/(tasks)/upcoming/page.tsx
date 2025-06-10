// app/user/[id]/upcoming/page.tsx (or wherever your path is)
"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TaskTable } from "@/components/task/TaskTable";
import { useTasks } from "@/hooks/task/useTasks";
import { getUserDetails } from "@/hooks/user/getUserDetails";
import { filterTasksByTimeRange } from "@/utils/utils";
import TimingFilter from "@/components/layout/page/TimingFilter";

// → Import our newly updated components & types:
import CustomizedFilter, {
  StatusType,
  PriorityType,
} from "@/components/layout/page/CustomizeFilter";
import { TaskSearch } from "@/components/layout/page/TaskSearch";
import { Button } from "@/components/ui/button";
import TaskSheet from "@/components/task/TaskSheet";

export default function UpcomingPage() {
  // 1) Time‐range tab state
  const [activeRange, setActiveRange] = useState("tomorrow");

  // 2) “CustomizedFilter” selections
  const [selectedStatus, setSelectedStatus] = useState<StatusType[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<PriorityType[]>([]);

  // 3) “Search” query state
  const [searchQuery, setSearchQuery] = useState("");

  // 4) Fetch all tasks via your hook
  const { getId } = getUserDetails();
  const { data: userId } = getId;
  const { fetchTasks, createTask, updateTask, deleteTask, toggleComplete } =
    useTasks(userId || "");
  const { data: allTasks = [], isLoading: allTasksLoading } = fetchTasks;

  // Add Task
  const [newTaskOpen, setNewTaskOpen] = useState(false);

  // 5) First‐pass: filter by time‐range (“Tomorrow”, “This Week”, etc.)
  const timeFilteredTasks = useMemo(() => {
    if (!allTasks) return [];
    return filterTasksByTimeRange(allTasks, activeRange);
  }, [allTasks, activeRange]);

  // 6) Second‐pass: apply status + priority + search
  const fullyFilteredTasks = useMemo(() => {
    return timeFilteredTasks.filter((task) => {
      // A) STATUS
      if (
        selectedStatus.length > 0 &&
        !selectedStatus.includes(task.status as StatusType)
      ) {
        return false;
      }

      // B) PRIORITY
      if (
        selectedPriority.length > 0 &&
        !selectedPriority.includes(task.priority as PriorityType)
      ) {
        return false;
      }

      // C) SEARCH (search only by title; you can expand to description/tags if desired)
      if (searchQuery.trim() !== "") {
        const lowercaseTitle = task.title.toLowerCase();
        const lowercaseQuery = searchQuery.toLowerCase();
        if (!lowercaseTitle.includes(lowercaseQuery)) {
          return false;
        }
      }

      return true;
    });
  }, [timeFilteredTasks, selectedStatus, selectedPriority, searchQuery]);

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
            {/* 1) Time‐range tabs */}
            <TimingFilter
              source="upcoming"
              value={activeRange}
              onChange={setActiveRange}
            />

            {/* 2) CustomizedFilter + TaskSearch + Add Task */}
            <div className="flex items-center gap-2">
              <CustomizedFilter
                selectedStatus={selectedStatus}
                selectedPriority={selectedPriority}
                onSave={(newStatus, newPriority) => {
                  setSelectedStatus(newStatus);
                  setSelectedPriority(newPriority);
                }}
                onClear={() => {
                  setSelectedStatus([]);
                  setSelectedPriority([]);
                }}
              />

              <TaskSearch onSearch={(q) => setSearchQuery(q)} />
              <Button onClick={() => setNewTaskOpen(true)}>Add Task</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <TaskTable
            tasks={fullyFilteredTasks}
            source="upcoming"
            timeTab={activeRange}
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
