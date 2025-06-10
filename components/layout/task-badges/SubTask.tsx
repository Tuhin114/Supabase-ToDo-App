import { Progress } from "@/components/ui/progress";
import { Subtask } from "@/types/Task";

export default function SubTask({ subtask }: { subtask: Subtask[] }) {
  const totalSubtasks = subtask.length;
  const completedSubtasks = subtask.filter((sub) => sub.completed).length;
  const progress = (completedSubtasks / totalSubtasks) * 100;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm">
        {completedSubtasks}/{totalSubtasks}
      </span>
      <Progress value={progress} className="h-1 w-16" />
    </div>
  );
}
