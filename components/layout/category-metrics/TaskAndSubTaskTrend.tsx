"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InputDataType {
  label: string;
  count: {
    totalTasks: number;
    completedTasks: number;
    totalSubtasks: number;
    completedSubtasks: number;
  };
}

interface Props {
  data: InputDataType[];
}

export function TaskAndSubTaskTrend({ data }: Props) {
  const [view, setView] = useState<"tasks" | "subtasks">("tasks");

  const chartData = data.map((item) => ({
    label: item.label,
    completed:
      view === "tasks"
        ? item.count.completedTasks
        : item.count.completedSubtasks,
    remaining:
      view === "tasks"
        ? item.count.totalTasks - item.count.completedTasks
        : item.count.totalSubtasks - item.count.completedSubtasks,
  }));

  const chartConfig: ChartConfig = {
    completed: {
      label: "Completed",
      color: "#92400e",
    },
    remaining: {
      label: "Remaining",
      color: "#d97706",
    },
  };

  return (
    <Card className="bg-background shadow-none">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-lg font-semibold">
            {view === "tasks" ? "Tasks" : "Subtasks"} Trends
          </CardTitle>
          <CardDescription>Tracked over time</CardDescription>
        </div>
        <Select
          value={view}
          onValueChange={(val) => setView(val as "tasks" | "subtasks")}
        >
          <SelectTrigger className="w-[120px] h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tasks">Tasks</SelectItem>
            <SelectItem value="subtasks">Subtasks</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="remaining"
              stackId="a"
              fill="var(--color-remaining)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="completed"
              stackId="a"
              fill="var(--color-completed)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="text-muted-foreground">
          Showing {view} progress over the last few months
        </div>
      </CardFooter>
    </Card>
  );
}
