import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Clock } from "lucide-react";

interface TimeEstimateData {
  totalTimeEstimated: number;
  timeSpent: number;
}

interface TimeEstimateChartProps {
  data?: TimeEstimateData;
}

const TimeEstimateChart: React.FC<TimeEstimateChartProps> = ({ data }) => {
  console.log(data);
  if (!data)
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );

  const remainingHours = data.totalTimeEstimated - data.timeSpent;

  const chartData = [
    {
      name: "Time Estimate",
      completed: data.timeSpent,
      remaining: remainingHours,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-center gap-4 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-muted-foreground" />
          <span className="text-lg font-semibold">
            {data.totalTimeEstimated}h total
          </span>
        </div>
        <div className="text-muted-foreground">•</div>
        <div className="text-green-600 font-medium">
          {data.timeSpent}h completed
        </div>
        <div className="text-muted-foreground">•</div>
        <div className="text-muted-foreground">{remainingHours}h remaining</div>
      </div>
    </div>
  );
};

export default TimeEstimateChart;
