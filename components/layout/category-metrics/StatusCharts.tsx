import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, Label } from "recharts";

interface StatusDistributionChartProps {
  data?: {
    status: Record<string, number>;
    priority: Record<string, number>;
  };
  timeRange: string;
}

const STATUS_COLORS = {
  todo: "#b45309",
  inprogress: "#f59e0b",
  done: "#fbbf24",
  stuck: "#fef3c7",
  waiting: "#e5e7eb",
  onhold: "#f87171",
  inreview: "#fcd34d",
};

const PRIORITY_COLORS = {
  high: "#92400e", // amber-700
  moderate: "#d97706", // amber-600
  low: "#fbbf24", // amber-400
};

const STATUS_LABELS = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
  stuck: "Stuck",
  waiting: "Waiting",
  onhold: "On Hold",
  inreview: "In Review",
};

const PRIORITY_LABELS = {
  high: "High",
  moderate: "Moderate",
  low: "Low",
};

const getTimeRangeDescription = (timeRange: string): string => {
  switch (timeRange) {
    case "this-week":
      return "Monday - Sunday";
    case "this-month":
      return "Week 1 - Week 4";
    case "this-year":
      return "January - December";
    default:
      return "";
  }
};

const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({
  data,
  timeRange,
}) => {
  const [chartType, setChartType] = useState<"status" | "priority">("status");

  if (!data) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                Task Distribution
              </CardTitle>
              <CardDescription>
                {getTimeRangeDescription(timeRange)}
              </CardDescription>
            </div>
            <Select
              value={chartType}
              onValueChange={(value: "status" | "priority") =>
                setChartType(value)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentData = chartType === "status" ? data.status : data.priority;
  const currentColors =
    chartType === "status" ? STATUS_COLORS : PRIORITY_COLORS;
  const currentLabels =
    chartType === "status" ? STATUS_LABELS : PRIORITY_LABELS;

  if (!currentData) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                Task Distribution
              </CardTitle>
              <CardDescription>
                {getTimeRangeDescription(timeRange)}
              </CardDescription>
            </div>
            <Select
              value={chartType}
              onValueChange={(value: "status" | "priority") =>
                setChartType(value)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No {chartType} data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.entries(currentData)
    .filter(([_, value]) => value > 0)
    .map(([key, value]): { name: string; value: number; fill: string } => ({
      name: currentLabels[key as keyof typeof currentLabels] || key,
      value,
      fill: currentColors[key as keyof typeof currentColors] || "#f59e0b",
    }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const chartConfig = chartData.reduce(
    (config, item) => {
      const configKey = item.name.toLowerCase().replace(/\s+/g, "");
      config[configKey] = {
        label: item.name,
        color: item.fill,
      };
      return config;
    },
    {} as Record<string, { label: string; color: string }>
  );
  // console.log("Time Range Description:", getTimeRangeDescription(timeRange));

  return (
    <Card className="bg-background shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <CardTitle className="text-lg font-semibold">
              Task {chartType === "status" ? "Status" : "Priority"} Distribution
            </CardTitle>
            <CardDescription>
              {getTimeRangeDescription(timeRange)}
            </CardDescription>
          </div>
          <Select
            value={chartType}
            onValueChange={(value: "status" | "priority") =>
              setChartType(value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={120}
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusDistributionChart;
