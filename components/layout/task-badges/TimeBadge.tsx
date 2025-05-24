import { Clock } from "lucide-react";

interface TimeBadgeProps {
  time: string;
}

export const TimeBadge = ({ time }: TimeBadgeProps) => {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 border border-indigo-200 hover:shadow-md transition-all duration-200">
      <Clock className="h-3 w-3" />
      {time}
    </span>
  );
};
