import { ChevronRightIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "@radix-ui/react-dropdown-menu";

type Task = {
  id: string;
  title: string;
  list: string;
  dueDate: string | null;
  subtaskCount: number;
};

export const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <div>
      <div className="items-center justify-between rounded-lg transition">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Input
              type="checkbox"
              className="h-5 w-5 border border-gray-300 rounded"
            />
            <span className="font-medium">{task.title}</span>

            <Badge variant="secondary" className="text-sm font-sans capitalize">
              {task.list}
            </Badge>
          </div>
          <Button variant="ghost" size="icon">
            <ChevronRightIcon />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          {task.dueDate && (
            <Badge variant="outline" className="text-sm font-sans">
              📅 {task.dueDate}
            </Badge>
          )}
          {task.subtaskCount > 0 && (
            <Badge className="rounded-full text-sm bg-secondary text-secondary-foreground">
              🗂️ {task.subtaskCount}
            </Badge>
          )}
          <Badge variant="secondary" className="text-sm font-sans capitalize">
            {task.list}
          </Badge>
        </div>
      </div>
      {/* <Separator className="my-2 h-[0.25px] bg-border" /> */}
    </div>
  );
};
