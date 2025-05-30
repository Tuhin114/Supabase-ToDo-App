export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  time: TaskTime;
  tags: string[];
  category: Category;
  subtasks: Subtask[];
  completed?: boolean;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskTime {
  start: Date;
  end: Date;
  timeEstimate: string;
  allDay?: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export type TaskStatus =
  | "todo"
  | "inprogress"
  | "inreview"
  | "done"
  | "waiting"
  | "onhold"
  | "stuck";

export type TaskPriority = "high" | "moderate" | "low";

export type TimeUnit = "mins" | "hrs" | "days" | "weeks" | "months" | "yrs";

export type TaskColor =
  | "sky"
  | "amber"
  | "violet"
  | "rose"
  | "emerald"
  | "orange";
