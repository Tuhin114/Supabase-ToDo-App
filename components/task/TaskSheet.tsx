import { lazy, useCallback, useEffect, useMemo, useTransition } from "react";
import { RiDeleteBinLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Task, Category, TaskTime } from "@/types/Task";

import TaskCategory from "../layout/task-sheet/TaskCategory";
import { TaskStatusPrioritySelects } from "../layout/task-sheet/TaskStsPrio";
import { TaskColorPicker } from "../layout/task-sheet/TaskColor";
import { TitleDescriptionFields } from "../layout/task-sheet/TaskTitleDesc";
// import { createNewTask, updateTask } from "@/actions/task/action";

const TaskTimePicker = lazy(() =>
  import("../layout/task-sheet/TaskTime").then((m) => ({
    default: m.TaskTimePicker,
  }))
);

const SubTasks = lazy(() =>
  import("../layout/task-sheet/SubTasks").then((m) => ({
    default: m.SubTasks,
  }))
);

const TaskTags = lazy(() =>
  import("../layout/task-sheet/TaskTags").then((m) => ({
    default: m.TaskTags,
  }))
);

interface TaskSheetProps {
  task: Task | null;
  startTime: Date;
  isOpen: boolean;
  category?: Category | null;
  createNewTask: (formData: FormData) => void;
  updateExistingTask: (formData: FormData) => void;
  deleteTask: (taskId: string) => void;
  setOpen: (open: boolean) => void;
}

export default function TaskSheet({
  task,
  startTime,
  isOpen,
  setOpen,
  category,
  createNewTask,
  updateExistingTask,
  deleteTask,
}: TaskSheetProps) {
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(task?.id);

  // Memoized default values
  const defaultValues = useMemo(() => {
    const getDefaultTime = (): TaskTime => {
      if (task?.time) return task.time;

      // Snap to 15-minute intervals
      const snapTime = new Date(startTime);
      const minutes = snapTime.getMinutes();
      const remainder = minutes % 15;

      if (remainder !== 0) {
        const adjustment = remainder < 7.5 ? -remainder : 15 - remainder;
        snapTime.setMinutes(minutes + adjustment);
        snapTime.setSeconds(0);
        snapTime.setMilliseconds(0);
      }

      const oneHourLater = new Date(snapTime.getTime() + 60 * 60 * 1000);

      return {
        start: snapTime,
        end: oneHourLater,
        timeEstimate: "1 hr",
        allDay: false,
      };
    };

    return {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "todo",
      priority: task?.priority || "moderate",
      time: task?.time || getDefaultTime(),
      category: task?.category || category,
      tags: task?.tags || [],
      subtasks: task?.subtasks || [],
      color: task?.color || "sky",
    };
  }, [task, startTime]);

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      console.log("Form Data:", formData);
      startTransition(() => {
        try {
          if (task?.id) {
            formData.append("taskId", task.id);
            updateExistingTask(formData);
          } else {
            createNewTask(formData);
          }
          setOpen(false);
        } catch (error) {
          console.error("Error submitting task:", error);
          // Add toast or alert here if needed
        }
      });
    },
    [isEditing, task?.id, setOpen]
  );

  const handleDelete = useCallback(async () => {
    if (!task?.id) return;

    startTransition(() => {
      try {
        deleteTask(task.id);
        setOpen(false);
      } catch (error) {
        console.error("Failed to delete task:", error);
        // Handle error - you can add toast notification here
      }
    });
  }, [task?.id, setOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="sm:max-w-[425px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Task" : "Create Task"}</SheetTitle>
          <SheetDescription className="sr-only">
            {isEditing
              ? "Edit the details of this task"
              : "Add a new task to your calendar"}
          </SheetDescription>
        </SheetHeader>

        <form action={handleSubmit} className="grid gap-4 py-4">
          <TitleDescriptionFields
            defaultTitle={defaultValues.title}
            defaultDescription={defaultValues.description}
          />

          <TaskStatusPrioritySelects
            defaultStatus={defaultValues.status}
            defaultPriority={defaultValues.priority}
          />

          <TaskTimePicker defaultTime={defaultValues.time} />

          <TaskCategory defaultCategory={defaultValues.category} />

          <TaskTags defaultTags={defaultValues.tags} />

          <SubTasks defaultSubtasks={defaultValues.subtasks} />

          <TaskColorPicker defaultColor={defaultValues.color} />

          <SheetFooter className="flex-row sm:justify-between">
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDelete}
                disabled={isPending}
                aria-label="Delete task"
              >
                <RiDeleteBinLine size={16} aria-hidden="true" />
              </Button>
            )}

            <div className="flex flex-1 justify-end gap-2">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>

              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
