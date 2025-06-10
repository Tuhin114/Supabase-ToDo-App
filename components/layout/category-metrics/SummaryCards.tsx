import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle } from "lucide-react";
import { CategoryDetails } from "@/types/Category";

interface SummaryCardsProps {
  metrics?: CategoryDetails;
  loading: boolean;
  timeRange: string;
}

export default function SummaryCards({ metrics, loading }: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-8 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  const subtasksCompletionPercentage =
    (metrics.subtasks.completedSubtasks / metrics.subtasks.totalSubtasks) * 100;

  console.log(metrics);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {/* Total Tasks */}
      <Card className="">
        <CardContent className="p-6">
          <div className="text-2xl font-semibold text-foreground mb-1">
            {metrics.tasks.totalTasks}
          </div>
          <div className="text-sm text-muted-foreground">Total Tasks</div>
        </CardContent>
      </Card>

      {/* Completed Rate */}
      <Card className="">
        <CardContent className="p-6">
          <div className="mb-3">
            <Progress
              value={metrics.tasks.completionPercentage}
              className="h-2.5"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {metrics.tasks.completedTasks} / {metrics.tasks.totalTasks} (
            {Math.round(metrics.tasks.completionPercentage)}%)
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Completed Rate
          </div>
        </CardContent>
      </Card>

      {/* Overdue Tasks */}
      <Card className="">
        <CardContent className="p-6">
          <div className="text-2xl font-semibold text-foreground mb-1">
            {metrics.tasks.overdueTasks}
          </div>
          <div className="text-sm text-muted-foreground">Overdue</div>
        </CardContent>
      </Card>

      {/* Time Estimate */}
      <Card className="">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-muted-foreground" />
            <span className="text-lg font-semibold text-foreground">
              {metrics.timeEstimated.totalTimeEstimated}h
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            ({metrics.timeEstimated.timeSpent}h done)
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Time Estimate
          </div>
        </CardContent>
      </Card>

      {/* Subtasks */}
      <Card className="">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-muted-foreground" />
            <span className="text-lg font-semibold text-foreground">
              {metrics.subtasks.completedSubtasks} /{" "}
              {metrics.subtasks.totalSubtasks}
            </span>
          </div>
          <div className="mb-2">
            <Progress value={subtasksCompletionPercentage} className="h-2" />
          </div>
          <div className="text-sm text-muted-foreground">Subtasks</div>
        </CardContent>
      </Card>
    </div>
  );
}
