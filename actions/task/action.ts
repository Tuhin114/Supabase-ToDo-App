"use server";

import {
  Category,
  Subtask,
  Task,
  TaskColor,
  TaskPriority,
  TaskStatus,
  TaskTime,
} from "@/types/Task";
import { parseFormData } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { use } from "react";

type TaskUpdateInput = FormData | { taskId: string; time: TaskTime };

export async function createNewTask(formData: FormData) {
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    const user_id = user.data.user?.id;
    if (!user_id) throw new Error("Not authenticated");

    console.log(formData);
    const payload = parseFormData(formData);
    console.log(payload);

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
    };

    // 1. Get or Create Category
    let category_id: string | null = null;
    if (newTask.category) {
      const { data: existingCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("user_id", user_id)
        .eq("name", newTask.category.name)
        .maybeSingle();

      if (existingCategory) {
        category_id = existingCategory.id;
      } else {
        const { data: newCategory, error: catErr } = await supabase
          .from("categories")
          .insert({ name: newTask.category.name, user_id })
          .select("id")
          .single();
        if (catErr) throw new Error(catErr.message);
        category_id = newCategory.id;
      }
    }

    // 2. Create the task
    const { category, subtasks, ...newTaskWithoutCategoryAndSubtasks } =
      newTask;

    const { data: newTaskData, error: taskError } = await supabase
      .from("tasks")
      .insert({
        ...newTaskWithoutCategoryAndSubtasks,
        category_id,
        user_id,
      })
      .select("id")
      .single();

    if (taskError) throw new Error(taskError.message);

    const taskId = newTaskData.id;

    // 3. Create subtasks if any
    if (newTask.subtasks.length > 0) {
      const subtaskInserts = newTask.subtasks.map((sub) => ({
        task_id: taskId,
        category_id,
        title: sub.title,
        completed: sub.completed,
      }));

      const { error: subError } = await supabase
        .from("subtasks")
        .insert(subtaskInserts);

      if (subError) throw new Error(subError.message);
    }

    return {
      message: "Task created successfully.",
      task: { ...newTask, id: taskId },
      isUpdate: false,
    };
  } catch (err: any) {
    console.error("[Error in createNewTask]:", err);
    return { error: "Failed to create task. Please try again." };
  }
}

export async function updateTask(input: TaskUpdateInput) {
  console.log(input);
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    const user_id = user.data.user?.id;
    if (!user_id) throw new Error("Not authenticated");

    let payload: any;
    const isFullUpdate =
      typeof FormData !== "undefined" && input instanceof FormData;

    if (isFullUpdate) {
      payload = parseFormData(input as FormData);
    } else {
      payload = {
        taskId: (input as { taskId: string; time: TaskTime }).taskId,
        time: (input as { taskId: string; time: TaskTime }).time,
      };
    }
    console.log(payload);
    const taskId = payload.taskId as string;
    console.log(user_id, taskId);

    // 1. Get existing task
    const { data: existingTask, error: existingError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .eq("user_id", user_id)
      .single();

    if (existingError || !existingTask) {
      throw new Error("Task not found or access denied.");
    }

    // 2. Handle category
    let category_id: string | null = null;
    if (isFullUpdate && payload.category) {
      const { data: existingCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("user_id", user_id)
        .eq("name", payload.category.name)
        .maybeSingle();

      if (existingCategory) {
        category_id = existingCategory.id;
      } else {
        const { data: newCategory, error: catErr } = await supabase
          .from("categories")
          .insert({ name: payload.category.name, user_id })
          .select("id")
          .single();
        if (catErr) throw new Error(catErr.message);
        category_id = newCategory.id;
      }
    }

    // 3. Prepare update fields
    const updatedFields: Partial<Task> = {
      time: payload.time,
    };

    if (isFullUpdate) {
      Object.assign(updatedFields, {
        title: payload.title,
        description: payload.description,
        status: payload.status,
        priority: payload.priority,
        tags: payload.tags,
        color: payload.color as TaskColor,
        completed: false,
        category_id,
      });
    }

    // 4. Update task
    const { error: updateError } = await supabase
      .from("tasks")
      .update(updatedFields)
      .eq("id", taskId)
      .eq("user_id", user_id);

    if (updateError) throw new Error(updateError.message);

    // 5. Update subtasks if needed
    if (isFullUpdate && payload.subtasks?.length >= 0) {
      // Delete old subtasks
      await supabase.from("subtasks").delete().eq("task_id", taskId);

      // Insert new subtasks
      if (payload.subtasks.length > 0) {
        const subtaskInserts = payload.subtasks.map((sub: Subtask) => ({
          task_id: taskId,
          category_id,
          title: sub.title,
          completed: sub.completed,
        }));

        const { error: subError } = await supabase
          .from("subtasks")
          .insert(subtaskInserts);

        if (subError) throw new Error(subError.message);
      }
    }

    return {
      message: isFullUpdate
        ? "Task updated successfully."
        : "Task time updated.",
      task: { id: taskId, ...updatedFields } as Task,
      isUpdate: true,
    };
  } catch (err: any) {
    console.error("[Error in updateTask]:", err);
    return { error: "Failed to update task. Please try again." };
  }
}

export async function deleteTask(taskId: string) {
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    const user_id = user.data.user?.id;
    if (!user_id) throw new Error("Not authenticated");

    const { error: deleteError } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", user_id);

    // Delete subtasks if exists
    const { error: subError } = await supabase
      .from("subtasks")
      .delete()
      .eq("task_id", taskId);

    if (deleteError) throw new Error(deleteError.message);

    return { message: "Task deleted successfully." };
  } catch (err: any) {
    console.error("[Error in deleteTask]:", err);
    return { error: "Failed to delete task. Please try again." };
  }
}
