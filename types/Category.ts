export type CategoryDetails = {
  id: string;
  name: string;
  tasks: {
    totalTasks: number;
    completedTasks: number;
    completionPercentage: number;
    overdueTasks: number;
  };
  timeEstimated: {
    totalTimeEstimated: number;
    timeSpent: number;
  };
  priority: {
    high: number;
    moderate: number;
    low: number;
  };
  status: {
    todo: number;
    inprogress: number;
    inreview: number;
    done: number;
    waiting: number;
    onhold: number;
    stuck: number;
  };
  subtasks: {
    totalSubtasks: number;
    completedSubtasks: number;
  };
  trend?: Array<{
    label: string;
    count: {
      totalTasks: number;
      completedTasks: number;
      overdueTasks: number;
      totalTimeEstimated: number;
      timeSpent: number;
      totalSubtasks: number;
      completedSubtasks: number;
    };
  }>;
};
