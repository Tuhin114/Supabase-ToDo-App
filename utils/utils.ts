import {
  Category,
  Subtask,
  Task,
  TaskColor,
  TaskPriority,
  TaskStatus,
  TaskTime,
} from "@/types/Task";
import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function parseFormData(formData: FormData) {
  const getString = (key: string): string =>
    (formData.get(key) as string) || "";
  const getBoolean = (key: string): boolean => formData.get(key) === "true";
  const getJsonArray = <T>(key: string, fallback: T[] = []): T[] => {
    try {
      const value = formData.get(key) as string;
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  return {
    taskId: getString("taskId"), // For update identification
    title: getString("title"),
    description: getString("description"),
    status: getString("status") as TaskStatus,
    priority: getString("priority") as TaskPriority,
    category: {
      id: getString("categoryId"),
      name: getString("categoryName"),
    } as Category,
    color: getString("color") as TaskColor,
    tags: getJsonArray<string>("tags"),
    subtasks: getJsonArray<Subtask>("subtasks"),
    time: {
      start: new Date(getString("timeStart")),
      end: new Date(getString("timeEnd")),
      timeEstimate: getString("timeEstimate"),
      allDay: getBoolean("allDay"),
    } as TaskTime,
    createdAt: new Date(getString("createdAt")),
    updatedAt: new Date(getString("updatedAt")),
  };
}
