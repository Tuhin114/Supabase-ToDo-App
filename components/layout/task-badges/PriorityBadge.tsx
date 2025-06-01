import { Task } from "@/types/Task";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";

interface PriorityBadgeProps {
  priority: Task["priority"];
}

const priorityConfig = {
  high: {
    label: "High",
    className:
      "bg-red-100 text-red-700 border border-red-400 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
    icon: <ArrowUp className="w-5 h-5" />,
  },
  moderate: {
    label: "Moderate",
    className:
      "bg-amber-100 text-amber-700 border border-amber-400 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
    icon: <ArrowRight className="w-5 h-5" />,
  },
  low: {
    label: "Low",
    className:
      "bg-green-100 text-green-700 border border-green-400 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    icon: <ArrowDown className="w-5 h-5" />,
  },
};

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const config = priorityConfig[priority];

  return (
    // <span
    //   className={`
    //     inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold
    //     transition-all duration-200 hover:shadow-lg transform hover:scale-105
    //     ${config.className}
    //   `}
    // >
    //   <span className="text-xs">{config.icon}</span>
    //   {config.label}
    // </span>
    <div className="flex items-center space-x-2">
      <span className="text-xs text-muted-foreground">{config.icon}</span>
      <span className="font-medium">{config.label}</span>
    </div>
  );
};
