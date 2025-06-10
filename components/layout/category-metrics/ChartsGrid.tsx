import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusDistributionChart from "./StatusCharts";
import { TaskAndSubTaskTrend } from "./TaskAndSubTaskTrend";
import TimeEstimateChart from "./TimeEstemateChart";

interface ChartsGridProps {
  metrics?: any;
  loading: boolean;
  timeRange: string;
}

const ChartsGrid: React.FC<ChartsGridProps> = ({
  metrics,
  loading,
  timeRange,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="animate-pulse">
          <CardContent className="p-6 h-80">
            <div className="h-full bg-muted rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardContent className="p-6 h-80">
            <div className="h-full bg-muted rounded"></div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 animate-pulse">
          <CardContent className="p-6 h-80">
            <div className="h-full bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* First Row - Two Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusDistributionChart data={metrics} timeRange={timeRange} />
        <TaskAndSubTaskTrend data={metrics.trend} />
      </div>

      {/* Second Row - Full Width Chart */}
      <Card className="border bg-background">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Time Estimate Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <TimeEstimateChart data={metrics.timeEstimated} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsGrid;
