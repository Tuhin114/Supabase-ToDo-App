import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusFilterProps {
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

const statusColors = {
  todo: "bg-gray-500",
  inprogress: "bg-blue-500",
  inreview: "bg-purple-500",
  done: "bg-green-500",
  waiting: "bg-yellow-500",
  onhold: "bg-orange-500",
  stuck: "bg-red-500",
};

export const StatusFilter = ({
  filterStatus,
  setFilterStatus,
}: StatusFilterProps) => {
  return (
    <Select value={filterStatus} onValueChange={setFilterStatus}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent className="">
        <SelectItem value="all" className="">
          Status
        </SelectItem>
        <SelectItem value="todo" className="">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusColors.todo}`}></div>
            To Do
          </div>
        </SelectItem>
        <SelectItem value="inprogress" className="">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${statusColors.inprogress}`}
            ></div>
            In Progress
          </div>
        </SelectItem>
        <SelectItem value="inreview" className="">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${statusColors.inreview}`}
            ></div>
            In Review
          </div>
        </SelectItem>
        <SelectItem value="done" className="">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusColors.done}`}></div>
            Done
          </div>
        </SelectItem>
        <SelectItem value="waiting" className="">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${statusColors.waiting}`}
            ></div>
            Waiting
          </div>
        </SelectItem>
        <SelectItem value="onhold" className="">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${statusColors.onhold}`}
            ></div>
            On Hold
          </div>
        </SelectItem>
        <SelectItem value="stuck" className="">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusColors.stuck}`}></div>
            Stuck
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
