import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PriorityFilterProps {
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
}

export const PriorityFilter = ({
  filterPriority,
  setFilterPriority,
}: PriorityFilterProps) => {
  return (
    <Select value={filterPriority} onValueChange={setFilterPriority}>
      <SelectTrigger className="w-40 ">
        <SelectValue placeholder="All Priority" />
      </SelectTrigger>
      <SelectContent className="">
        <SelectItem value="all" className="">
          All Priority
        </SelectItem>
        <SelectItem value="high" className="">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            High
          </div>
        </SelectItem>
        <SelectItem value="moderate" className="">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            Moderate
          </div>
        </SelectItem>
        <SelectItem value="low" className="">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Low
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
