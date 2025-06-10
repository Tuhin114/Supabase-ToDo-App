"use client";

import { useMemo, useState, useCallback } from "react";
import { useCategoryDetails } from "@/hooks/categories/useCategoryDetails";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TimingFilter from "../page/TimingFilter";
import SummaryCards from "../category-metrics/SummaryCards";
import ChartsGrid from "../category-metrics/ChartsGrid";
import { TaskTable } from "@/components/task/TaskTable";
import { getUserDetails } from "@/hooks/user/getUserDetails";
import { useTasks } from "@/hooks/task/useTasks";
import { Task } from "@/types/Task";
import { Button } from "@/components/ui/button";
import TaskSheet from "@/components/task/TaskSheet";
import { useCategories } from "@/hooks/categories/useCategories";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { CategoryUpdateModal } from "./UpdateModal";
import { CategoryDeleteModal } from "./DeleteCategoryModal";

interface props {
  categoryId: string;
}

export default function CategoryMetrics({ categoryId }: props) {
  const [range, setRange] = useState("this-week");
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { getId } = getUserDetails();
  const { data: userId } = getId;

  const { fetchTasks, createTask, updateTask, deleteTask, toggleComplete } =
    useTasks(userId || "", categoryId, range);
  const { data: tasks } = fetchTasks;

  const { getCategoryMetrics } = useCategoryDetails();
  const {
    fetchCategories,
    getCategoryNameById,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const { data = [], error, isLoading } = getCategoryMetrics(categoryId, range);

  // Memoize category name to prevent unnecessary re-renders
  const categoryName = useMemo(() => {
    return getCategoryNameById(categoryId);
  }, [getCategoryNameById, categoryId, fetchCategories.data]);

  if (error) {
    // Handle error
  }

  const categoryTasks = useMemo(() => {
    console.log("tasks", tasks);
    if (!tasks) return [];

    return tasks.filter((task: Task) => task.category.id === categoryId);
  }, [tasks, categoryId]);

  const handleToggleComplete = useCallback(
    (taskId: string) => {
      toggleComplete.mutate(taskId);
    },
    [toggleComplete]
  );

  // const handleUpdateCategory = useCallback(
  //   (data: { id: string; name: string }) => {
  //     updateCategory.mutate(data);
  //   },
  //   [updateCategory]
  // );

  // const handleDeleteCategory = useCallback(() => {
  //   deleteCategory.mutate(categoryId);
  // }, [deleteCategory, categoryId]);

  // const handleCloseUpdateModal = useCallback(() => {
  //   setUpdateModalOpen(false);
  // }, []);

  // const handleCloseDeleteModal = useCallback(() => {
  //   setDeleteModalOpen(false);
  // }, []);

  // const handleOpenUpdateModal = useCallback(() => {
  //   setUpdateModalOpen(true);
  // }, []);

  // const handleOpenDeleteModal = useCallback(() => {
  //   setDeleteModalOpen(true);
  // }, []);

  return (
    <>
      <Card className="bg-background border-none px-4 shadow-none">
        <CardHeader className="flex">
          <div className="flex items-center justify-between w-full gap-2">
            <TimingFilter
              source="categories"
              value={range}
              onChange={setRange}
            />
            <div className="flex items-center gap-2">
              <Button onClick={() => setNewTaskOpen(true)}>Add Task</Button>

              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleOpenUpdateModal}
                    className="cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Category
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleOpenDeleteModal}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Category
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="flex flex-col gap-6">
              <SummaryCards
                metrics={data}
                loading={isLoading}
                timeRange={range}
              />
              <ChartsGrid
                metrics={data}
                loading={isLoading}
                timeRange={range}
              />
            </div>
          )}

          <TaskTable
            tasks={categoryTasks}
            source="categories"
            handleToggleComplete={handleToggleComplete}
            createNewTask={createTask.mutate}
            updateExistingTask={updateTask.mutate}
            deleteTask={deleteTask.mutate}
            timeTab={range}
          />
        </CardContent>
      </Card>

      {newTaskOpen && (
        <TaskSheet
          task={null}
          startTime={new Date()}
          isOpen={newTaskOpen}
          setOpen={setNewTaskOpen}
          category={{ id: categoryId, name: categoryName }}
          createNewTask={createTask.mutate}
          updateExistingTask={updateTask.mutate}
          deleteTask={deleteTask.mutate}
        />
      )}

      {/* <CategoryUpdateModal
        isOpen={updateModalOpen}
        onClose={handleCloseUpdateModal}
        categoryId={categoryId}
        categoryName={categoryName}
        onUpdate={handleUpdateCategory}
        isLoading={updateCategory.isPending}
      />

      <CategoryDeleteModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        categoryName={categoryName}
        onDelete={handleDeleteCategory}
        isLoading={deleteCategory.isPending}
      /> */}
    </>
  );
}
