import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { createNewTask, deleteTask, updateTask } from "@/actions/task/action"; // server actions
import { TaskUpdateInput } from "@/app/(user-pages)/user/[id]/(tasks)/calendar/page";
import { Task, TaskTime } from "@/types/Task";

const getSupabase = () => createClient();

export function useTasks(userId: string) {
  const queryClient = useQueryClient();

  // Fetch all tasks for a user
  const fetchTasks = useQuery({
    queryKey: ["tasks", userId],
    queryFn: async () => {
      const supabase = getSupabase();

      const { data: allTasks, error } = await supabase
        .from("tasks")
        .select(
          `
        *,
        category:category_id (
          id,
          name
        ),
        subtasks:subtasks (
          id,
          title,
          completed
        )
      `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return allTasks;
    },
    enabled: !!userId,
  });

  // Create a new task
  const create = useMutation({
    mutationFn: async (formData: FormData) => {
      console.log("Creating new task...", formData);
      await createNewTask(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", userId] });
    },
  });

  // Update an existing task
  const update = useMutation({
    mutationFn: async (input: TaskUpdateInput) => await updateTask(input),

    // Optimistic update before server responds
    onMutate: async (input) => {
      const { taskId, time } = input as { taskId: string; time: TaskTime };

      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ["tasks", userId] });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", userId]);
      console.log("previousTasks", previousTasks);

      // Optimistically update the task's time
      queryClient.setQueryData<Task[]>(["tasks", userId], (old = []) =>
        old.map((task) => {
          if (task.id !== taskId) {
            return task;
          }
          // Build the optimistic “server” shape, exactly like Supabase would:
          const optimisticTime = {
            start: time.start.toISOString(),
            end: time.end.toISOString(),
          };

          return {
            ...task,
            time: {
              ...task.time, // preserve existing time properties including timeEstimate
              start: new Date(optimisticTime.start),
              end: new Date(optimisticTime.end),
            },
          };
        })
      );

      console.log("newTasks", queryClient.getQueryData(["tasks", userId]));

      // Return snapshot for rollback
      return { previousTasks };
    },

    // Rollback if there's an error
    onError: (_err, _input, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", userId], context.previousTasks);
      }
    },

    // Always refetch after mutation to sync with DB
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", userId] });
    },
  });

  // Delete a task
  const remove = useMutation({
    mutationFn: async (id: string) => await deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", userId] });
    },
  });

  // Toggle task completion
  const toggleComplete = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/task/toggle_complete", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Failed to toggle task");
      }

      return res.json(); // updated task
    },

    // 🔥 Optimistic update
    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", userId] });

      const previousTasks = queryClient.getQueryData<any[]>(["tasks", userId]);

      queryClient.setQueryData(["tasks", userId], (old: any[] = []) =>
        old.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed: !task.completed,
                status: task.completed ? "todo" : "done",
              }
            : task
        )
      );

      return { previousTasks }; // store to rollback on error
    },

    // ✅ If mutation fails, rollback to previous
    onError: (err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", userId], context.previousTasks);
      }
    },

    // 🔄 Refetch after mutation settles
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", userId] });
    },
  });

  return {
    fetchTasks,
    createTask: create,
    updateTask: update,
    deleteTask: remove,
    toggleComplete,
  };
}
