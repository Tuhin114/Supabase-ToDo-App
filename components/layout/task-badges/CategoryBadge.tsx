import { Task } from "@/types/Task";

interface CategoryBadgeProps {
  category: Task["category"];
}

const categoryConfig: Record<string, { label: string }> = {
  work: {
    label: "Work",
  },
  personal: {
    label: "Personal",
  },
};

export const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  // const config = categoryConfig[category];

  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border
        transition-all duration-200 hover:shadow-md transform hover:scale-105"
    >
      {/* {config.label} */}
      {category?.name}
    </span>
  );
};
