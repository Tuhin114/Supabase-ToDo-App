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
  category: "personal" | "work";
  subtasks: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  description?: string;
  completed?: boolean;
}
