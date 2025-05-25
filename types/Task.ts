export interface Task {
  id: string;
  title: string;
  status:
    | "todo"
    | "inprogress"
    | "inreview"
    | "done"
    | "waiting"
    | "onhold"
    | "stuck";
  priority: "high" | "moderate" | "low";
  startDate: Date;
  dueDate: Date;
  timeAllocated: string;
  tags: string[];
  category: Category;
  subtasks: Subtask[];
  description?: string;
  completed?: boolean;
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
