import {
  lazy,
  useActionState,
  useCallback,
  useMemo,
  useTransition,
} from "react";
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
import type { Task, Category, TaskTime, TaskColor } from "@/types/Task";

// import { SubTasks } from "../layout/task-sheet-componets/SubTasks";
// import TaskTags from "../layout/task-sheet-componets/TaskTags";
import TaskCategory from "../layout/task-sheet-componets/TaskCategory";
import { TaskStatusPrioritySelects } from "../layout/task-sheet-componets/TaskStsPrio";
import { TaskColorPicker } from "../layout/task-sheet-componets/TaskColor";
import { TitleDescriptionFields } from "../layout/task-sheet-componets/TaskTitleDesc";
// import { TaskTimePicker } from "../layout/task-sheet-componets/TaskTime";

const TaskTimePicker = lazy(() =>
  import("../layout/task-sheet-componets/TaskTime").then((m) => ({
    default: m.TaskTimePicker,
  }))
);

const SubTasks = lazy(() =>
  import("../layout/task-sheet-componets/SubTasks").then((m) => ({
    default: m.SubTasks,
  }))
);

const TaskTags = lazy(() =>
  import("../layout/task-sheet-componets/TaskTags").then((m) => ({
    default: m.TaskTags,
  }))
);

interface TaskSheetProps {
  task: Task | null;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  onSave: (formData: FormData) => Promise<{ error?: string }>;
  onDelete: (taskId: string) => Promise<{ error?: string }>;
  categories: Category[];
}

interface FormState {
  error?: string;
  success?: boolean;
}

const INITIAL_FORM_STATE: FormState = { error: undefined, success: false };

export function TaskSheet({
  task,
  isOpen,
  setOpen,
  categories,
  onSave,
  onDelete,
}: TaskSheetProps) {
  const [isPending, startTransition] = useTransition();

  // Memoized save action to prevent unnecessary re-renders
  const saveActionHandler = useCallback(
    async (prevState: FormState, formData: FormData) => {
      const result = await onSave(formData);
      return result;
    },
    [onSave]
  );

  // Memoized delete action
  const deleteActionHandler = useCallback(
    async (prevState: FormState, taskId: string) => {
      const result = await onDelete(taskId);
      return result;
    },
    [onDelete]
  );

  const [saveState, saveAction, savePending] = useActionState<
    FormState,
    FormData
  >(saveActionHandler, INITIAL_FORM_STATE);

  const [deleteState, deleteAction, deletePending] = useActionState<
    FormState,
    string
  >(deleteActionHandler, INITIAL_FORM_STATE);

  // Memoized default values to prevent recalculation on every render
  const defaultValues = useMemo(() => {
    const getDefaultTime = (): TaskTime => {
      if (task?.time) return task.time;

      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      return {
        start: now,
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
      category: task?.category,
      tags: task?.tags || [],
      subtasks: task?.subtasks || [],
      color: (task?.color as TaskColor) || "sky",
      createdAt: task?.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [task]);

  // Memoized form submission handler
  const handleFormSubmit = useCallback(
    (formData: FormData) => {
      return saveAction(formData);
    },
    [saveAction]
  );

  // Memoized delete handler
  const handleDelete = useCallback(() => {
    if (task?.id) {
      startTransition(() => {
        deleteAction(task.id);
      });
    }
  }, [task?.id, startTransition, deleteAction]);

  // Memoized close handler
  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const isEditing = Boolean(task?.id);

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

        <form action={handleFormSubmit} className="grid gap-4 py-4">
          {/* Hidden fields */}
          {task?.id && <input type="hidden" name="taskId" value={task.id} />}
          <input
            type="hidden"
            name="createdAt"
            value={defaultValues.createdAt}
          />
          <input
            type="hidden"
            name="updatedAt"
            value={defaultValues.updatedAt}
          />

          {/* Form fields */}
          <TitleDescriptionFields
            defaultTitle={defaultValues.title}
            defaultDescription={defaultValues.description}
          />
          <TaskStatusPrioritySelects
            defaultStatus={defaultValues.status}
            defaultPriority={defaultValues.priority}
          />

          <TaskTimePicker defaultTime={defaultValues.time} />
          <TaskCategory
            categories={categories}
            defaultCategory={defaultValues.category}
          />
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
                disabled={deletePending}
                aria-label="Delete task"
              >
                <RiDeleteBinLine size={16} aria-hidden="true" />
              </Button>
            )}

            <div className="flex flex-1 justify-end gap-2">
              <SheetClose asChild>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </SheetClose>

              <Button
                type="submit"
                disabled={savePending}
                onClick={handleClose}
              >
                {savePending ? "Saving..." : "Save"}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default TaskSheet;
