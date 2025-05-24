import { Task } from "@/types/Task";

interface StatusBadgeProps {
  status: Task["status"];
}

const statusConfig = {
  todo: {
    label: "To Do",
    className:
      "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300",
    hoverClassName: "hover:from-gray-200 hover:to-gray-300",
  },
  inprogress: {
    label: "In Progress",
    className:
      "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-blue-300",
    hoverClassName: "hover:from-blue-200 hover:to-blue-300",
  },
  inreview: {
    label: "In Review",
    className:
      "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-purple-300",
    hoverClassName: "hover:from-purple-200 hover:to-purple-300",
  },
  done: {
    label: "Done",
    className:
      "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300",
    hoverClassName: "hover:from-green-200 hover:to-green-300",
  },
  waiting: {
    label: "Waiting",
    className:
      "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border-yellow-300",
    hoverClassName: "hover:from-yellow-200 hover:to-yellow-300",
  },
  onhold: {
    label: "On Hold",
    className:
      "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border-orange-300",
    hoverClassName: "hover:from-orange-200 hover:to-orange-300",
  },
  stuck: {
    label: "Stuck",
    className:
      "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-red-300",
    hoverClassName: "hover:from-red-200 hover:to-red-300",
  },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <div className="flex items-center space-x-2">
      <StatusDot status={status} />
      <span className="font-medium">{config.label}</span>
    </div>
  );
};

type Status =
  | "todo"
  | "inprogress"
  | "inreview"
  | "done"
  | "waiting"
  | "onhold"
  | "stuck";

interface StatusDotProps {
  status: Status;
  className?: string;
}

/**
 * A small colored circle indicating status.
 * Mimics Vercel’s “ready” green dot, etc.
 */
export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  className = "",
}) => {
  const colorMap: Record<Status, string> = {
    todo: "bg-gray-400",
    inprogress: "bg-blue-400",
    inreview: "bg-purple-400",
    done: "bg-green-400",
    waiting: "bg-yellow-400",
    onhold: "bg-orange-400",
    stuck: "bg-red-400",
  };

  const dotClass = `${colorMap[status]} ${status === "inprogress" ? "animate-pulse" : ""}`;

  return (
    <span
      className={`
    inline-block h-2.5 w-2.5 rounded-full transition-all duration-200
    ${dotClass} ${className}
  `}
      aria-label={status}
      title={status.charAt(0).toUpperCase() + status.slice(1)}
    />
  );
};
